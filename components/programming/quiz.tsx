'use client';

import {useRef, useState} from 'react';

export type Question = {question:string; code?:string; options:string[]; answer:number; explanation:string};

export default function ProgrammingQuiz({slug, questions}:{slug:string; questions:Question[]}) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const result = useRef<HTMLDivElement>(null);
  const firstOption = useRef<HTMLInputElement>(null);
  const answered = Object.keys(answers).length;
  const correct = questions.filter((question, index) => answers[index] === question.answer).length;
  const score = Math.round(correct / questions.length * 100);

  return <section className="programming-quiz" aria-labelledby={'test-'+slug}>
    <h2 id={'test-'+slug}>Tes pemahaman</h2>
    <p>Jawab {questions.length} soal terlebih dahulu, lalu periksa jawaban untuk melihat skor dan pembahasannya. Hasil tes hanya berlaku selama halaman ini terbuka.</p>
    <form onSubmit={event => {
      event.preventDefault();
      if (answered !== questions.length) return;
      setSubmitted(true);
      // The result is already mounted, so it can receive focus after submission.
      result.current?.focus();
    }}>
      {questions.map((question, index) => <fieldset key={index} disabled={submitted} className="programming-quiz-question">
        <legend>{index+1}. {question.question}</legend>
        {question.code && <pre tabIndex={0} aria-label={'Kode untuk soal '+(index+1)}><code>{question.code}</code></pre>}
        <div className="programming-quiz-options">{question.options.map((option, optionIndex) => {
          const isAnswer = submitted && optionIndex === question.answer;
          const isWrong = submitted && answers[index] === optionIndex && !isAnswer;
          return <label key={optionIndex} className={isAnswer ? 'is-correct' : isWrong ? 'is-wrong' : ''}>
            <input ref={index === 0 && optionIndex === 0 ? firstOption : undefined} type="radio" name={slug+'-test-'+index} value={optionIndex} checked={answers[index] === optionIndex} onChange={() => setAnswers(previous => ({...previous, [index]:optionIndex}))}/>
            <span>{option}{isAnswer && <strong> · Jawaban benar</strong>}{isWrong && <strong> · Pilihanmu kurang tepat</strong>}</span>
          </label>;
        })}</div>
        {submitted && <div className="programming-quiz-explanation"><strong>{answers[index] === question.answer ? 'Benar.' : 'Belum tepat.'}</strong><p>{question.explanation}</p></div>}
      </fieldset>)}
      <div ref={result} tabIndex={-1} className="programming-quiz-result" role="status" aria-live="polite">
        {submitted ? <><strong>Skor: {score}/100 · {correct} dari {questions.length} benar</strong><p>{correct === questions.length ? 'Semua jawaban benar! Lanjutkan latihan praktik untuk memperkuat pemahaman.' : 'Baca pembahasan pada soal yang belum tepat, pelajari kembali materinya, lalu coba lagi.'}</p></> : <p>{answered} dari {questions.length} soal sudah dijawab. Jawab semua soal untuk memeriksa hasil.</p>}
      </div>
      {submitted ? <button type="button" onClick={() => {
        setAnswers({});
        setSubmitted(false);
        // Enable controls before returning focus to the first option.
        requestAnimationFrame(() => firstOption.current?.focus());
      }}>Ulangi tes</button> : <button type="submit" disabled={answered !== questions.length}>Periksa jawaban</button>}
    </form>
    <p className="programming-quiz-note">Skor tes tidak mengubah tanda materi selesai. Tandai materi setelah memahami penjelasan dan mencoba latihannya.</p>
  </section>;
}
