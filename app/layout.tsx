import {LearningAccountProvider} from '@/components/auth/provider';
import './globals.css';
import { SiteHeader, SiteFooter } from '@/components/network/site-chrome';
export const metadata={icons:{icon:[{url:'/favicon.ico',sizes:'16x16 32x32 48x48 64x64',type:'image/x-icon'},{url:'/favicon-96.png',sizes:'96x96',type:'image/png'},{url:'/favicon.svg',sizes:'any',type:'image/svg+xml'}],apple:[{url:'/apple-touch-icon.png',sizes:'180x180',type:'image/png'}]},title:'Ruang Belajar Fikri — Listrik, Jaringan, IoT, Git & Python',description:'Pilih akademi listrik dan elektronika jaringan komputer, Internet of Things, Git dan GitHub, atau pemrograman Python. Materi gratis, bertahap, dan ramah pemula.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="id"><body><a href="#konten" className="skip-link">Lewati ke konten</a><LearningAccountProvider><SiteHeader/>{children}<SiteFooter/></LearningAccountProvider></body></html>}
