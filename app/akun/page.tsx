import Account from '@/components/auth/account';
export const metadata={title:'Akun & Progres Belajar | Fiks',description:'Login opsional untuk menyimpan dan menyinkronkan progres belajar Listrik, Jaringan, dan IoT.',robots:{index:false,follow:true},alternates:{canonical:'https://article.fikss.site/akun'}};
export default function AccountPage(){return <Account emailEnabled={process.env.EDUCATION_EMAIL_AUTH_READY==='true'}/>}
