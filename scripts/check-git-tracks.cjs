const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');const path=require('node:path');const ts=require('typescript');
const course={gitLessons:JSON.parse(fs.readFileSync('lib/git-lessons.json','utf8'))};
const output=ts.transpileModule(fs.readFileSync('lib/git-tracks.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const result={};vm.runInNewContext(output,{exports:result,require:(id)=>{assert.equal(id,'./git-course');return course;}});
const tracks=result.gitTracks;assert.equal(tracks.length,3);
assert.deepEqual(Array.from(tracks,t=>t.lessons.length),[27,11,10]);
const slugs=Array.from(tracks).flatMap(t=>Array.from(t.lessons,l=>l.slug));
assert.equal(new Set(slugs).size,48);assert.equal(slugs.length,48);
assert.deepEqual([...slugs].sort(),course.gitLessons.map(l=>l.slug).sort());
for(const track of tracks){
 assert.equal(result.getGitTrack(track.id),track);
 for(const [index,lesson] of Array.from(track.lessons).entries()){
  assert.equal(result.getGitLessonTrack(lesson.slug),track);
  const html=fs.readFileSync(path.join('.next/server/app/git',lesson.slug+'.html'),'utf8').replace(/<!--[\s\S]*?-->/g,'');
  assert.ok(html.includes('Daftar materi '+track.title),lesson.slug+' sidebar');
  assert.ok(html.includes('MATERI '+(index+1)+' DARI '+track.lessons.length),lesson.slug+' position');
  const nav=html.match(/<nav class="net-lesson-nav"[\s\S]*?<\/nav>/)?.[0];assert.ok(nav);
  const previous=track.lessons[index-1],next=track.lessons[index+1];
  assert.ok(nav.includes('href="'+(previous?'/git/'+previous.slug:track.href)+'"'),lesson.slug+' prev');
  assert.ok(nav.includes('href="'+(next?'/git/'+next.slug:track.href+'#kurikulum')+'"'),lesson.slug+' next');
 }
 const landing=fs.readFileSync('.next/server/app'+track.href+'.html','utf8');
 for(const l of track.lessons)assert.ok(landing.includes('href="/git/'+l.slug+'"'),track.id+' landing '+l.slug);
}
const feed=JSON.parse(fs.readFileSync('.next/server/app/api/articles.body','utf8')).items.filter(x=>x.category==='Belajar Git');
assert.equal(feed.length,48);assert.equal(feed.filter(i=>i.tags.includes('GitHub')).length,11);assert.equal(feed.filter(i=>i.tags.includes('GitLab')).length,10);assert.equal(feed.filter(i=>i.tags.includes('Dasar Git')).length,27);
console.log('PASS: 48 unique unchanged lesson slugs, three disjoint tracks (27/11/10), per-track sidebars and previous/next links, landing links and feed tags');
