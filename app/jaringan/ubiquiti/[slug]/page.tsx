import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {ubiquitiLessons} from '@/lib/ubiquiti-course';
import {CompleteLesson} from '@/components/network/academy';
import CodeBlock from '@/components/code-block';
import ArticleShare from '@/components/article-share';
import '../ubiquiti.css';
export function generateStaticParams(){return ubiquitiLessons.map(l=>({slug:l.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const l=ubiquitiLessons.find(l=>l.slug===slug);return {title:l?`${l.title} | Wireless Ubiquiti`:'Materi tidak ditemukan',description:l?.summary,alternates:{canonical:'https://article.fikss.site/jaringan/ubiquiti/'+slug}}}
export default async function UbiquitiLessonPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const index=ubiquitiLessons.findIndex(l=>l.slug===slug);if(index<0)notFound();const l=ubiquitiLessons[index];
 return <main id="konten" className="ubq-reader">
  <Link className="net-back" href="/jaringan/ubiquiti#urutan">← Wireless Ubiquiti · materi {index+1} dari {ubiquitiLessons.length}</Link>
  <header className="ubq-header"><span className="net-eyebrow">WIRELESS UBIQUITI / BELAJAR BERTAHAP</span><h1>{l.title}</h1><p>{l.summary}</p><ul className="ubq-meta" aria-label="Informasi bacaan"><li>{l.minutes} menit baca</li><li>{l.sections.length} bagian</li><li>Praktik dan pembahasan</li></ul></header>
  <article className="net-article ubq-body">
   <nav className="ubq-toc" aria-label="Daftar isi"><details><summary>Alur pembahasan</summary><ol>{l.sections.map((s,i)=><li key={s.title}><a href={'#bagian-'+(i+1)}>{s.title}</a></li>)}<li><a href="#praktik">Praktik dan pembahasannya</a></li><li><a href="#cek-pemahaman">Cek pemahaman</a></li></ol></details></nav>
   {l.intro.split('\n\n').map((p,i)=><p key={i}>{p}</p>)}
   <section className="ubq-goals"><h2>Setelah membaca, kamu bisa…</h2><ul>{l.goals.map(g=><li key={g}>{g}</li>)}</ul></section>
   <aside className="net-analogy"><span>BAYANGKAN DULU</span><p>{l.analogy}</p></aside>
   <figure className="ubq-diagram"><img src={'/network/ubiquiti/'+l.diagram+'.svg'} alt={l.diagramAlt} width="600" height="480"/><figcaption>{l.diagramAlt}. Ilustrasi konsep, tidak berskala.</figcaption></figure>
   {l.sections.map((s,i)=><section key={s.title} aria-labelledby={'bagian-'+(i+1)}><h2 id={'bagian-'+(i+1)}>{s.title}</h2>{s.body.split('\n\n').map((p,n)=><p key={n}>{p}</p>)}{s.table&&<div className="net-table-wrap" role="region" tabIndex={0} aria-label={s.table.caption+' · geser ke samping'}><table><caption>{s.table.caption}</caption><thead><tr>{s.table.headers.map(h=><th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{s.table.rows.map((row,n)=><tr key={n}>{row.map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>}{s.code&&<CodeBlock code={s.code} language={s.language??'text'} label={s.codeLabel??'Contoh lab'}/>}</section>)}
   <section aria-labelledby="praktik"><h2 id="praktik">Praktik yang harus diselesaikan</h2><p>Gunakan lab terisolasi atau data contoh yang diberi label fiktif. Catat hasil aktual dan bagian yang belum diuji.</p><ol>{l.practice.map(p=><li key={p}>{p}</li>)}</ol><details className="ubq-review"><summary>Pembahasan praktik dan hasil yang diharapkan</summary><p>{l.practiceReview}</p></details></section>
   <section className="net-check" aria-labelledby="cek-pemahaman"><h2 id="cek-pemahaman">Cek pemahaman</h2><p>{l.check}</p><details><summary>Lihat pembahasan setelah mencoba</summary><p>{l.answer}</p></details></section>
   <section className="net-sources"><h2>Referensi dan pendalaman</h2><p>Rujukan resmi diperiksa pada 7 November 2026. Contoh alamat, kasus, dan hasil adalah bahan latihan. Periksa dokumentasi model, firmware, dan ketentuan lokasi pemasangan sebelum praktik.</p><ul>{l.sources.map(s=><li key={s.url}><a href={s.url}>{s.title} ↗</a></li>)}</ul><h3>Materi yang menyambung</h3><ul>{l.related.map(r=><li key={r.href}><Link href={r.href}>{r.title} →</Link></li>)}</ul></section>
  </article>
  <CompleteLesson slug={slug}/><ArticleShare title={l.title} summary={l.summary} path={'/jaringan/ubiquiti/'+slug}/>
  <nav className="net-lesson-nav" aria-label="Urutan materi wireless Ubiquiti">{index>0&&<Link href={'/jaringan/ubiquiti/'+ubiquitiLessons[index-1].slug}>← {ubiquitiLessons[index-1].title}</Link>}{index<ubiquitiLessons.length-1?<Link href={'/jaringan/ubiquiti/'+ubiquitiLessons[index+1].slug}>{ubiquitiLessons[index+1].title} →</Link>:<Link href="/jaringan/ubiquiti#hasil-akhir">Evaluasi hasil akhir →</Link>}</nav>
 </main>
}
