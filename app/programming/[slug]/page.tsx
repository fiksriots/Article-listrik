import Link from 'next/link';
import {notFound} from 'next/navigation';
import Catalog, {Complete} from '@/components/programming/academy';
import CodeBlock from '@/components/code-block';
import ProgrammingQuiz from '@/components/programming/quiz';
import programmingQuizzes from '@/lib/programming-quizzes.json';
import LessonReader from '@/components/lesson-reader';
import ArticleShare from '@/components/article-share';
import {articleMetadata} from '@/lib/article-sharing';
import {programmingLessons} from '@/lib/programming-course';
import {getProgrammingLessonTrack} from '@/lib/programming-tracks';

export function generateStaticParams() {
  return programmingLessons.map(lesson => ({slug:lesson.slug}));
}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}) {
  const {slug} = await params;
  const lesson = programmingLessons.find(item => item.slug === slug);
  return articleMetadata(lesson ? lesson.title+' | '+(getProgrammingLessonTrack(slug)?.title || 'Learn Programming') : 'Materi tidak ditemukan', lesson?.summary || '', '/programming/'+slug);
}

export default async function Page({params}:{params:Promise<{slug:string}>}) {
  const {slug} = await params;
  const track = getProgrammingLessonTrack(slug);
  if (!track) notFound();
  const index = track.lessons.findIndex(item => item.slug === slug);
  const lesson = track.lessons[index];
  const previous = track.lessons[index-1];
  const next = track.lessons[index+1];
  return <div className="net-lesson-layout">
    <aside className="net-sidebar"><details key={slug}><summary>Daftar materi {track.title}</summary><Catalog items={track.catalog} stages={track.stages} current={slug} label={track.title} homeHref={track.href}/></details></aside>
    <main id="konten" className="net-lesson-main">
      <Link href={track.href+"#kurikulum"} className="net-back">← Semua materi {track.title}</Link>
      <header className="net-lesson-heading"><p className="net-eyebrow">TAHAP {lesson.stage+1} / {track.stages[lesson.stage]} · MATERI {index+1} DARI {track.lessons.length}</p><h1>{lesson.title}</h1><p>{lesson.summary}</p><span>±{lesson.minutes} menit · Tambahkan waktu untuk praktik</span></header>
      <aside className="net-track-note"><strong>Jalur {track.title}</strong><p><Link href="/programming">Pilih jalur lain di Learn Programming →</Link></p></aside>
      <LessonReader key={slug} catalog={track.href+"#kurikulum"} next={next ? {href:'/programming/'+next.slug,title:next.title} : undefined}/>
      <article className="net-article programming-article">
        <aside className="net-analogy"><span>BAYANGKAN DULU</span><p>{lesson.analogy}</p></aside>
        <h2>Pelan-pelan, kita pahami</h2>{lesson.explain.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
        {lesson.diagram && <figure><img src={'/programming/'+lesson.diagram+'.svg'} alt={lesson.diagramAlt} width="860" height="480"/><figcaption>{lesson.diagramAlt}</figcaption></figure>}
        <section><h2>Ringkasan konsep</h2><div className="article-table-scroll" role="region" aria-label="Tabel ringkasan konsep, dapat digeser ke samping" tabIndex={0}><table><thead><tr>{lesson.table.headers.map(header => <th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{lesson.table.rows.map((row,i) => <tr key={i}>{row.map((cell,j) => <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div></section>
        <section><h2>Contoh dan hasilnya</h2><p>Salin kode program ke file .py dan jalankan dengan Python 3. Ikuti nama file dan petunjuk folder pada materi. Blok bertanda pseudocode adalah rancangan, sehingga tidak dijalankan sebagai Python.</p>{lesson.blocks.map(block => <section key={block.label}><h3>{block.label}</h3><CodeBlock label={block.label} language={block.language || 'python'} code={block.code}/>{block.output && <><h4>{block.measurement ? 'Bentuk keluaran · angka pengukuran akan berbeda' : 'Hasil yang diharapkan'}</h4><CodeBlock label="Contoh keluaran" language="text" code={block.output}/></>}<p>{block.explanation}</p></section>)}</section>
        <section><h2>Langkah praktik</h2><ol>{lesson.steps.map(step => <li key={step}>{step}</li>)}</ol></section>
        <section><h2>Coba sendiri</h2><ol>{lesson.practice.map(task => <li key={task}>{task}</li>)}</ol></section>
        <aside className="net-warning"><strong>Perhatikan bagian ini</strong><p>{lesson.warning}</p></aside>
        <section className="net-check"><h2>Cek pemahaman</h2><p>{lesson.check}</p><details><summary>Lihat pembahasan</summary><p>{lesson.answer}</p></details></section>
        <ProgrammingQuiz key={slug} slug={slug} questions={programmingQuizzes[slug as keyof typeof programmingQuizzes]}/>
        <section className="net-sources"><h2>Baca sumber resminya</h2><ul><li><a href={lesson.source}>Sumber terkait materi ↗</a></li>{slug === 'menjalankan-python' && <li><a href="https://www.python.org/downloads/">Unduh Python dari situs resmi ↗</a></li>}</ul></section>
      </article>
      <ArticleShare title={lesson.title} summary={lesson.summary} path={'/programming/'+slug}/>
      <Complete key={slug} slug={slug}/>
      <nav className="net-lesson-nav" aria-label={'Urutan materi '+track.title}><Link href={previous ? '/programming/'+previous.slug : track.href}>← {previous?.title || 'Beranda '+track.title}</Link><Link href={next ? '/programming/'+next.slug : track.href+'#kurikulum'}>{next?.title || 'Selesai jalur '+track.title+' · kembali ke kurikulum'} →</Link></nav>
    </main>
  </div>;
}
