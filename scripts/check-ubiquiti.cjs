const assert=require('node:assert/strict'),fs=require('node:fs'),Module=require('node:module'),path=require('node:path'),ts=require('typescript');
const original=Module._load;
Module._load=function(name,parent,...args){if(name==='server-only')return {};if(name.startsWith('.')&&!path.extname(name)){const file=path.resolve(path.dirname(parent.filename),name+'.ts');if(fs.existsSync(file))name=file;}return original.call(this,name,parent,...args);};
require.extensions['.ts']=(mod,file)=>mod._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText,file);
const {ubiquitiLessons:lessons,ubiquitiResources:resources}=require('../lib/ubiquiti-course.ts');
const {learningTracks}=require('../lib/learning-progress-catalog.ts');
const {searchTracks}=require('../lib/search-catalog.ts');
const {progressSummary,trackLessons}=require('../lib/learning-progress-types.ts');
assert.equal(lessons.length,9);
const track=learningTracks.find(t=>t.id==='jaringan'),group=track.groups.find(g=>g.id==='ubiquiti');
assert.deepEqual(group.lessons,resources);
const home=fs.readFileSync('.next/server/app/jaringan/ubiquiti.html','utf8');
const feed=JSON.parse(fs.readFileSync('.next/server/app/api/articles.body','utf8')).items;
for(const [index,l] of lessons.entries()){
 const href='/jaringan/ubiquiti/'+l.slug,html=fs.readFileSync('.next/server/app'+href+'.html','utf8');
 assert.ok(home.includes('href="'+href+'"'));
 assert.ok(html.includes('class="ubq-reader"'));
 assert.ok(html.includes('class="net-article ubq-body"'));
 assert.ok(html.includes('Pembahasan praktik dan hasil yang diharapkan'));
 assert.ok(html.includes('id="praktik"')&&html.includes('id="cek-pemahaman"'));
 assert.equal(l.sections.length,6);
 assert.ok(l.sections.every(s=>s.body.includes('\n\n')));
 for(const [i,s] of l.sections.entries()){
  assert.ok(html.includes('id="bagian-'+(i+1)+'"'));
  assert.ok(html.includes('href="#bagian-'+(i+1)+'"'));
  if(s.table)assert.ok(s.table.rows.every(r=>r.length===s.table.headers.length));
 }
 for(const other of [lessons[index-1],lessons[index+1]].filter(Boolean))assert.ok(html.includes('/jaringan/ubiquiti/'+other.slug));
 assert.ok(fs.existsSync('public/network/ubiquiti/'+l.diagram+'.svg'));
 assert.ok(html.includes(l.diagramAlt));
 const search=searchTracks.find(t=>t.id==='jaringan').lessons.find(r=>r.href===href);
 assert.equal(search.summary,l.summary);assert.equal(search.group,'Wireless Ubiquiti');
 assert.equal(feed.find(r=>r.slug===l.slug).url,'https://article.fikss.site'+href);
 assert.equal(trackLessons(track).filter(r=>r.slug===l.slug).length,1);
 const map={['jaringan/'+l.slug]:{completed:true,dirty:false,revision:'test'}};
 assert.equal(progressSummary('jaringan',group.lessons,map).done,1);
 assert.equal(progressSummary('iot',group.lessons,map).done,0);
}
const all=lessons.map(l=>l.slug);
assert.equal(new Set(all).size,all.length);
console.log('PASS: 9 built wireless lessons, course/navigation, illustrations, search, public feed and isolated/deduplicated progress');
