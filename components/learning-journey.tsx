'use client';
import {useEffect, useState} from 'react';
import Link from 'next/link';
import {lessons} from '@/lib/course';
import {readCompleted} from '@/lib/learning-storage';
export default function LearningJourney() {
  const [completed, setCompleted] = useState<string[]>([]);
  useEffect(() => {
    const refresh = () => setCompleted(lessons.filter(l => readCompleted(l.slug)).map(l => l.slug));
    refresh();
    window.addEventListener('storage', refresh);
    window.addEventListener('learning-progress', refresh);
    return () => {window.removeEventListener('storage', refresh); window.removeEventListener('learning-progress', refresh);};
  }, []);
  const next = lessons.find(l => !completed.includes(l.slug));
  return <section className="panel space-y-3">
    <div className="flex flex-wrap gap-2 items-center justify-between"><h2 className="text-xl font-extrabold">🎯 Perjalanan Belajarmu</h2><span className="font-bold text-teal-700">{completed.length}/{lessons.length}</span></div>
    <progress className="learning-progress w-full" aria-label="Materi selesai" max={lessons.length} value={completed.length}/>
    <p className="text-slate-600 text-sm">Materi yang kamu tandai selesai tersimpan di browser ini. Lanjutkan di browser dan perangkat yang sama.</p>
    {next ? <Link href={'/materi/'+next.slug} className="btn">Lanjut belajar: {next.title} →</Link> : <p className="font-bold text-teal-800">Semua materi telah kamu tandai selesai. Buka kembali modul untuk mengulang latihan!</p>}
    <Link href="/modul" className="text-teal-700 font-bold block">Lihat semua materi →</Link>
  </section>;
}
