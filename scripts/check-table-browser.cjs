const assert=require('node:assert/strict'),fs=require('node:fs');
const {spawn}=require('node:child_process');const {chromium}=require('playwright');
(async()=>{
 const inventory=JSON.parse(fs.readFileSync('/tmp/article-table-inventory.json','utf8'));
 const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3100'],{stdio:'ignore'});let browser;
 try{
  let ready=false;for(let n=0;n<100;n++){try{if((await fetch('http://127.0.0.1:3100/modul')).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,250));}assert.ok(ready);
  browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox']});
  for(const width of [390,1440]){
   const context=await browser.newContext({viewport:{width,height:1000}});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
   for(const {slug,tables} of inventory){
    const response=await page.goto('http://127.0.0.1:3100/materi/'+slug,{waitUntil:'networkidle'});assert.equal(response.status(),200,slug);
    const regions=page.locator('article .article-table-scroll');assert.ok(await regions.count()>=tables,slug+' table count');
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),slug+' page overflow');
    assert.ok(!/\|\s*:?-{3,}:?\s*\|/.test(await page.locator('article').innerText()),slug+' raw delimiter');
    for(const region of await regions.all()){assert.ok(await region.getByRole('columnheader').count()>0,slug+' headers');assert.ok(await region.getByRole('cell').count()>0,slug+' data');}
   }
   await page.goto('http://127.0.0.1:3100/materi/proyek-akhir-rak-jaringan',{waitUntil:'networkidle'});
   const region=page.locator('article .article-table-scroll').first();await region.scrollIntoViewIfNeeded();
   assert.equal(await region.getByRole('columnheader').count(),4);assert.equal(await region.getByRole('row').count(),6);await region.getByRole('cell',{name:'Router',exact:true}).waitFor();await region.getByRole('cell',{name:'10 W DC',exact:true}).waitFor();
   await region.screenshot({path:'/tmp/fixed-table-'+width+'.png'});
   if(width===390){assert.ok(await region.evaluate(e=>e.scrollWidth>e.clientWidth));await region.focus();await page.keyboard.press('ArrowRight');await page.waitForTimeout(250);assert.ok(await region.evaluate(e=>e.scrollLeft>0),'Keyboard scrolling is available');}
   assert.deepEqual(errors,[]);await context.close();console.log(`PASS ${width}px: ${inventory.length} articles have readable semantic tables, no raw Markdown, no page overflow; capstone cells and scrolling verified`);
  }
 }finally{if(browser)await browser.close();server.kill();}
})().catch(e=>{console.error(e);process.exitCode=1});
