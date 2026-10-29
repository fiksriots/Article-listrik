const assert=require('node:assert/strict'),fs=require('node:fs'),Module=require('node:module'),path=require('node:path'),ts=require('typescript');
const original=Module._load;
Module._load=function(name,parent,...args){if(name==='server-only')return {};if(name.startsWith('.')&&!path.extname(name)){const file=path.resolve(path.dirname(parent.filename),name+'.ts');if(fs.existsSync(file))name=file;}return original.call(this,name,parent,...args);};
require.extensions['.ts']=(mod,file)=>mod._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText,file);
const {searchTracks}=require('../lib/search-catalog.ts');
const {learningTracks}=require('../lib/learning-progress-catalog.ts');
const {trackLessons}=require('../lib/learning-progress-types.ts');
const root='.next/server/app/';
for(const track of searchTracks){
 assert.equal(track.lessons.length,trackLessons(learningTracks.find(t=>t.id===track.id)).length);
 assert.equal(new Set(track.lessons.map(l=>l.href)).size,track.lessons.length);
 for(const lesson of track.lessons){
  assert.ok(lesson.summary?.length>10,lesson.href+' missing summary');assert.ok(lesson.group,lesson.href+' missing group');
  if(lesson.minutes!==undefined)assert.ok(lesson.minutes>0,lesson.href);
  const html=fs.readFileSync(root+lesson.href.slice(1)+'.html','utf8');
  assert.ok(html.includes('reader-navigation'),lesson.href+' missing reading navigation');
 }
 console.log('PASS '+track.title+': complete search metadata and reading toolbar on '+track.lessons.length+' routes');
}
const home=fs.readFileSync(root+'index.html','utf8'),network=fs.readFileSync(root+'jaringan.html','utf8');
assert.ok(home.includes('home-progress-title'));assert.ok(home.includes('176<!-- --> materi'));assert.ok(network.includes('176')&&network.includes('81'));
const search=fs.readFileSync(root+'cari.html','utf8');assert.equal((search.match(/class="search-summary"/g)||[]).length,371);assert.equal((search.match(/class="search-meta"/g)||[]).length,371);
console.log('PASS homepage progress, consistent total counts, 371 enriched search results and complete reader coverage');
