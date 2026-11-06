const fs=require('node:fs'),assert=require('node:assert/strict');
const notes=JSON.parse(fs.readFileSync('lib/lesson-explanations.json','utf8'));
const catalogs={
 jaringan:['network-lessons'],git:['git-lessons'],iot:['iot-lessons','iot-extended-lessons'],
 listrik:['electric-lessons'],programming:['programming-lessons'],
};
const routes={jaringan:'/jaringan/',git:'/git/',iot:'/iot/',listrik:'/materi/',programming:'/programming/'};
const coverage={};
for(const [academy,names] of Object.entries(catalogs)){
 const lessons=names.flatMap(name=>JSON.parse(fs.readFileSync('lib/'+name+'.json','utf8')));
 coverage[academy]=0;
 for(const [key,note] of Object.entries(notes)){
  const [domain,slug]=key.split('/');if(domain!==academy)continue;
  assert.equal(lessons.filter(l=>l.slug===slug).length,1,key+' canonical lesson');
  assert.ok(note.sections.length&&note.practiceReview,key+' complete explanation');
  const html=fs.readFileSync('.next/server/app'+routes[academy]+slug+'.html','utf8');
  assert.equal(html.split('data-lesson-explanation="'+key+'"').length-1,1,key+' rendered once');
  assert.equal(html.split('data-practice-review="'+key+'"').length-1,1,key+' exercise review rendered once');
  for(let i=1;i<=note.sections.length;i++)assert.equal(html.split('id="pemaparan-'+i+'"').length-1,1,key+' unique heading');
  for(const section of note.sections)assert.ok(section.paragraphs.length>=2,key+' separate reasoning and example paragraphs');
  assert.ok(html.includes('Sudah mencoba? Bandingkan cara berpikirmu'),key+' review disclosure');
  assert.ok(!html.includes('&lt;LessonExplanation'),key+' MDX component resolved');
  coverage[academy]++;
 }
}
assert.equal(Object.values(coverage).reduce((a,b)=>a+b,0),Object.keys(notes).length,'No orphaned explanations');
const control=fs.readFileSync('.next/server/app/jaringan/ipv6-alamat-prefix.html','utf8');
assert.ok(!control.includes('data-lesson-explanation='),'Existing complete article stays unchanged');
console.log('PASS: explanation/review bindings, canonical routes, rendered MDX, unique headings, and unselected control article',coverage);
