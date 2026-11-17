/** Verify the shared shell and lazy search against a production build. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {gzipSync}=require('node:zlib');
const {spawn}=require('node:child_process');
const {setTimeout:pause}=require('node:timers/promises');
(async()=>{
 const root=path.resolve(__dirname,'..');
 const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3042'],{cwd:root,stdio:'ignore'});
 try{
  const origin='http://127.0.0.1:3042';let ready=false;
  for(let i=0;i<100;i++){try{if((await fetch(origin)).ok){ready=true;break;}}catch{} await pause(100);}
  assert(ready,'production server ready');
  const response=await fetch(origin+'/api/search');assert.equal(response.status,200);
  const raw=await response.text(),catalog=JSON.parse(raw);
  assert(catalog.length>=693);assert.equal(new Set(catalog.map(item=>item.href)).size,catalog.length);
  for(const item of catalog){
   assert(item.href.startsWith('/')&&!item.href.startsWith('//'));
   assert.deepEqual(Object.keys(item).sort(),['href','summary','title','track']);
  }
  for(const prefix of ['/materi/','/jaringan/','/iot/','/git/','/programming/','/jaringan/noc/','/jaringan/ubiquiti/']) assert(catalog.some(item=>item.href.startsWith(prefix)),prefix);
  const routes=['/','/listrik','/modul','/galeri','/simulator','/jaringan','/jaringan/noc','/jaringan/ubiquiti','/jaringan/winbox','/jaringan/mtcna','/jaringan/mtcre','/jaringan/simulator','/iot','/git','/programming','/programming/terstruktur','/cari','/materi/apa-itu-listrik','/jaringan/apa-itu-jaringan','/iot/apa-itu-iot','/git/apa-itu-git','/programming/perulangan-for'];
  for(const route of routes){
   const r=await fetch(origin+route);assert.equal(r.status,200,route);const html=await r.text();
   assert(html.includes('class="site-header"'),route);assert(html.includes('Buka pencarian cepat'),route);
   assert(html.includes('Navigasi akademi'),route);assert(html.includes('id="konten"'),route);
   assert.equal((html.match(/<h1[ >]/g)||[]).length,1,route+' h1');
  }
  let count=0;
  for(const name of fs.readdirSync(path.join(root,'.next/server/app'),{recursive:true}).filter(file=>file.endsWith('.html')&&!file.startsWith('_'))){
   const html=fs.readFileSync(path.join(root,'.next/server/app',name),'utf8');
   assert(html.includes('class="site-header"'),name+' shared shell');count++;
  }
  const home=await (await fetch(origin)).text();
  const scripts=[...home.matchAll(/<script[^>]+src="([^"]+)"/g)].map(match=>match[1]);
  let rawJs=0,gzipJs=0;
  for(const src of new Set(scripts)){const file=path.join(root,'.next',src.replace(/^\/_next\//,''));const buffer=fs.readFileSync(file);rawJs+=buffer.length;gzipJs+=gzipSync(buffer).length;}
  const css=fs.readFileSync(path.join(root,'app/site-refresh.css'));
  const result={staticPages:count,searchItems:catalog.length,searchGzipBytes:gzipSync(raw).length,homepageJsGzipBytes:gzipJs,homepageJsRawBytes:rawJs,newSharedCssGzipBytes:gzipSync(css).length};
  console.log('PASS: production routes, shared shell on all static pages, unique metadata-only search, all five academies including NOC/Ubiquiti.');console.log(JSON.stringify(result));
 }finally{server.kill();}
})().catch(error=>{console.error(error);process.exitCode=1;});
