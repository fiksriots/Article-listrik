'use client';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import {stages, lessons} from '@/lib/course';
import {readCompleted} from '@/lib/learning-storage';
export default function LessonSidebar({slug}: {slug:string}) {
  const [open, setOpen] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);
  useEffect(() => {
    const refresh = () => setCompleted(lessons.filter(l => readCompleted(l.slug)).map(l => l.slug));
    refresh();
    window.addEventListener('learning-progress', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('learning-progress', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);
  return <div>
    <button className="lg:hidden btn mb-4" onClick={() => setOpen(!open)} aria-expanded={open}>{open?'Tutup daftar modul':'☰ Daftar modul'}</button>
    <aside className={`lesson-sidebar ${open?'sidebar-open':''}`} aria-label="Navigasi modul">
      <div className="sidebar-heading">📚 Navigasi Pembelajaran</div>
      <p className="text-xs muted mb-3">✓ Sudah dibaca · klik “Tandai materi selesai” setelah membaca.</p>
      {stages.map((stage,i) => <details key={stage.name} open={i===Math.floor(Math.max(0,lessons.findIndex(x=>x.slug===slug))/4)?true:undefined} className="sidebar-stage">
        <summary>{i+1}. {stage.name}</summary>
        <div className="sidebar-links">{stage.modules.map((name,j) => {
          const number=i*4+j;
          const lesson=lessons[number];
          if (!lesson) return <span key={name} className="sidebar-locked">{number+1}. {name} · Segera hadir</span>;
          const done=completed.includes(lesson.slug);
          return <Link key={name} href={'/materi/'+lesson.slug} onClick={()=>setOpen(false)} aria-current={slug===lesson.slug?'page':undefined} className={[slug===lesson.slug?'active':'',done?'lesson-read':''].filter(Boolean).join(' ')}>
            <span>{number+1}. {name}</span>
            {done&&<span className="lesson-read-badge"><span aria-hidden="true">✓ </span>Sudah dibaca</span>}
          </Link>;
        })}</div>
      </details>)}
      <Link href="/modul" className="sidebar-all">Lihat semua modul →</Link>
    </aside>
  </div>;
}
