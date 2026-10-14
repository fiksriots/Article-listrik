const {chromium}=require('playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const base=process.env.BASE_URL||'http://127.0.0.1:3000';
const {spawn}=require('node:child_process');
const slugs=[...fs.readFileSync('lib/course.ts','utf8').matchAll(/slug:'([^']+)'/g)].map(x=>x[1]);
const raw=fs.readFileSync('lib/quiz-bank.ts','utf8');
const bank=JSON.parse(raw.slice(raw.indexOf('= {',raw.indexOf('export const quizBank'))+2).replace(/;\s*$/,''));
(async()=>{
 let server;
 if(process.env.START_SERVER==='1'){
  server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port',new URL(base).port||'3000'],{stdio:'ignore'});
  let ready=false;
  for(let i=0;i<60;i++){try{ready=(await fetch(base)).ok;if(ready)break;}catch{}await new Promise(r=>setTimeout(r,250));}
  if(!ready){server.kill();throw new Error('Local server did not start');}
 }
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||chromium.executablePath(),args:['--no-sandbox']});
 try{
  for(const viewport of [{width:390,height:844},{width:1440,height:1000}]){
   const context=await browser.newContext({viewport});
   const page=await context.newPage();
   const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   for(const route of ['/','/modul','/galeri','/simulator',...slugs.map(s=>'/materi/'+s)]){
    const response=await page.goto(base+route,{waitUntil:'networkidle'});
    assert.equal(response.status(),200,route);
    assert.equal(await page.locator('h1').count(),1,route+' heading');
    assert.equal(await page.locator('#konten').count(),1,route+' main target');
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route+' page overflow');
    assert.ok(!(await page.locator('body').innerText()).includes('\\u'),route+' escaped Unicode');
    if(route.startsWith('/materi/')){
     const slug=route.split('/').pop();
     assert.ok((await page.title()).includes('Akademi Listrik'));
     const table=page.locator('.component-reference');
     if(await table.count()){
      assert.equal(await table.getByRole('columnheader').count(),4,slug+' component reference headers');
      assert.ok(await table.locator('tbody tr').count()>=4,slug+' component reference rows');
     }
     const quiz=page.locator('section[aria-labelledby="quiz-'+slug+'"]');
     assert.equal(await quiz.locator('fieldset').count(),bank[slug].length);
     assert.equal(await quiz.getByRole('button',{name:'Periksa jawaban'}).isEnabled(),false);
     for(let i=0;i<bank[slug].length;i++)await quiz.locator('fieldset').nth(i).getByRole('radio').nth(bank[slug][i].a).check();
     await quiz.getByRole('button',{name:'Periksa jawaban'}).click();
     await quiz.getByText('Skor: 2/2',{exact:true}).waitFor();
     assert.equal(await quiz.getByRole('status').innerText(),'Skor: 2/2',slug+' score');
     await quiz.getByRole('button',{name:'Coba lagi'}).click();
     await quiz.getByRole('button',{name:'Periksa jawaban'}).waitFor();
     assert.equal(await quiz.getByRole('button',{name:'Periksa jawaban'}).isEnabled(),false);
    }
   }
   await page.goto(base+'/materi/apa-itu-listrik',{waitUntil:'networkidle'});
   if(viewport.width<1024){
    await page.getByRole('button',{name:'☰ Daftar modul'}).click();
    assert.equal(await page.getByRole('complementary',{name:'Navigasi modul'}).isVisible(),true);
    await page.getByRole('button',{name:'Tutup daftar modul'}).click();
   }
   await page.getByRole('button',{name:'Tandai materi selesai',exact:true}).click();
   await page.getByRole('button',{name:'✓ Materi selesai — batalkan tanda'}).waitFor();
   await page.reload({waitUntil:'networkidle'});
   assert.equal(await page.getByRole('button',{name:'✓ Materi selesai — batalkan tanda'}).getAttribute('aria-pressed'),'true');
   await page.goto(base,{waitUntil:'networkidle'});
   assert.equal(await page.getByRole('progressbar').getAttribute('value'),'1');
   assert.ok(await page.getByRole('link',{name:/Lanjut belajar: Volt/}).count());
   await page.goto(base+'/simulator',{waitUntil:'networkidle'});
   const ohm=page.locator('.panel').filter({has:page.getByRole('heading',{name:'Simulator Hukum Ohm',exact:true})});
   await ohm.getByRole('slider').nth(0).fill('24');
   assert.ok((await ohm.innerText()).includes('4.00 A'));
   const series=page.locator('section').filter({has:page.getByRole('heading',{name:'Coba Rangkaian Seri dan Paralel'})});
   await series.getByRole('button',{name:'Paralel',exact:true}).click();
   assert.ok((await series.innerText()).includes('3.00 Ω'));
   assert.ok((await series.innerText()).includes('4.00 A'));
   const phase=page.locator('section').filter({has:page.getByRole('heading',{name:'1 Phase vs 3 Phase',exact:true})});
   const d=await phase.locator('svg path').nth(1).getAttribute('d');
   await phase.getByRole('slider').nth(1).fill('60');
   assert.notEqual(await phase.locator('svg path').nth(1).getAttribute('d'),d);
   assert.ok((await phase.innerText()).includes('16.7 ms'));
   await phase.getByRole('button',{name:'1 Phase',exact:true}).click();
   assert.equal(await phase.locator('svg path').count(),2);
   const meter=page.locator('section').filter({has:page.getByRole('heading',{name:'Multimeter Virtual'})});
   await meter.getByRole('button',{name:'Ω',exact:true}).click();
   await meter.getByRole('slider').fill('330');
   assert.ok((await meter.innerText()).includes('330 Ω'));
   const plc=page.locator('section[aria-labelledby="plc-lab-title"]');
   await plc.getByRole('button',{name:/Permintaan jalan/}).click();
   await plc.getByRole('button',{name:/Sensor barang aktif/}).click();
   assert.ok((await plc.getByRole('status').innerText()).includes('ON'));
   await plc.getByRole('button',{name:/Perintah berhenti/}).click();
   assert.ok((await plc.getByRole('status').innerText()).includes('OFF'));
   await plc.getByRole('button',{name:'Reset masukan'}).click();
   assert.equal(await plc.locator('[aria-pressed="true"]').count(),0);
   const missing=await page.goto(base+'/materi/tidak-ada',{waitUntil:'networkidle'});
   assert.equal(missing.status(),404);
   assert.deepEqual(errors,[],`browser errors ${viewport.width}`);
   console.log(`PASS ${viewport.width}px: ${slugs.length+4} pages, ${slugs.length} quizzes, progress persistence, mobile navigation, 5 simulators, 404, zero runtime errors`);
   await context.close();
  }
  const blocked=await browser.newContext();
  await blocked.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Blocked','SecurityError');}});});
  const page=await blocked.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/materi/apa-itu-listrik',{waitUntil:'networkidle'});
  await page.getByRole('button',{name:'Tandai materi selesai',exact:true}).click();
  await page.getByText('Browser tidak mengizinkan penyimpanan.',{exact:false}).waitFor();
  assert.ok((await page.locator('body').innerText()).includes('Browser tidak mengizinkan penyimpanan'));
  assert.deepEqual(errors,[]);
  console.log('PASS blocked localStorage: no crash and clear feedback');
 }finally{await browser.close();if(server)server.kill();}
})().catch(e=>{console.error(e);process.exit(1);});
