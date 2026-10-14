'use client';
import {useEffect, useState} from 'react';
import {readCompleted, saveCompleted} from '@/lib/learning-storage';
export default function Progress({slug}: {slug: string}) {
  const [done, setDone] = useState(false);
  const [saved, setSaved] = useState(true);
  useEffect(() => {
    const refresh = () => setDone(readCompleted(slug));
    refresh();
    window.addEventListener('storage', refresh);
    return () => window.removeEventListener('storage', refresh);
  }, [slug]);
  return <section aria-label="Progress materi">
    <button className="btn w-full" aria-pressed={done} onClick={() => {
      const next = !done;
      setDone(next);
      setSaved(saveCompleted(slug, next));
    }}>{done ? '✓ Materi selesai — batalkan tanda' : 'Tandai materi selesai'}</button>
    <p className="text-sm muted mt-2" role="status">{saved ? 'Progress tersimpan di browser ini, bukan di akun atau perangkat lain.' : 'Browser tidak mengizinkan penyimpanan. Tanda selesai hanya berlaku selama halaman ini terbuka.'}</p>
  </section>;
}
