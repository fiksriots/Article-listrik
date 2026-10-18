const fs=require('node:fs');const assert=require('node:assert/strict');const ts=require('typescript');
const code=ts.transpileModule(fs.readFileSync('lib/course.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText;
const catalog=JSON.parse(fs.readFileSync('lib/electric-lessons.json','utf8'));
const target={exports:{}};new Function('require','module','exports',code)(()=>catalog,target,target.exports);
const {stages,lessons,getLessonPosition}=target.exports;
assert.equal(lessons.length,39);assert.equal(stages.length,8);
assert.equal(lessons[0].slug,'apa-itu-listrik');assert.equal(lessons[1].slug,'keselamatan-dc');
for(let i=0;i<lessons.length;i++){
 const l=lessons[i],p=getLessonPosition(l.slug);
 assert.equal(p.index,i);assert.equal(p.stage.slugs[p.inStage],l.slug);
 assert.equal(p.previous?.slug,lessons[i-1]?.slug);assert.equal(p.next?.slug,lessons[i+1]?.slug);
 const file='.next/server/app/materi/'+l.slug+'.html';assert.ok(fs.existsSync(file));
 const html=fs.readFileSync(file,'utf8');
 assert.ok(html.includes('Posisi dalam jalur belajar'),l.slug+' position');
 if(p.next){const nextAnchor=[...html.matchAll(/<a\b([^>]*)>(.*?)<\/a>/gs)].find(a=>a[2].includes('Pelajaran berikutnya'));assert.ok(nextAnchor?.[1].includes('href="/materi/'+p.next.slug+'"'),l.slug+' next link');}
 else assert.ok(html.includes('akhir jalur belajar'),l.slug+' final lesson');
}
assert.equal(getLessonPosition('netral-grounding-proteksi').stageIndex,5);
assert.equal(getLessonPosition('panel-kabel-beban').stageIndex,5);
assert.equal(getLessonPosition('motor-elektromagnet').stageIndex,6);
console.log('PASS: 39 lesson URLs; 8 variable-length stages; positions, previous/next links and final lesson verified against production HTML');
