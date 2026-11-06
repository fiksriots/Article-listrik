const assert=require('node:assert/strict'),fs=require('node:fs'),Module=require('node:module'),path=require('node:path'),ts=require('typescript');
const original=Module._load;
Module._load=function(name,parent,...args){if(name==='server-only')return {};if(name.startsWith('.')&&!path.extname(name)){const file=path.resolve(path.dirname(parent.filename),name+'.ts');if(fs.existsSync(file))name=file;}return original.call(this,name,parent,...args);};
require.extensions['.ts']=(mod,file)=>mod._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText,file);
const {nocLessons,nocWeeks,nocResources}=require('../lib/noc-course.ts');
const {learningTracks}=require('../lib/learning-progress-catalog.ts');
const {searchTracks}=require('../lib/search-catalog.ts');
const {trackLessons,progressSummary}=require('../lib/learning-progress-types.ts');
assert.equal(nocWeeks.length,12);assert.equal(nocLessons.length,8);
const group=learningTracks.find(t=>t.id==='jaringan').groups.find(g=>g.id==='noc');
assert.deepEqual(group.lessons,nocResources);
assert.equal(new Set(nocResources.map(r=>r.slug)).size,nocResources.length);
const roadmap=fs.readFileSync('.next/server/app/jaringan/noc.html','utf8');
for(let i=1;i<=12;i++)assert.ok(roadmap.includes('id="minggu-'+i+'"'));
for(const r of nocResources){assert.ok(fs.existsSync('.next/server/app'+r.href+'.html'),'Missing built lesson '+r.href);assert.ok(roadmap.includes('href="'+r.href+'"'));}
for(const l of nocLessons){
 const href='/jaringan/noc/'+l.slug,html=fs.readFileSync('.next/server/app'+href+'.html','utf8');
 assert.ok(html.includes(l.title));assert.ok(l.sections.length>=4&&l.practice.length>=4);
 assert.ok(l.intro&&l.analogy&&l.practiceReview);assert.ok(l.goals.length);
 assert.ok(html.includes('Pembahasan praktik dan hasil yang diharapkan'));
 for(const [i,section] of l.sections.entries()){
  assert.ok(html.includes('id="bagian-'+(i+1)+'"'),l.slug+' section anchor');
  assert.ok(html.includes('href="#bagian-'+(i+1)+'"'),l.slug+' contents link');
  assert.ok(section.body.includes('\n\n'),l.slug+' paragraph structure');
  if(section.table){
   assert.ok(html.includes('<caption>'+section.table.caption+'</caption>'),l.slug+' rendered table');
   assert.ok(section.table.rows.every(row=>row.length===section.table.headers.length),l.slug+' table columns');
  }
  if(section.code)assert.ok(section.codeLabel&&section.language,l.slug+' command context');
  if(section.output)assert.ok(section.outputLabel?.includes('fiktif'),l.slug+' example output label');
 }
 const search=searchTracks.find(t=>t.id==='jaringan').lessons.find(x=>x.href===href);assert.equal(search.summary,l.summary);assert.equal(search.group,'Roadmap Junior NOC');
 assert.ok(group.lessons.some(r=>r.slug===l.slug));
}
const existing=nocResources.find(r=>!r.slug.startsWith('noc-'));
const map={['jaringan/'+existing.slug]:{completed:true,dirty:false,revision:'test'}};
assert.equal(progressSummary('jaringan',group.lessons,map).done,1,'Existing progress must count in NOC');
const track=learningTracks.find(t=>t.id==='jaringan');
assert.equal(trackLessons(track).filter(r=>r.slug===existing.slug).length,1,'Do not double count shared lessons');
console.log(`PASS: 12 weeks, ${nocResources.length} unique linked resources, 8 built NOC articles, search metadata and shared progress`);
