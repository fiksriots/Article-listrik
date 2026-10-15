import './globals.css';
import { SiteHeader, SiteFooter } from '@/components/network/site-chrome';
export const metadata={title:'Akademi Listrik & Elektronika',description:'Belajar listrik dari nol secara gratis'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="id"><body><a href="#konten" className="skip-link">Lewati ke konten</a><SiteHeader/>{children}<SiteFooter/></body></html>}
