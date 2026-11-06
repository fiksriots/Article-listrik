import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {nocLessons,nocWeeks} from '@/lib/noc-course';
import {CompleteLesson} from '@/components/network/academy';
import CodeBlock from '@/components/code-block';
import ArticleShare from '@/components/article-share';
import '../noc.css';

export function generateStaticParams(){return nocLessons.map(l=>({slug:l.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params;
 const lesson=nocLessons.find(l=>l.slug===slug);
 return {title:lesson?`${lesson.title} | Junior NOC`:'Materi tidak ditemukan',description:lesson?.summary,alternates:{canonical:'https://article.fikss.site/jaringan/noc/'+slug}};
}
export default async function NocLessonPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 const index=nocLessons.findIndex(l=>l.slug===slug);
 if(index<0)notFound();
 const l=nocLessons[index];
 const weeks=nocWeeks.flatMap((w,i)=>w.resources.some(r=>r.slug===slug)?[i+1]:[]);
 return <main id="konten" className="noc-article">
  <Link className="net-back" href={'/jaringan/noc#minggu-'+weeks[0]}>← Roadmap Junior NOC · minggu {weeks.join(', ')}</Link>
  <header>
   <span className="net-eyebrow">OPERASIONAL NOC / PEMULA</span>
   <h1>{l.title}</h1><p>{l.summary}</p>
   <p className="noc-reading-time">Sekitar {l.minutes} menit membaca, di luar praktik · {l.sections.length} bagian pembahasan</p>
  </header>
  <article className="net-article">
   <p className="noc-intro">{l.intro}</p>
   <section className="noc-objectives" aria-labelledby="tujuan-belajar">
    <h2 id="tujuan-belajar">Setelah membaca, kamu bisa…</h2>
    <ul>{l.goals.map(goal=><li key={goal}>{goal}</li>)}</ul>
   </section>
   <aside className="net-analogy"><span>BAYANGKAN DULU</span><p>{l.analogy}</p></aside>
   <nav className="noc-toc" aria-label="Daftar isi artikel">
    <details open><summary>Alur pembahasan</summary><ul>
     {l.sections.map((s,i)=><li key={s.title}><a href={'#bagian-'+(i+1)}>{s.title}</a></li>)}
     <li><a href="#praktik">Praktik dan pembahasannya</a></li>
     <li><a href="#cek-pemahaman">Cek pemahaman</a></li>
    </ul></details>
   </nav>
   {l.sections.map((s,i)=><section key={s.title} className="noc-explanation" aria-labelledby={'bagian-'+(i+1)}>
    <h2 id={'bagian-'+(i+1)}>{s.title}</h2>
    {s.body.split('\n\n').map((paragraph,n)=><p key={n}>{paragraph}</p>)}
    {s.table&&<div className="net-table-wrap"><table>
     <caption>{s.table.caption}</caption>
     <thead><tr>{s.table.headers.map(h=><th key={h} scope="col">{h}</th>)}</tr></thead>
     <tbody>{s.table.rows.map((row,n)=><tr key={n}>{row.map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}</tbody>
    </table></div>}
    {s.code&&<CodeBlock code={s.code} language={s.language??'text'} label={s.codeLabel??'Contoh pemeriksaan'}/>}
    {s.output&&<CodeBlock code={s.output} language="text" label={s.outputLabel??'Contoh keluaran fiktif'}/>}
   </section>)}
   <section aria-labelledby="praktik">
    <h2 id="praktik">Praktik yang harus diselesaikan</h2>
    <p>Gunakan lab terisolasi milik sendiri atau data fiktif. Simpan hasil aktual, bukan hanya daftar perintah. Lama praktik bergantung kesiapan lab dan pengalamanmu.</p>
    <ol>{l.practice.map(p=><li key={p}>{p}</li>)}</ol>
    <details className="noc-practice-review"><summary>Pembahasan praktik dan hasil yang diharapkan</summary><p>{l.practiceReview}</p></details>
   </section>
   {l.template&&<section><h2>Template catatan latihan</h2><CodeBlock code={l.template} language="text" label="Salin dan lengkapi dengan data fiktif"/></section>}
   <section className="net-check" aria-labelledby="cek-pemahaman">
    <h2 id="cek-pemahaman">Cek pemahaman</h2><p>{l.check}</p>
    <details><summary>Lihat pembahasan setelah mencoba</summary><p>{l.answer}</p></details>
   </section>
   <section className="net-sources"><h2>Referensi dan pendalaman</h2>
    <p>Contoh kasus, angka, prioritas dan timeline pada artikel ini adalah bahan latihan, bukan hasil pengukuran jaringan nyata. Saat bekerja, ikuti runbook perusahaan serta dokumentasi versi sistem yang digunakan.</p>
    <ul>{l.sources.map(s=><li key={s.url}><a href={s.url}>{s.title} ↗</a></li>)}</ul>
   </section>
  </article>
  <CompleteLesson slug={slug}/>
  <ArticleShare title={l.title} summary={l.summary} path={'/jaringan/noc/'+slug}/>
  <nav className="net-lesson-nav" aria-label="Materi operasional NOC">
   {index>0&&<Link href={'/jaringan/noc/'+nocLessons[index-1].slug}>← {nocLessons[index-1].title}</Link>}
   {index<nocLessons.length-1?<Link href={'/jaringan/noc/'+nocLessons[index+1].slug}>{nocLessons[index+1].title} →</Link>:<Link href="/jaringan/noc#kesiapan">Evaluasi kesiapan →</Link>}
  </nav>
  <p><Link href={'/jaringan/noc#minggu-'+weeks[0]}>Kembali ke urutan materi minggu {weeks[0]} →</Link></p>
 </main>;
}
