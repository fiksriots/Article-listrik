'use client';
import {useState} from 'react';
import {quizBank} from '@/lib/quiz-bank';
export default function TopicQuiz({slug}: {slug: string}) {
  const qs = quizBank[slug];
  const [ans, setAns] = useState<Record<number, number>>({});
  const [show, setShow] = useState(false);
  if (!qs) return null;
  const score = qs.filter((x, i) => ans[i] === x.a).length;
  return <section className="panel space-y-5" aria-labelledby={'quiz-'+slug}>
    <h2 id={'quiz-'+slug} className="text-2xl font-extrabold">🧠 Cek Pemahaman</h2>
    <p className="text-slate-600">{qs.length} soal tentang materi ini. Coba jawab dulu, lalu baca alasannya.</p>
    {qs.map((x, i) => <fieldset key={i} className="space-y-2">
      <legend className="font-semibold">{i+1}. {x.q}</legend>
      {x.o.map((o, j) => <label key={j} className={'block border rounded-lg p-3 '+(show && j === x.a ? 'border-teal-600 bg-teal-50' : '')}>
        <input type="radio" name={slug+'-q'+i} checked={ans[i] === j} disabled={show} onChange={() => setAns(a => ({...a, [i]: j}))} className="mr-2"/>{o}
      </label>)}
      {show && <p className="text-sm text-teal-900 bg-teal-50 rounded-lg p-3">{ans[i] === x.a ? '✓ Benar. ' : 'Jawaban: '+x.o[x.a]+'. '}{x.why}</p>}
    </fieldset>)}
    {show ? <><p className="font-bold" role="status">Skor: {score}/{qs.length}</p><button className="btn" onClick={() => {setAns({}); setShow(false);}}>Coba lagi</button></> : <button className="btn disabled:opacity-50" disabled={Object.keys(ans).length !== qs.length} onClick={() => setShow(true)}>Periksa jawaban</button>}
  </section>;
}
