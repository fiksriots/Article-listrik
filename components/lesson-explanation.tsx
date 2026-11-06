import 'server-only';
import data from '@/lib/lesson-explanations.json';

type Explanation = {sections:{title:string;paragraphs:string[]}[];practiceReview:string};
const explanations:Record<string,Explanation>=data;
export default function LessonExplanation({academy,slug,part='explanation'}:{academy:string;slug:string;part?:'explanation'|'review'|'complete'}){
 const key=academy+'/'+slug;
 const note=explanations[key];
 if(!note)return null;
 const review=<section className="lesson-practice-review" data-practice-review={key}>
  <h2>Pembahasan latihan dan hasil yang perlu diperiksa</h2>
  <details><summary>Sudah mencoba? Bandingkan cara berpikirmu</summary><p>{note.practiceReview}</p></details>
 </section>;
 if(part==='review')return review;
 return <>
  <div className="lesson-explanation" data-lesson-explanation={key}>
   {note.sections.map((section,i)=><section key={section.title} aria-labelledby={'pemaparan-'+(i+1)}>
    <h2 id={'pemaparan-'+(i+1)}>{section.title}</h2>
    {section.paragraphs.map((paragraph,n)=><p key={n}>{paragraph}</p>)}
   </section>)}
  </div>
  {part==='complete'&&review}
 </>;
}
