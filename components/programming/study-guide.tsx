import Link from 'next/link';
import guides from '@/lib/programming-study-guides.json';

type TrackId = keyof typeof guides;

export default function StudyGuide({id, compact = false}:{id:string; compact?:boolean}) {
  const guide = guides[id as TrackId];
  if (!guide) return null;

  const basics = <>
    <h3>Bekal sebelum mulai</h3><p>{guide.bekal}</p>
    <h3>Yang akan kamu kuasai</h3><ul>{guide.tujuan.map(item => <li key={item}>{item}</li>)}</ul>
    <h3>Istilah dengan bahasa sederhana</h3>
    <dl className="programming-glossary">{guide.istilah.map(item => <div key={item.term}><dt>{item.term}</dt><dd>{item.meaning}</dd></div>)}</dl>
  </>;

  if (compact) return <details className="programming-study-guide programming-guide-compact">
    <summary>Butuh bekal atau arti istilah pada jalur ini?</summary>
    {basics}
    <p><Link href={'/programming/'+id+'#panduan-belajar'}>Buka panduan belajar dan latihan bertahap →</Link></p>
  </details>;

  return <section id="panduan-belajar" className="programming-study-guide net-article" aria-labelledby="study-guide-title">
    <p className="net-eyebrow">BEKAL → CONTOH → LATIHAN</p>
    <h2 id="study-guide-title">Mulai dengan gambaran yang jelas.</h2>
    {basics}
    <h3>Satu contoh untuk menghubungkan konsep</h3><p>{guide.kasus}</p>
    <ol>{guide.alur.map(item => <li key={item}>{item}</li>)}</ol>
    <h3>Latihan bertahap</h3><ol>{guide.tugas.map(item => <li key={item}>{item}</li>)}</ol>
    <aside className="net-check"><h3>Kapan siap melanjutkan?</h3><p>{guide.hasil}</p></aside>
    <aside className="net-warning"><strong>Kesalahan yang sering terjadi</strong><p>{guide.salah}</p></aside>
    <p><Link href={guide.link}>Hubungkan konsep melalui studi kasus →</Link></p>
  </section>;
}
