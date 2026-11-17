/** Isolated local-browser regression test. Never contacts a protected preview. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {spawn}=require('node:child_process');
const {setTimeout:pause}=require('node:timers/promises');
(async()=>{
 const root=path.resolve(__dirname,'..');const origin='http://127.0.0.1:3043';
 const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3043'],{cwd:root,stdio:'ignore'});
 let browser;
 try{
  let ready=false;for(let i=0;i<100;i++){try{if((await fetch(origin)).ok){ready=true;break;}}catch{} await pause(100);}assert(ready);
  const errors=[];
  for(const width of [390,768,1366]){
 browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||chromium.executablePath(),args:['--no-sandbox',...(process.env.ARTICLE_HEADLESS_SHELL?['--no-zygote','--single-process','--use-gl=angle','--use-angle=swiftshader','--in-process-gpu','--disable-features=AudioServiceOutOfProcess,IsolateOrigins,site-per-process']:[])]});
   const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
   let searchRequests=0;page.on('request',request=>{if(request.url()===origin+'/api/search')searchRequests++;});
   await page.goto(origin);await page.getByRole('button',{name:'Buka pencarian cepat'}).waitFor();
   assert.equal(searchRequests,0,'search catalogue is not loaded on initial page');
   await page.getByRole('button',{name:'Buka pencarian cepat'}).click();
   const input=page.getByRole('searchbox',{name:'Topik, perangkat, atau konsep'});await input.fill('VLAN');
   await page.locator('.site-search-matches li').first().waitFor();assert.equal(searchRequests,1);
   assert(await page.locator('.site-search-matches li').count()<=8);
   await input.fill('xyznotafoundtopic');await page.getByRole('status').filter({hasText:'Belum ada hasil'}).waitFor();
   await input.press('Escape');await page.locator('.site-search-dialog').waitFor({state:'hidden',timeout:3000});assert.equal(await page.locator('.site-search-dialog').isVisible(),false);
   assert.equal(await page.getByRole('button',{name:'Buka pencarian cepat'}).evaluate(el=>el===document.activeElement),true);
   await page.keyboard.press('Control+k');await input.fill('Ubiquiti');await page.locator('.site-search-matches li').first().waitFor();
   assert.equal(searchRequests,1,'catalogue is reused in this session');
   await page.locator('.site-search-matches a').first().click();await page.waitForURL('**/jaringan/ubiquiti/**');await page.locator('main h1').waitFor();assert(page.url().includes('/jaringan/ubiquiti/'));assert.equal(await page.locator('.site-search-dialog').isVisible(),false);
   for(const route of ['/','/listrik','/jaringan','/jaringan/noc','/jaringan/ubiquiti','/iot','/git','/programming','/programming/terstruktur','/cari','/simulator','/jaringan/simulator','/materi/apa-itu-listrik','/programming/perulangan-for']){
    await page.goto(origin+route);await page.locator('main h1').waitFor();
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),route+' overflow '+width);
    assert.equal(await page.locator('h1').count(),1);
   }
   if(width<=760){
    const nav=page.getByRole('navigation',{name:'Navigasi akademi'});assert.equal(await nav.isVisible(),false);
    await page.getByRole('button',{name:'Menu ☰'}).click();assert.equal(await nav.isVisible(),true);
    await page.keyboard.press('Escape');await nav.waitFor({state:'hidden'});assert.equal(await nav.isVisible(),false);
   }
   const larger=page.getByRole('button',{name:/Perbesar teks/});await larger.click();
   assert.equal(await page.locator('article').getAttribute('data-reading-size'),'large');
   await page.reload();await page.getByRole('button',{name:/Teks normal/}).waitFor();assert.equal(await page.locator('article').getAttribute('data-reading-size'),'large');
   await page.getByRole('button',{name:'Mode fokus',exact:true}).click();assert.equal(await page.locator('.net-sidebar').isVisible(),false);
   await page.getByRole('button',{name:'Keluar fokus',exact:true}).click();
   if(width>700)assert.equal(await page.locator('.net-sidebar').isVisible(),true);
   await page.getByRole('button',{name:'Tandai materi selesai',exact:true}).click();await page.reload();
   await page.getByRole('button',{name:/Materi selesai · batalkan/}).waitFor();
   if(process.env.QA_SCREENSHOT_DIR){
    fs.mkdirSync(process.env.QA_SCREENSHOT_DIR,{recursive:true});
    await page.goto(origin);await page.locator('.home-progress-total').waitFor();
    await page.screenshot({path:path.join(process.env.QA_SCREENSHOT_DIR,'article-home-'+width+'.png')});
    await page.goto(origin+'/programming/perulangan-for');await page.locator('.reader-tools').scrollIntoViewIfNeeded();
    await page.screenshot({path:path.join(process.env.QA_SCREENSHOT_DIR,'article-reader-'+width+'.png')});
   }
   await browser.close();browser=undefined;console.log('PASS '+width+'px: lazy search, empty/reused search, keyboard/focus, menu, reading preferences, completion persistence, and cross-academy overflow');
  }
  assert.deepEqual(errors,[],'no browser runtime errors');
 }finally{if(browser)await browser.close();server.kill();}
})().catch(error=>{console.error(error);process.exitCode=1;});
