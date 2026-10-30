import Link from 'next/link';
import {notFound} from 'next/navigation';
import Catalog, {Complete} from '@/components/programming/academy';
import CodeBlock from '@/components/code-block';
import LessonReader from '@/components/lesson-reader';
import ArticleShare from '@/components/article-share';
import {articleMetadata} from '@/lib/article-sharing';
import {programmingLessons, programmingCatalog, programmingStages} from '@/lib/programming-course';

export function generateStaticParams() {
  return programmingLessons.map(lesson => ({slug:lesson.slug}));
}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}) {
  const {slug} = await params;
  const lesson = programmingLessons.find(item => item.slug === slug);
  return articleMetadata(lesson ? lesson.title+' | Learn Programming' : 'Materi tidak ditemukan', lesson?.summary || '', '/programming/'+slug);
}

export default async function Page({params}:{params:Promise<{slug:string}>}) {
  const {slug} = await params;
  const index = programmingLessons.findIndex(item => item.slug === slug);
  if (index < 0) notFound();
  const lesson = programmingLessons[index];
  const previous = programmingLessons[index-1];
  const next = programmingLessons[index+1];
  return <div className="net-lesson-layout">
    <aside className="net-sidebar"><details key={slug}><summary>Daftar materi Learn Programming</summary><Catalog items={programmingCatalog} stages={programmingStages} current={slug}/></details></aside>
    <main id="konten" className="net-lesson-main">
      <Link href="/programming#kurikulum" className="net-back">← Semua materi Learn Programming</Link>
      <header className="net-lesson-heading"><p className="net-eyebrow">TAHAP {lesson.stage+1} / {programmingStages[lesson.stage]} · MATERI {index+1} DARI {programmingLessons.length}</p><h1>{lesson.title}</h1><p>{lesson.summary}</p><span>±{lesson.minutes} menit · Tambahkan waktu untuk praktik</span></header>
      <LessonReader key={slug} catalog="/programming#kurikulum" next={next ? {href:'/programming/'+next.slug,title:next.title} : undefined}/>
      <article className="net-article programming-article">
        <aside className="net-analogy"><span>BAYANGKAN DULU</span><p>{lesson.analogy}</p></aside>
        <h2>Pelan-pelan, kita pahami</h2>{lesson.explain.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
        {lesson.diagram && <figure><img src={'/programming/'+lesson.diagram+'.svg'} alt={lesson.diagramAlt} width="860" height="480"/><figcaption>{lesson.diagramAlt}</figcaption></figure>}
        <section><h2>Ringkasan konsep</h2><div className="article-table-scroll" role="region" aria-label="Tabel ringkasan konsep, dapat digeser ke samping" tabIndex={0}><table><thead><tr>{lesson.table.headers.map(header => <th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{lesson.table.rows.map((row,i) => <tr key={i}>{row.map((cell,j) => <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div></section>
        <section><h2>Contoh dan hasilnya</h2><p>Salin kode program ke file .py dan jalankan dengan Python 3. Blok bertanda pseudocode adalah rancangan, sehingga tidak dijalankan sebagai Python.</p>{lesson.blocks.map(block => <section key={block.label}><h3>{block.label}</h3><CodeBlock label={block.label} language={'language' in block ? block.language : 'python'} code={block.code}/>{block.output && <><h4>Hasil yang diharapkan</h4><CodeBlock label="Contoh keluaran" language="text" code={block.output}/></>}<p>{block.explanation}</p></section>)}</section>
        <section><h2>Langkah praktik</h2><ol>{lesson.steps.map(step => <li key={step}>{step}</li>)}</ol></section>
        <section><h2>Coba sendiri</h2><ol>{lesson.practice.map(task => <li key={task}>{task}</li>)}</ol></section>
        <aside className="net-warning"><strong>Perhatikan bagian ini</strong><p>{lesson.warning}</p></aside>
        <section className="net-check"><h2>Cek pemahaman</h2><p>{lesson.check}</p><details><summary>Lihat pembahasan</summary><p>{lesson.answer}</p></details></section>
        <section className="net-sources"><h2>Baca sumber resminya</h2><ul><li><a href={lesson.source}>Dokumentasi resmi Python terkait materi ↗</a></li>{slug === 'menjalankan-python' && <li><a href="https://www.python.org/downloads/">Unduh Python dari situs resmi ↗</a></li>}</ul></section>
      </article>
      <ArticleShare title={lesson.title} summary={lesson.summary} path={'/programming/'+slug}/>
      <Complete key={slug} slug={slug}/>
      <nav className="net-lesson-nav" aria-label="Urutan materi Learn Programming"><Link href={previous ? '/programming/'+previous.slug : '/programming'}>← {previous?.title || 'Beranda Learn Programming'}</Link><Link href={next ? '/programming/'+next.slug : '/programming#kurikulum'}>{next?.title || 'Selesai · kembali ke kurikulum'} →</Link></nav>
    </main>
  </div>;
}
