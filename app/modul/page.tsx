export const metadata={title:'Urutan Belajar Listrik dari Nol | Learn Electric',description:'Ikuti materi listrik dan elektronika secara bertahap, dari keselamatan hingga motor dan PLC.',alternates:{canonical:'https://fikss.id/modul'}};
import Link from 'next/link';
import {stages,lessons} from '@/lib/course';
import LearningJourney from '@/components/learning-journey';
export default function Modules(){return <main id="konten" className="max-w-5xl mx-auto px-5 py-12 space-y-8">
  <header className="space-y-3"><p className="lesson-kicker">LEARN ELECTRIC · JALUR BELAJAR</p><h1 className="text-3xl md:text-4xl font-extrabold">Urutan belajar listrik dari nol</h1><p className="muted">Ikuti nomor 01–{lessons.length} dari atas ke bawah. Setiap tahap menjelaskan tujuan dan bekal yang perlu dipahami. Semua materi tetap dapat dibuka kapan saja.</p><Link className="btn" href={'/materi/'+lessons[0].slug}>Mulai dari pelajaran 01 →</Link></header>
  <LearningJourney/>
  <nav aria-label="Lompat ke tahap belajar" className="flex flex-wrap gap-2">{stages.map((s,i)=><a key={s.id} className="course-stage-chip" href={'#tahap-'+s.id}>{i+1}. {s.name}</a>)}</nav>
  <div className="space-y-6">{stages.map((stage,i)=><section id={'tahap-'+stage.id} className="panel scroll-mt-6" key={stage.id}>
    <p className="lesson-kicker">TAHAP {i+1} DARI {stages.length} · {stage.slugs.length} MATERI</p><h2 className="font-extrabold text-2xl mt-2">{stage.name}</h2><p className="muted mt-2">{stage.description}</p><p className="course-prerequisite"><strong>Bekal sebelum mulai:</strong> {stage.prerequisite}</p>
    <ol className="course-lesson-list">{stage.slugs.map(slug=>{const index=lessons.findIndex(l=>l.slug===slug);const l=lessons[index];return <li key={slug}><Link href={'/materi/'+slug}><span className="course-lesson-number">{String(index+1).padStart(2,'0')}</span><span className="min-w-0"><strong>{l.title}</strong><span className="course-lesson-summary">{l.summary}</span><small>{l.minutes} menit baca</small></span><span aria-hidden="true">→</span></Link></li>})}</ol>
  </section>)}</div>
  <p className="muted text-sm">Setelah membaca, tekan “Tandai materi selesai” agar centang muncul di sidebar. Urutan belajar membantu memahami teori; bukan izin melakukan pekerjaan listrik bertegangan.</p>
</main>}
