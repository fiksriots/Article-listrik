import notes from '@/lib/programming-reading-notes.json';

export function getReadingIllustration(slug:string) {
  const note = notes[slug as keyof typeof notes];
  return note && 'diagram' in note ? note.diagram : undefined;
}

export default function ReadingNotes({slug, exercise = false}:{slug:string; exercise?:boolean}) {
  const note = notes[slug as keyof typeof notes];
  if (!note) return null;
  if (exercise) return <section className="programming-worked-exercise">
    <h2>Latihan dengan pembahasan</h2><p>{note.question}</p>
    <details><summary>Bandingkan dengan pembahasan</summary><p>{note.answer}</p></details>
  </section>;
  return <section className="programming-reading-notes">
    <h2>Cara membaca contoh ini</h2>
    {note.walk.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
  </section>;
}
