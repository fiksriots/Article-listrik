/** Capture real local lab UI with isolated local servers and fictional input. */
const {chromium}=require('playwright');
const path=require('node:path');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const {setTimeout:pause}=require('node:timers/promises');
async function ready(url){for(let i=0;i<100;i++){try{if((await fetch(url)).ok)return;}catch{} await pause(100);}throw Error('Server did not start: '+url);}
(async()=>{
 const root=path.resolve(__dirname,'..');
 const staticServer=spawn(process.env.PYTHON||'python',['-m','http.server','8766','--bind','127.0.0.1'],{cwd:path.join(root,'public'),stdio:'ignore'});
 const apiServer=spawn(process.env.PYTHON||'python',['lab_web.py','--port','8021'],{cwd:path.join(root,'examples/advanced-programming-lab'),stdio:'ignore'});
 const args=process.env.PROGRAMMING_BROWSER_EXECUTABLE?['--disable-features=AudioServiceOutOfProcess,IsolateOrigins,site-per-process','--disable-site-isolation-trials','--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--in-process-gpu','--no-zygote','--single-process']:[];
 let browser;
 try{
  browser=await chromium.launch({headless:true,args,...(process.env.PROGRAMMING_BROWSER_EXECUTABLE?{executablePath:process.env.PROGRAMMING_BROWSER_EXECUTABLE}:{})});
  const page=await browser.newPage({viewport:{width:1100,height:760},deviceScaleFactor:1});
  const folder=path.resolve(__dirname,'../public/programming/screenshots');fs.mkdirSync(folder,{recursive:true});
  const site='http://127.0.0.1:8766';
  await Promise.all([ready(site),ready('http://127.0.0.1:8021/')]);
  await page.goto(site+'/programming/lab/web/web-formulir.html');
  await page.locator('#judul').fill('Link BTS-LAB putus');await page.locator('#email').fill('pelajar@example.com');
  await page.getByRole('button',{name:'Periksa input'}).click();
  assert.match(await page.locator('#hasil').innerText(),/Belum dikirim ke server/);
  await page.locator('main').screenshot({path:path.join(folder,'formulir-valid.png')});
  await page.goto(site+'/programming/lab/web/web-kasus-tugas.html');
  // Isolated browser context has no existing task data.
  for(const title of ['Pahami variabel dan tipe data','Latihan perulangan for','Uji input kosong']){
   await page.locator('#judul').fill(title);await page.getByRole('button',{name:'Tambah tugas'}).click();
  }
  await page.getByRole('checkbox').first().check();await page.reload();
  assert.equal(await page.getByRole('checkbox').count(),3);
  assert.equal(await page.getByRole('checkbox').first().isChecked(),true);
  await page.locator('main').screenshot({path:path.join(folder,'daftar-tugas.png')});
  await page.goto('http://127.0.0.1:8021/');
  assert.deepEqual(await page.evaluate(async()=>{const r=await fetch('/api/observasi');return r.json()}),[], 'Start a fresh lab API server before capturing.');
  let expected=0;
  for(const [layanan,hasil] of [['BTS-LAB Araya','ok'],['BTS-LAB Keputih','timeout']]){
   await page.locator('#layanan').fill(layanan);await page.locator('#hasil').selectOption(hasil);
   const response=page.waitForResponse(r=>r.url().endsWith('/api/observasi')&&r.request().method()==='POST');
   await page.getByRole('button',{name:'Simpan observasi'}).click();assert.equal((await response).status(),201);
   expected++;
   await page.waitForFunction(count=>document.querySelector('#list').children.length===count,expected);
  }
  await page.locator('#list li').nth(1).waitFor();
  assert.deepEqual(await page.locator('#list li').allTextContents(),['BTS-LAB Araya · ok','BTS-LAB Keputih · timeout']);
  await page.locator('main').screenshot({path:path.join(folder,'api-laporan-lokal.png')});
  console.log('PASS: real lab screenshots; form validation, task persistence, HTTP 201 and rendered observations');
 }finally{if(browser)await browser.close();staticServer.kill();apiServer.kill();}
})().catch(error=>{console.error(error);process.exitCode=1});
