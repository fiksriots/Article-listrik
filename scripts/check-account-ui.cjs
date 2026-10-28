const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
(async()=>{
 const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3100'],{stdio:'ignore'});let browser;
 try {
  let ready=false;for(let i=0;i<100;i++){try{if((await fetch('http://127.0.0.1:3100/akun')).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,250));}assert.ok(ready,'Production server starts');
  assert.equal((await fetch('http://127.0.0.1:3100/api/auth/session')).status,200);
  assert.equal((await fetch('http://127.0.0.1:3100/api/auth/providers')).status,503);
  browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox']});
  for(const width of [390,1440]){
   const context=await browser.newContext({viewport:{width,height:1000}});const page=await context.newPage();const errors=[];const remote=[];
   page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.url().includes('supabase'))remote.push(r.url());});
   await page.goto('http://127.0.0.1:3100/akun');const button=page.getByRole('button',{name:'Masuk dengan Google',exact:true});await button.waitFor();assert.equal(await button.isDisabled(),true);const guest=page.getByRole('link',{name:'Belajar tanpa akun',exact:false});const buttonBox=await button.boundingBox();const guestBox=await guest.boundingBox();assert.ok(guestBox.y>=buttonBox.y+buttonBox.height,'Guest action must be below Google button');assert.ok(buttonBox.height>=44);await page.screenshot({path:'/tmp/account-'+width+'.png',fullPage:true});assert.equal(await page.locator('input[type=password]').count(),0);await page.getByText('Login Google sedang disiapkan.',{exact:false}).waitFor();
   await page.evaluate(()=>localStorage.setItem('fiks-learning-v2:guest',JSON.stringify({'listrik/apa-itu-listrik':{completed:true,dirty:true,revision:'test'}})));
   const rows=new Map([['git/apa-itu-git',{academy:'git',lesson_slug:'apa-itu-git',completed:true}]]);await context.route('**/api/progress',async route=>{const request=route.request();if(request.method()==='PUT'){for(const row of request.postDataJSON().rows)rows.set(row.academy+'/'+row.lesson_slug,row);return route.fulfill({json:{ok:true}});}return route.fulfill({json:{rows:[...rows.values()]}});});
   await context.route('**/api/auth/session',r=>r.fulfill({json:{user:{id:'google:test',name:'Pelajar Uji',email:'fixture@example.invalid'},expires:new Date(Date.now()+3600000).toISOString()}}));
   await page.reload();await page.getByText('Pelajar Uji',{exact:true}).waitFor();await page.getByText('✓ Progres akun sudah tersinkron.',{exact:true}).first().waitFor();assert.equal(rows.get('listrik/apa-itu-listrik').completed,true);assert.match(await page.evaluate(()=>localStorage.getItem('fiks-learning-v2:google:test')),/apa-itu-listrik/);
   await page.reload();await page.getByText('✓ Progres akun sudah tersinkron.',{exact:true}).first().waitFor();
   await page.evaluate(()=>localStorage.clear());await page.reload();await page.getByText('✓ Progres akun sudah tersinkron.',{exact:true}).first().waitFor();assert.match(await page.evaluate(()=>localStorage.getItem('fiks-learning-v2:google:test')),/apa-itu-listrik/);
   const card=name=>page.getByRole('article').filter({has:page.getByRole('heading',{name,exact:true})});
   await card('Learn Electric').getByText('1 dari 44 materi selesai',{exact:true}).waitFor();
   await card('Learn Electric').locator('summary').click();await card('Learn Electric').getByRole('heading',{name:'Dasar dan keselamatan',exact:true}).waitFor();
   await card('Learn Git').getByText('1 dari 48 materi selesai',{exact:true}).waitFor();await card('Learn Git').locator('summary').click();await card('Learn Git').getByRole('heading',{name:'GitHub',exact:true}).waitFor();
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:'/tmp/account-progress-'+width+'.png',fullPage:true});
   await page.goto('http://127.0.0.1:3100/git/apa-itu-git');await page.getByRole('button',{name:'✓ Sudah dibaca · batalkan',exact:true}).waitFor();await page.getByRole('button',{name:'✓ Sudah dibaca · batalkan',exact:true}).click();await page.getByRole('button',{name:'Tandai sudah dibaca',exact:true}).waitFor();
   await page.goto('http://127.0.0.1:3100/akun');await page.getByText('✓ Progres akun sudah tersinkron.',{exact:true}).first().waitFor();await card('Learn Git').getByText('0 dari 48 materi selesai',{exact:true}).waitFor();
   await context.route('**/api/auth/session',r=>r.fulfill({json:{user:{id:'google:other',name:'Akun Kedua'},expires:new Date(Date.now()+3600000).toISOString()}}));await context.route('**/api/progress',r=>r.fulfill({json:r.request().method()==='PUT'?{ok:true}:{rows:[]}}));
   await page.reload();await page.getByText('Akun Kedua',{exact:true}).waitFor();await page.getByText('✓ Progres akun sudah tersinkron.',{exact:true}).first().waitFor();await card('Learn Electric').getByText('0 dari 44 materi selesai',{exact:true}).waitFor();
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);assert.deepEqual(remote,[]);await context.close();console.log('PASS '+width+'px: Google-only UI, missing configuration, session rendering, remote restore, guest merge, subgroup bars, Git undo, account isolation, no Supabase requests');
  }
 }finally{if(browser)await browser.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1;});
