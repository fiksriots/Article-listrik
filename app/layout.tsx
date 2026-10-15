import './globals.css';
import { SiteHeader, SiteFooter } from '@/components/network/site-chrome';
export const metadata={title:'Ruang Belajar Fikri — Listrik & Jaringan',description:'Pilih akademi listrik dan elektronika atau jaringan komputer. Materi gratis, bertahap, dan ramah pemula.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="id"><body><a href="#konten" className="skip-link">Lewati ke konten</a><SiteHeader/>{children}<SiteFooter/></body></html>}
