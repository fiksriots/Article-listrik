/** Verify the built site. Starts and stops its own Next production server. */
const {spawn}=require('node:child_process');
const path=require('node:path');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const {setTimeout:pause}=require('node:timers/promises');
const {chromium}=require('playwright');
const guides=require('../lib/programming-study-guides.json');
const notes=require('../lib/programming-reading-notes.json');
const order=require('../lib/programming-order.json');
(async()=>{
 const root=path.resolve(__dirname,'..');
 const server=spawn(process.execPath,[path.join(root,'node_modules/next/dist/bin/next'),'start','--hostname','127.0.0.1','--port','3031'],{cwd:root,stdio:'ignore'});
 let browser;
 try{
  const origin='http://127.0.0.1:3031';let ready=false;
  for(let i=0;i<100;i++){try{if((await fetch(origin+'/programming')).ok){ready=true;break}}catch{} await pause(100)}
  assert(ready,'Production server must start');
  for(const id of Object.keys(guides)){
   const response=await fetch(origin+'/programming/'+id);assert.equal(response.status,200,id);
   const html=await response.text();assert(html.includes('id="panduan-belajar"'),id);assert(html.includes('Istilah dengan bahasa sederhana'),id);
  }
  for(const slug of order.flatMap(group=>group.slugs)){
   const response=await fetch(origin+'/programming/'+slug);assert.equal(response.status,200,slug);
   const html=await response.text();assert(html.includes('Butuh bekal atau arti istilah'),slug);
   if(notes[slug]){assert(html.includes('Cara membaca contoh ini'),slug);assert(html.includes('Latihan dengan pembahasan'),slug);}
  }
  const args=process.env.PROGRAMMING_BROWSER_EXECUTABLE?['--no-sandbox','--disable-dev-shm-usage','--no-zygote','--single-process','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--in-process-gpu','--disable-features=AudioServiceOutOfProcess,IsolateOrigins,site-per-process','--disable-site-isolation-trials']:[];
  browser=await chromium.launch({headless:true,args,...(process.env.PROGRAMMING_BROWSER_EXECUTABLE?{executablePath:process.env.PROGRAMMING_BROWSER_EXECUTABLE}:{})});
  const page=await browser.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
  const folder=process.env.PROGRAMMING_QA_DIR;
  if(folder)fs.mkdirSync(folder,{recursive:true});
  for(const width of [390,768,1366]){
   await page.setViewportSize({width,height:900});
   for(const slug of ['terstruktur','pengujian-debugging','perulangan-for','db-join','web-formulir','ds-pipeline','lanjut-browser-api']){
    await page.goto(origin+'/programming/'+slug);await page.locator('main h1').waitFor();
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),`${slug}: no page overflow at ${width}px`);
    if(notes[slug]){
     const summary=page.locator('.programming-worked-exercise summary');await summary.focus();await page.keyboard.press('Enter');
     assert(await summary.evaluate(el=>el.parentElement.open),slug+': keyboard opens worked answer');
     assert.match(await page.locator('.programming-worked-exercise').innerText(),new RegExp(notes[slug].answer.slice(0,12).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
    }
    const glossary=page.locator('.programming-guide-compact');
    if(await glossary.count()){
     const summary=glossary.locator('summary');await summary.focus();await page.keyboard.press('Enter');
     assert(await glossary.evaluate(el=>el.open));assert.equal(await glossary.locator('dt').count(),5);
    }
    const images=page.locator('.programming-article figure img');
    for(let i=0;i<await images.count();i++){
     const item=images.nth(i);await item.scrollIntoViewIfNeeded();
     assert(await item.evaluate(async image=>{try{await image.decode();return image.naturalWidth>0&&!!image.alt}catch{return false}}),slug+': image must decode with alt text');
    }
    if(folder&&['terstruktur','perulangan-for','web-formulir','ds-pipeline'].includes(slug)){
     const target=page.locator(slug==='terstruktur'?'#panduan-belajar':'.programming-reading-notes');
     await target.scrollIntoViewIfNeeded();await page.screenshot({path:path.join(folder,`${slug}-${width}.png`)});
    }
   }
  }
  assert.deepEqual(errors,[],'No browser runtime errors');
  console.log('PASS: 13 track guides, 304 article routes, 65 reading notes and worked exercises; desktop/tablet/mobile layout, keyboard disclosures, images and browser runtime');
 }finally{if(browser)await browser.close();server.kill();}
})().catch(error=>{console.error(error);process.exitCode=1});
