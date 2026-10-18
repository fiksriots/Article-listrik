import {LearningAccountProvider} from '@/components/auth/provider';
import './globals.css';
import { SiteHeader, SiteFooter } from '@/components/network/site-chrome';
export const metadata={title:'Ruang Belajar Fikri — Listrik, Jaringan, IoT & Git',description:'Pilih akademi listrik dan elektronika jaringan komputer, Internet of Things, atau Git dan GitHub. Materi gratis, bertahap, dan ramah pemula.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="id"><body><a href="#konten" className="skip-link">Lewati ke konten</a><LearningAccountProvider><SiteHeader/>{children}<SiteFooter/></LearningAccountProvider></body></html>}
