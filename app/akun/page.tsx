import './account.css';
import Account from '@/components/auth/account';
import {learningTracks} from '@/lib/learning-progress-catalog';
import {googleAuthConfigured} from '@/auth';
export const dynamic = 'force-dynamic';
export const metadata={title:'Masuk dengan Google | Fiks',description:'Login Google opsional untuk akun belajar Fiks.',robots:{index:false,follow:true},alternates:{canonical:'https://article.fikss.site/akun'}};
export default function AccountPage(){return <Account configured={googleAuthConfigured()} tracks={learningTracks}/>}
