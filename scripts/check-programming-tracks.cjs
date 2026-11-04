const assert=require('node:assert/strict'),fs=require('node:fs'),Module=require('node:module'),path=require('node:path'),ts=require('typescript');
const original=Module._load;
Module._load=function(name,parent,...args){if(name==='server-only')return {};if(name.startsWith('.')&&!path.extname(name)){const file=path.resolve(path.dirname(parent.filename),name+'.ts');if(fs.existsSync(file))name=file;}return original.call(this,name,parent,...args);};
require.extensions['.ts']=(mod,file)=>mod._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText,file);
const {programmingTracks,getProgrammingLessonTrack}=require('../lib/programming-tracks.ts');
const {programmingLessons,dataStructureCatalog}=require('../lib/programming-course.ts');
const {learningTracks}=require('../lib/learning-progress-catalog.ts');
const {progressSummary}=require('../lib/learning-progress-types.ts');
assert.deepEqual(programmingTracks.map(t=>t.id),['terstruktur','struktur-data','oop','basis-data','backend-api','pemrograman-jaringan','web','django','data-analysis','data-science','pengujian-debugging','proyek-otomasi','rekayasa-deployment']);
assert.deepEqual(programmingTracks.map(t=>t.lessons.length),[35,38,31,46,23,16,14,16,20,20,8,8,8]);
const slugs=programmingTracks.flatMap(t=>t.lessons.map(l=>l.slug));
assert.equal(new Set(slugs).size,283);
assert.deepEqual([...slugs].sort(),programmingLessons.map(l=>l.slug).sort());
for(const track of programmingTracks){
 assert.ok(fs.existsSync('app'+track.href+'/page.tsx'));
 track.lessons.forEach((lesson,index)=>{
  assert.equal(getProgrammingLessonTrack(lesson.slug).id,track.id);
  assert.equal(track.catalog[index].slug,lesson.slug);
  assert.ok(track.stages[lesson.stage]);
 });
}
assert.equal(getProgrammingLessonTrack('not-a-lesson'),undefined);
const groups=learningTracks.find(t=>t.id==='programming').groups;
assert.deepEqual(groups.map(g=>g.title),['Pemrograman Terstruktur','Struktur Data','Pemrograman Berorientasi Objek','Basis Data','Backend/API','Pemrograman Jaringan','Pemrograman Web','Django','Data Analysis','Data Science','Pengujian & Debugging','Proyek & Otomasi Python','Rekayasa & Deployment']);
const saved={'programming/struktur-stack':{completed:true,dirty:false,revision:'existing'}};
assert.equal(progressSummary('programming',groups[0].lessons,saved).done,0);
assert.equal(progressSummary('programming',groups[1].lessons,saved).done,1);
assert.equal(progressSummary('programming',groups[1].lessons,saved).total,38);
console.log('PASS: separate 35/38/31/46/23/16/14/16/20/20/8/8/8 curricula, complete coverage without duplicates, valid overview routes and retained progress keys');

assert.equal(progressSummary('programming',groups[2].lessons,saved).done,0);

assert.equal(progressSummary('programming',groups[3].lessons,saved).done,0);

assert.deepEqual(dataStructureCatalog.map(l=>l.slug),programmingTracks.find(t=>t.id==='struktur-data').catalog.map(l=>l.slug));
