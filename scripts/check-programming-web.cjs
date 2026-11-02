const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const read=n=>JSON.parse(fs.readFileSync(path.join(root,'lib',n),'utf8'));
const web=read('programming-web-lessons.json'),order=read('programming-order.json'),quizzes=read('programming-quizzes.json');
const all=['programming-lessons.json','programming-extended-lessons.json','programming-data-structure-lessons.json','programming-oop-lessons.json','programming-database-lessons.json','programming-api-lessons.json','programming-web-lessons.json','programming-django-lessons.json'].flatMap(read);
assert.equal(web.length,12);assert.equal(all.length,189);
const slugs=all.map(l=>l.slug),ordered=order.flatMap(g=>g.slugs);
assert.equal(new Set(slugs).size,189);assert.deepEqual([...slugs].sort(),[...ordered].sort());assert.deepEqual([...slugs].sort(),Object.keys(quizzes).sort());
assert.equal(Object.values(quizzes).reduce((n,q)=>n+q.length,0),756);
const webOrder=order.filter(g=>g.title.startsWith('Web ·')).flatMap(g=>g.slugs);
assert.equal(webOrder.indexOf('web-javascript-dasar')<webOrder.indexOf('web-dom-event'),true);
assert.equal(webOrder.indexOf('web-dom-event')<webOrder.indexOf('web-formulir'),true);
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'fiks-web-'));
try{
for(const l of web){
 assert.ok(l.explain.length>=3);assert.ok(l.steps.length>=3);assert.ok(l.practice.length>=2);assert.ok(l.check&&l.answer&&l.warning&&l.source.startsWith('https://developer.mozilla.org/'));
 assert.equal(quizzes[l.slug].length,4);
 for(const q of quizzes[l.slug]){assert.equal(q.options.length,3);assert.equal(new Set(q.options).size,3);assert.ok(q.answer>=0&&q.answer<3&&q.explanation)}
 for(const b of l.blocks){
  if(b.language==='javascript'){
   const file=path.join(tmp,'basic.js');fs.writeFileSync(file,b.code);const out=spawnSync(process.execPath,[file],{encoding:'utf8'});assert.equal(out.status,0,out.stderr);assert.equal(out.stdout.trim(),b.output.trim());continue;
  }
  assert.equal(b.language,'html');
  const html=fs.readFileSync(path.join(root,'public/programming/lab/web',l.slug+'.html'),'utf8');assert.equal(html,b.code,l.slug+' source must match runnable demo');
  assert.match(html,/<!doctype html>/i);assert.match(html,/<html lang="id">/);assert.match(html,/name="viewport"/);
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);
  for(const m of html.matchAll(/\bfor="([^"]+)"/g))assert.ok(ids.includes(m[1]));
  for(const [i,m] of [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].entries()){
   const file=path.join(tmp,l.slug+i+'.js');fs.writeFileSync(file,m[1]);const out=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});assert.equal(out.status,0,out.stderr);
  }
 }
}
}finally{fs.rmSync(tmp,{recursive:true,force:true})}
console.log('PASS: 189 ordered lessons / 756 questions, 12 complete Web lessons, exact runnable HTML sources, JavaScript syntax and deterministic output');
