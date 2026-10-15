'use client';
import {useState,useEffect} from 'react';
import {usePathname} from 'next/navigation';
import Link from 'next/link';
export function SiteHeader(){
 const pathname=usePathname();
 const [open,setOpen]=useState(false);
 const network=pathname.startsWith('/jaringan');
 const electricity=['/listrik','/modul','/materi','/simulator','/galeri'].some(p=>pathname===p||pathname.startsWith(p+'/'));
 const home=network?'/jaringan':electricity?'/listrik':'/';
 const brand=network?'Learn Jaringan':electricity?'Learn Listrik':'Ruang Belajar';
 const links=network?[{href:'/jaringan',label:'Beranda jaringan'},{href:'/jaringan#kurikulum',label:'Kurikulum'},{href:'/jaringan/mtcna',label:'Persiapan MTCNA'}]:electricity?[{href:'/listrik',label:'Beranda listrik'},{href:'/modul',label:'Modul'},{href:'/simulator',label:'Simulator'},{href:'/galeri',label:'Galeri alat'}]:[{href:'/',label:'Dashboard'},{href:'/listrik',label:'Learn Listrik'},{href:'/jaringan',label:'Learn Jaringan'}];
 useEffect(()=>setOpen(false),[pathname]);
 return <header className="academy-header"><nav className="academy-nav" aria-label="Navigasi utama"><Link href={home} className="academy-nav-brand" onClick={()=>setOpen(false)}><span aria-hidden="true">F.</span><span>{brand}<small>{network?'Jaringan komputer':electricity?'Listrik & elektronika':'Pilih jalur belajarmu'}</small></span></Link><button type="button" className="academy-menu-toggle" aria-expanded={open} aria-controls="academy-menu" onClick={()=>setOpen(!open)}>{open?'Tutup ✕':'Menu ☰'}</button><div id="academy-menu" className={'academy-nav-menu'+(open?' is-open':'')}><div className="academy-nav-links">{links.map(l=><Link key={l.href} href={l.href} onClick={()=>setOpen(false)} aria-current={pathname===l.href?'page':undefined}>{l.label}</Link>)}</div><div className="academy-nav-actions">{(network||electricity)&&<Link className="academy-switch" href="/" onClick={()=>setOpen(false)}>Ganti akademi ↗</Link>}<a href="https://www.fikss.site/articles">Portofolio ↗</a></div></div></nav></header>;
}
export function SiteFooter(){return <footer className="academy-footer">
 <div className="academy-footer-grid"><section className="academy-footer-brand"><Link href="/" className="academy-footer-logo"><span aria-hidden="true">F.</span> Ruang Belajar Fikri</Link><p>Memahami teknologi, satu konsep setiap hari. Materi listrik dan jaringan yang dekat dengan kebutuhan sehari-hari.</p><a href="https://www.fikss.site">Kenali Fikri ↗</a></section>
 <nav aria-label="Akademi belajar"><h2>Jelajahi akademi</h2><Link href="/listrik">Listrik & elektronika</Link><Link href="/jaringan">Jaringan komputer</Link><Link href="/jaringan/mtcna">Persiapan MTCNA</Link><Link href="/simulator">Simulator listrik</Link></nav>
 <nav aria-label="Materi awal"><h2>Mulai dari dasar</h2><Link href="/materi/apa-itu-listrik">Apa itu listrik?</Link><Link href="/jaringan/apa-itu-jaringan">Apa itu jaringan?</Link><Link href="/jaringan/kabel-utp-kategori">Mengenal kabel jaringan</Link><Link href="/jaringan/perangkat-jaringan">Router, switch, dan AP</Link></nav>
 <section><h2>Belajar dengan terarah</h2><p>Baca penjelasan, lihat ilustrasi, lalu coba di lab milik sendiri. Tandai materi yang sudah dipahami.</p><a href="https://www.fikss.site/articles">Artikel portofolio ↗</a><a href="https://mikrotik.com/training/about">Informasi sertifikasi MikroTik ↗</a></section></div>
 <div className="academy-footer-bottom"><p>© 2026 Fikri · Edukasi terbuka untuk semua.</p><p>Materi persiapan mandiri · Bukan penyelenggara sertifikasi resmi MikroTik.</p></div>
 </footer>}
