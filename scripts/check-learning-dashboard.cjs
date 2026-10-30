const assert=require('node:assert/strict'),fs=require('node:fs'),Module=require('node:module'),path=require('node:path'),ts=require('typescript');
const original=Module._load;
Module._load=function(name,parent,...args){if(name==='server-only')return {};if(name.startsWith('.')&&!path.extname(name)){const file=path.resolve(path.dirname(parent.filename),name+'.ts');if(fs.existsSync(file))name=file;}return original.call(this,name,parent,...args);};
require.extensions['.ts']=(mod,file)=>mod._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText,file);
const {learningTracks}=require('../lib/learning-progress-catalog.ts');
const {progressSummary,trackLessons}=require('../lib/learning-progress-types.ts');
const {networkLessons}=require('../lib/network-course.ts');
const {gitLessons}=require('../lib/git-course.ts');
assert.deepEqual(learningTracks.map(t=>t.id),['listrik','jaringan','iot','git','programming']);
const routes=fs.readdirSync('app',{recursive:true}).filter(p=>p.endsWith('page.tsx')).map(p=>'/'+p.replace(/\/page.tsx$/,'').replace(/^page.tsx$/,'').replace(/\[[^/]+\]/g,'[^/]+'));
for(const track of learningTracks){
 const lessons=trackLessons(track);assert.ok(lessons.length>0);
 for(const group of track.groups){assert.ok(group.lessons.length,group.title);assert.equal(new Set(group.lessons.map(l=>l.slug)).size,group.lessons.length);for(const lesson of group.lessons){assert.match(lesson.slug,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);assert.ok(routes.some(r=>new RegExp('^'+r+'$').test(lesson.href)),lesson.href);}}
 assert.equal(progressSummary(track.id,lessons,{}).percent,0);
 const map=Object.fromEntries(lessons.map(l=>[track.id+'/'+l.slug,{completed:true,dirty:false,revision:'remote'}]));
 assert.equal(progressSummary(track.id,lessons,map).percent,100);assert.equal(progressSummary(track.id,lessons,map).next,undefined);
 map[track.id+'/'+lessons[0].slug].completed=false;assert.equal(progressSummary(track.id,lessons,map).done,lessons.length-1);assert.equal(progressSummary(track.id,lessons,map).next.slug,lessons[0].slug);
 assert.equal(progressSummary(track.id,[...lessons,...lessons],map).total,lessons.length);
 console.log('PASS '+track.title+': '+lessons.length+' unique lessons, valid routes, empty/complete/undo/resume counts');
}
const network=learningTracks.find(t=>t.id==='jaringan');const networkSet=new Set(trackLessons(network).map(l=>l.slug));assert.ok(networkLessons.every(l=>networkSet.has(l.slug)));
const git=learningTracks.find(t=>t.id==='git');assert.equal(trackLessons(git).length,gitLessons.length);
assert.equal(progressSummary('git',trackLessons(git),{'iot/apa-itu-iot':{completed:true}}).done,0);
console.log('PASS complete curriculum coverage, account/academy isolation and no double-counting shared troubleshooting lessons');
