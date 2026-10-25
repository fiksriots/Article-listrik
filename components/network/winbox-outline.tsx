'use client';

import Link from 'next/link';
import {useEffect, useState} from 'react';
import {readNetworkProgress} from './progress-store';

import {winboxPhases} from '@/lib/winbox-phases';

type Item = {slug: string; title: string; summary: string; minutes: number; phase: number};

export default function WinboxOutline({items, current, compact = false}: {
  items: Item[];
  current?: string;
  compact?: boolean;
}) {
  const [done, setDone] = useState<string[]>([]);
  useEffect(() => {
    const refresh = () => setDone(readNetworkProgress());
    refresh();
    window.addEventListener('network-progress', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('network-progress', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  return <section id={compact ? undefined : 'submateri-winbox'} className={compact ? 'winbox-outline is-compact' : 'winbox-outline'}>
    <h2>Praktik MikroTik melalui Winbox 4</h2>
    {!compact && <p>Mulai setelah memahami IP, subnet, gateway, DNS, dan routing dasar. Ikuti {items.length} submateri ini menggunakan router lab. Setiap submateri memiliki tanda sudah dibaca sendiri.</p>}
    <p className="winbox-progress">{items.filter(item => done.includes(`winbox-${item.slug}`)).length} dari {items.length} submateri sudah dibaca</p>
    <ol>{items.map((item, index) => {
      const read = done.includes(`winbox-${item.slug}`);
      return <li key={item.slug}>
        {(index === 0 || items[index - 1].phase !== item.phase) && <p className="winbox-phase">Tahap {item.phase + 1} · {winboxPhases[item.phase]}</p>}
        <Link href={'/jaringan/winbox/' + item.slug} aria-current={current === item.slug ? 'page' : undefined}>
          <span className="winbox-number">{String(index + 1).padStart(2, '0')}</span>
          <span><strong>{item.title}</strong>{!compact && <span className="winbox-summary">{item.summary}</span>}<small>{read ? '✓ Sudah dibaca' : `${item.minutes} menit`}{current === item.slug ? ' · Sedang dibaca' : ''}</small></span>
        </Link>
      </li>;
    })}</ol>
  </section>;
}
