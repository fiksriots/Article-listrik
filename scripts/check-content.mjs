import fs from 'node:fs';
import assert from 'node:assert/strict';
import matter from 'gray-matter';
const course=fs.readFileSync('lib/course.ts','utf8');
const catalog=JSON.parse(fs.readFileSync('lib/electric-lessons.json','utf8'));
const stages=JSON.parse(course.slice(course.indexOf('export const stages = ')+22,course.indexOf(';\nconst catalog')));
const slugs=stages.flatMap(s=>s.slugs);
assert.deepEqual(new Set(slugs),new Set(catalog.map(l=>l.slug)),'Every existing lesson appears once in the learning path');
assert.ok(stages.every(s=>s.id&&s.name&&s.description&&s.prerequisite&&s.slugs.length));
for(const [before,after] of [['keselamatan-dc','multimeter'],['membaca-skema','komponen-dc-penggunaan'],['mengenal-arus-kuat','panel-kabel-beban'],['motor-elektromagnet','proteksi-motor'],['kontaktor-relay-panel','vfd-plc'],['kontrol-start-stop','star-delta-motor'],['star-delta-motor','vfd-plc']])assert.ok(slugs.indexOf(before)<slugs.indexOf(after),before+' should precede '+after);
const bankSource=fs.readFileSync('lib/quiz-bank.ts','utf8');
const bank=JSON.parse(bankSource.slice(bankSource.indexOf('= {',bankSource.indexOf('export const quizBank'))+2).replace(/;\s*$/,''));
assert.equal(slugs.length,57);
assert.equal(new Set(slugs).size,slugs.length);
assert.deepEqual(new Set(fs.readdirSync('content/materi').map(x=>x.replace(/\.mdx$/,''))),new Set(slugs));
for(const slug of slugs){
 const doc=matter(fs.readFileSync(`content/materi/${slug}.mdx`,'utf8'));
 assert.ok(doc.data.title && doc.data.summary,`${slug}: metadata`);
 assert.ok(doc.content.includes('## Studi kasus:'),`${slug}: case study`);
 assert.ok(doc.content.includes('<LearningCheck'),`${slug}: self check`);
 assert.ok(bank[slug]?.length>=2,`${slug}: topic quiz`);
 for(const q of bank[slug]){
  assert.ok(q.o.length>=3 && q.a>=0 && q.a<q.o.length && q.why,`${slug}: valid question`);
 }
}
console.log(`PASS: ${slugs.length} lessons, metadata, case studies, self-checks, ${Object.values(bank).flat().length} topic-specific questions`);
