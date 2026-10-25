import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import ArticleShare from '@/components/article-share';
import {CompleteLesson} from '@/components/network/academy';
import ArticleSidebar from '@/components/network/article-sidebar';
import WinboxOutline from '@/components/network/winbox-outline';
import {articleMetadata} from '@/lib/article-sharing';
import {WINBOX_BASE, winboxItems, winboxLessons, winboxProgressSlug} from '@/lib/winbox-course';
import '../winbox.css';

export const dynamicParams = false;
export function generateStaticParams() {
  return winboxLessons.map(({slug}) => ({topic: slug}));
}
export async function generateMetadata({params}: {params: Promise<{topic: string}>}): Promise<Metadata> {
  const {topic} = await params;
  const lesson = winboxLessons.find(item => item.slug === topic);
  if (!lesson) notFound();
  return {
    ...articleMetadata(lesson.title, lesson.summary, `${WINBOX_BASE}/${topic}`),
    title: `${lesson.title} | Winbox 4 · Learn Jaringan`,
    description: lesson.summary,
    alternates: {canonical: `https://article.fikss.site${WINBOX_BASE}/${topic}`},
  };
}
export default async function WinboxLessonPage({params}: {params: Promise<{topic: string}>}) {
  const {topic} = await params;
  const index = winboxLessons.findIndex(item => item.slug === topic);
  if (index < 0) notFound();
  const lesson = winboxLessons[index];
  const previous = winboxLessons[index - 1];
  const next = winboxLessons[index + 1];

  return <div className="net-lesson-layout">
    <ArticleSidebar key={topic} article={`winbox-${topic}`}>
      <Link className="net-back" href={`${WINBOX_BASE}#submateri-winbox`}>← Kurikulum Praktik Winbox</Link>
      <WinboxOutline items={winboxItems} current={topic} compact/>
    </ArticleSidebar>
    <main id="konten" className="net-lesson-main">
      <nav className="winbox-breadcrumb" aria-label="Jejak halaman"><Link href="/jaringan">Learn Jaringan</Link><span aria-hidden="true"> / </span><Link href={WINBOX_BASE}>Praktik Winbox</Link><span aria-hidden="true"> / </span><span>Submateri {index + 1}</span></nav>
      <header className="net-lesson-heading">
        <p className="net-eyebrow">SUBMATERI {index + 1} DARI {winboxLessons.length} · PRAKTIK WINBOX 4</p>
        <h1>{lesson.title}</h1><p>{lesson.summary}</p>
        <span>{lesson.minutes} menit · RouterOS v7 · Bahasa pemula · Diperbarui 25 Oktober 2026</span>
      </header>
      <aside className="net-track-note"><p>Bagian dari <Link href={`${WINBOX_BASE}#submateri-winbox`}>Praktik Winbox</Link> di Learn Jaringan. Gambar diberi keterangan screenshot asli atau diagram konsep. Sebagian gambar hanya menunjukkan lokasi menu; dialog yang belum tersedia tetap dijelaskan dalam teks.</p></aside>
      {/* Content is curated repository HTML, never user-submitted markup. */}
      <article className="net-article winbox-content" dangerouslySetInnerHTML={{__html: lesson.html}}/>
      <ArticleShare title={lesson.title} summary={lesson.summary} path={`${WINBOX_BASE}/${topic}`}/>
      <CompleteLesson slug={winboxProgressSlug(topic)}/>
      <nav className="net-lesson-nav" aria-label="Urutan submateri Winbox">
        <Link href={previous ? `${WINBOX_BASE}/${previous.slug}` : WINBOX_BASE}><small>← {previous ? 'Submateri sebelumnya' : 'Kembali ke kurikulum'}</small>{previous?.title ?? 'Kurikulum Praktik Winbox'}</Link>
        <Link href={next ? `${WINBOX_BASE}/${next.slug}` : `${WINBOX_BASE}#submateri-winbox`}><small>{next ? 'Submateri berikutnya →' : 'Semua submateri ✓'}</small>{next?.title ?? 'Tinjau kembali urutan belajar'}</Link>
      </nav>
      { !next && <p className="net-track-note">Selesai berlatih? <Link href="/jaringan/lab-jaringan-rumah">Lanjutkan materi utama: membangun jaringan rumah →</Link></p> }
    </main>
  </div>;
}
