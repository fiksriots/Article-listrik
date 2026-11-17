"use client";
import {useState,useEffect,useRef} from 'react';
import {usePathname} from 'next/navigation';
import Link from 'next/link';
import QuickSearch from '@/components/site/quick-search';

const academies=[
 {href:'/listrik',label:'Listrik',hint:'Listrik & elektronika'},
 {href:'/jaringan',label:'Jaringan',hint:'Network & MikroTik'},
 {href:'/iot',label:'IoT',hint:'Perangkat terhubung'},
 {href:'/git',label:'Git',hint:'GitHub & GitLab'},
 {href:'/programming',label:'Programming',hint:'Python, web & data'},
];
const programmingPaths=[['terstruktur','Dasar Python'],['struktur-data','Struktur Data'],['oop','OOP'],['basis-data','Basis Data'],['backend-api','Backend/API'],['pemrograman-jaringan','Jaringan Python'],['web','Web'],['django','Django'],['data-analysis','Data Analysis'],['data-science','Data Science'],['pengujian-debugging','Pengujian'],['proyek-otomasi','Otomasi'],['rekayasa-deployment','Deployment']];
export function SiteHeader(){
 const pathname=usePathname();
 const [open,setOpen]=useState(false);
 const nav=useRef<HTMLElement>(null);
 const menuButton=useRef<HTMLButtonElement>(null);
 const academy=academies.find(item=>pathname===item.href||pathname.startsWith(item.href+'/')) || (['/modul','/materi','/simulator','/galeri'].some(path=>pathname===path||pathname.startsWith(path+'/'))?academies[0]:undefined);
 const paths=academy?.href==='/programming'?[[academy.href,'Semua jalur'],...programmingPaths.map(([path,title])=>['/programming/'+path,title])]:academy?.href==='/jaringan'?[['/jaringan','Kurikulum'],['/jaringan/noc','Roadmap Junior NOC'],['/jaringan/ubiquiti','Wireless & Ubiquiti'],['/jaringan/winbox','Praktik Winbox'],['/jaringan/mtcna','MTCNA'],['/jaringan/mtcre','MTCRE'],['/jaringan/simulator','Simulator'],['/jaringan/troubleshooting','Troubleshooting']]:academy?.href==='/listrik'?[['/listrik','Beranda listrik'],['/modul','Semua modul'],['/simulator','Simulator'],['/galeri','Galeri alat']]:academy?.href==='/iot'?[['/iot','Kurikulum IoT'],['/iot/arduino','Praktik Arduino'],['/iot#simulator','Simulator'],['/iot#perangkat','Kenali perangkat']]:academy?.href==='/git'?[['/git','Semua jalur'],['/git/dasar','Dasar Git'],['/git/github','GitHub'],['/git/gitlab','GitLab'],['/git/panduan-cepat','Panduan cepat']]:[];
 useEffect(()=>setOpen(false),[pathname]);
 useEffect(()=>{
  if(!open)return;
  function escape(event:KeyboardEvent){if(event.key==='Escape'){setOpen(false);menuButton.current?.focus();}}
  document.addEventListener('keydown',escape);return()=>document.removeEventListener('keydown',escape);
 },[open]);
 useEffect(()=>{nav.current?.querySelector('[aria-current="page"]')?.scrollIntoView({block:'nearest',inline:'nearest'});},[pathname]);
 return <header className="site-header">
  <div className="site-header-top"><Link href="/" className="site-brand" aria-label="Article — Ruang Belajar Fikri"><span className="site-brand-mark">a<span>.</span></span><span>Article<small>Ruang Belajar Fikri</small></span></Link>
   <QuickSearch/>
   <div className="site-header-actions"><Link href="/akun" className="site-account-link">Progres belajar <span aria-hidden="true">→</span></Link><button ref={menuButton} type="button" className="site-menu-toggle" onClick={()=>setOpen(value=>!value)} aria-expanded={open} aria-controls="site-academies">{open?'Tutup ✕':'Menu ☰'}</button></div>
  </div>
  <nav id="site-academies" className={'site-academy-nav'+(open?' is-open':'')} aria-label="Navigasi akademi"><div><Link href="/" onClick={()=>setOpen(false)} aria-current={pathname==='/'?'page':undefined}>Beranda</Link>{academies.map(item=><Link href={item.href} key={item.href} onClick={()=>setOpen(false)} aria-current={academy===item?'page':undefined}><span>{item.label}</span><small>{item.hint}</small></Link>)}<Link href="/akun" className="site-mobile-account" onClick={()=>setOpen(false)}>Akun & progres</Link></div></nav>
  {paths.length>0&&<nav ref={nav} className="site-context-nav" aria-label="Materi dan jalur akademi"><div>{paths.map(([href,title])=><Link href={href} key={href} aria-current={pathname===href?'page':undefined}>{title}</Link>)}</div></nav>}
 </header>;
}
export function SiteFooter(){return <footer className="academy-footer">
 <div className="academy-footer-grid"><section className="academy-footer-brand"><Link href="/" className="academy-footer-logo"><span className="fiks-wordmark">Fiks<span className="fiks-dot">.</span></span><span className="fiks-footer-caption">Ruang Belajar Fikri</span></Link><p>Memahami teknologi, satu konsep setiap hari. Materi listrik, jaringan, IoT, Git, Python, web, dan data yang dekat dengan kebutuhan sehari-hari.</p><a href="https://www.fikss.site">Kenali Fikri →</a></section>
 <nav aria-label="Akademi belajar"><h2>Jelajahi akademi</h2><Link href="/listrik">Listrik & elektronika</Link><Link href="/jaringan">Jaringan komputer</Link><Link href="/iot">Internet of Things</Link><Link href="/git">Git & GitHub</Link><Link href="/programming">Learn Programming · Python & Web</Link><Link href="/jaringan/winbox">Praktik Winbox</Link><Link href="/jaringan/troubleshooting">Troubleshooting jaringan</Link><Link href="/jaringan/mtcna">Persiapan MTCNA</Link><Link href="/jaringan/mtcre">Persiapan MTCRE</Link><Link href="/jaringan/simulator">Simulator jaringan</Link><Link href="/simulator">Simulator listrik</Link></nav>
 <nav aria-label="Materi awal"><h2>Mulai dari dasar</h2><Link href="/programming/pemrograman-terstruktur">Apa itu pemrograman terstruktur?</Link><Link href="/iot/apa-itu-iot">Apa itu IoT?</Link><Link href="/materi/apa-itu-listrik">Apa itu listrik?</Link><Link href="/jaringan/apa-itu-jaringan">Apa itu jaringan?</Link><Link href="/jaringan/kabel-utp-kategori">Mengenal kabel jaringan</Link><Link href="/jaringan/perangkat-jaringan">Router, switch, dan AP</Link></nav>
 <section><h2>Belajar dengan terarah</h2><p>Baca penjelasan, lihat ilustrasi, lalu coba di lab milik sendiri. Tandai materi yang sudah dipahami.</p><a href="https://www.fikss.site/articles">Artikel portofolio →</a><a href="https://mikrotik.com/training/about">Informasi sertifikasi MikroTik →</a></section></div>
 <div className="academy-footer-bottom"><p>© 2026 Fikri · Edukasi terbuka untuk semua.</p><p>Materi persiapan mandiri · Bukan penyelenggara sertifikasi resmi MikroTik.</p></div>
 </footer>}
