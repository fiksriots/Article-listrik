const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {spawn}=require('node:child_process');const {chromium}=require('playwright');
const portfolio=path.resolve('../personal-branding/frontend/dist');const rules=JSON.parse(fs.readFileSync('../personal-branding/vercel.json')).routes;
const gatewayOrigin='http://127.0.0.1:3200',academyOrigin='http://127.0.0.1:3100';
function resolveRoute(pathname){for(const rule of rules){if(rule.has)continue;const m=pathname.match(new RegExp('^'+rule.src+'$'));if(m)return {...rule,dest:rule.dest?.replace(/\$(\d+)/g,(_,i)=>m[Number(i)]||'')};}return null;}
const mime=file=>file.endsWith('.js')?'application/javascript':file.endsWith('.css')?'text/css':file.endsWith('.svg')?'image/svg+xml':file.endsWith('.png')?'image/png':file.endsWith('.xml')?'application/xml':file.endsWith('.ico')?'image/x-icon':'text/html';
(async()=>{
 const academy=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3100'],{stdio:'ignore'});let browser,gateway;
 try{
  let ready=false;for(let n=0;n<100;n++){try{if((await fetch(academyOrigin+'/belajar')).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,250));}assert.ok(ready);
  for(const p of ['/belajar','/materi/apa-itu-listrik','/_next/static/x.js','/jaringan/winbox','/network/x.svg','/api/auth/session','/api/progress'])assert.ok(resolveRoute(p).dest.startsWith('https://article.fikss.site/'),p);
  for(const p of ['/','/articles','/articles/contoh','/admin/login','/cv','/api/articles','/assets/app.js','/favicon.ico'])assert.ok(!resolveRoute(p).dest.startsWith('https://article.fikss.site/'),p);
  gateway=http.createServer(async(req,res)=>{try{const u=new URL(req.url,gatewayOrigin),rule=resolveRoute(u.pathname);if(!rule){res.writeHead(404).end();return;}
   if(rule.dest.startsWith('https://article.fikss.site/')){
    const target=rule.dest.replace('https://article.fikss.site',academyOrigin)+u.search;const headers={...req.headers,host:'127.0.0.1:3200','x-forwarded-host':'127.0.0.1:3200','x-forwarded-proto':'http'};delete headers.connection;
    const upstream=await fetch(target,{headers,redirect:'manual'});for(const [key,value] of upstream.headers)if(!['content-encoding','content-length','transfer-encoding','set-cookie'].includes(key))res.setHeader(key,value);const cookies=upstream.headers.getSetCookie();if(cookies.length)res.setHeader('set-cookie',cookies);res.writeHead(upstream.status).end(Buffer.from(await upstream.arrayBuffer()));return;
   }
   if(rule.dest==='backend/src/server.js'){res.writeHead(501).end('Portfolio backend stays separate');return;}
   const file=path.join(portfolio,rule.dest.replace(/^frontend\//,''));if(!file.startsWith(portfolio)||!fs.existsSync(file)){res.writeHead(404).end();return;}res.setHeader('Content-Type',mime(file));res.writeHead(200).end(fs.readFileSync(file));
  }catch(e){res.writeHead(500).end(e.message);}});await new Promise(r=>gateway.listen(3200,'127.0.0.1',r));
  const home=await (await fetch(gatewayOrigin+'/')).text();assert.match(home,/Ahmad Dzakiyul Fikri/);assert.ok(!home.includes('hub-card hub-electric'));
  const sitemap=await (await fetch(gatewayOrigin+'/sitemap.xml')).text();assert.match(sitemap,/<sitemapindex/);assert.match(sitemap,/portfolio-sitemap.xml/);assert.match(sitemap,/belajar\/sitemap.xml/);
  const xml=await (await fetch(gatewayOrigin+'/belajar/sitemap.xml')).text();const urls=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);assert.ok(urls.length>350);assert.ok(urls.every(u=>u.startsWith('https://fikss.site/')));assert.ok(!urls.some(u=>u.endsWith('/akun')));
  let checked=0;const missingCanonical=[];for(let start=0;start<urls.length;start+=12)await Promise.all(urls.slice(start,start+12).map(async url=>{const p=new URL(url).pathname;const r=await fetch(gatewayOrigin+p);assert.equal(r.status,200,p);const html=await r.text();if(!html.includes('rel="canonical" href="'+url+'"'))missingCanonical.push(p);checked++;}));
  assert.deepEqual(missingCanonical,[],'Missing canonical pages');
  assert.equal((await fetch(gatewayOrigin+'/api/progress')).status,401);
  assert.equal((await fetch(gatewayOrigin+'/api/auth/session')).status,200);
  browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,headless:true,args:['--no-sandbox']});
  const pages=['/belajar','/listrik','/materi/apa-itu-listrik','/jaringan','/jaringan/winbox/persiapan','/jaringan/mtcna','/iot','/git/dasar','/jaringan/simulator/ipv6','/akun'];
  for(const width of [390,1440]){const context=await browser.newContext({viewport:{width,height:1000}});const errors=[];context.on('page',page=>page.on('pageerror',e=>errors.push(e.message)));const page=await context.newPage();for(const p of pages){await page.goto(gatewayOrigin+p,{waitUntil:'networkidle'});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),p+' overflow');const broken=await page.locator('img').evaluateAll(nodes=>nodes.filter(n=>!n.loading||n.loading!=='lazy').filter(n=>!n.complete||n.naturalWidth===0).map(n=>n.src));assert.deepEqual(broken,[],p+' images');const links=await page.locator('a[href]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')));assert.ok(!links.some(h=>h.startsWith('https://article.fikss.site')||h.startsWith('https://listrik.fikss.site')),p+' legacy link');}
   await page.goto(gatewayOrigin+'/belajar');await page.getByRole('heading',{name:'Learn Electric',exact:true}).click(); // A heading inside a real academy link triggers client navigation.
   await page.waitForURL('**/listrik');assert.match(await page.title(),/Learn Electric/);
   await page.goto(gatewayOrigin+'/articles');await page.getByRole('heading',{name:'Learn Networking',exact:true}).waitFor();const link=page.getByRole('link',{name:/Praktik Winbox/}).first();assert.equal(await link.getAttribute('href'),'https://fikss.site/jaringan/winbox');
   assert.deepEqual(errors,[]);await context.close();console.log('PASS '+width+'px: portfolio + academy gateway, navigation, assets, SEO, auth endpoints');}
  console.log('PASS '+checked+' canonical URLs, sitemap index, explicit routing and no anonymous progress access');
 }finally{if(browser)await browser.close();if(gateway)gateway.close();academy.kill();}
})().catch(e=>{console.error(e);process.exitCode=1});
