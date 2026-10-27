'use client';
import Link from 'next/link';
import {signIn, signOut, useSession} from 'next-auth/react';
import {useEffect, useState} from 'react';
import {useProgressSync} from './provider';

export default function Account({configured=false}: {configured?: boolean}) {
  const {data: session, status} = useSession();
  const {status:progressStatus,sync}=useProgressSync();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => {
    const error = new URL(window.location.href).searchParams.get('error');
    if (error) setMessage(error === 'AccessDenied' ? 'Akses Google dibatalkan atau email belum terverifikasi. Silakan coba lagi.' : 'Belum berhasil masuk dengan Google. Silakan coba lagi.');
  }, []);
  async function login() {
    setBusy(true); setMessage('');
    try {await signIn('google', {redirectTo: '/akun'});}
    catch {setMessage('Tidak dapat menghubungi layanan login. Periksa koneksi lalu coba lagi.'); setBusy(false);}
  }
  async function logout() {
    setBusy(true); setMessage('');
    try {await signOut({redirect: false});}
    catch {setMessage('Belum berhasil keluar. Silakan coba lagi.');}
    finally {setBusy(false);}
  }
  const initial=(session?.user?.name || session?.user?.email || 'F').trim().charAt(0).toUpperCase();
  return <main id="konten" className="account-main">
    <Link href="/" className="account-back"><span aria-hidden="true">←</span> Ruang Belajar</Link>
    <header className="account-heading"><p className="account-eyebrow">AKUN BELAJAR</p><h1>Simpan langkah <em>belajarmu.</em></h1><p>Masuk dengan Google untuk melanjutkan progres di perangkat lain.</p></header>
    <div className="account-layout"><section className="account-panel" aria-label="Akun belajar" aria-busy={status==='loading'||busy}>
      {status === 'loading' ? <div className="account-loading" role="status"><span className="account-spinner" aria-hidden="true"/>Memeriksa sesi akun…</div> : session ? <>
        <div className="account-profile"><span className="account-avatar" aria-hidden="true">{initial}</span><div><span className="account-badge">AKUN TERHUBUNG</span><h2>{session.user?.name || 'Akun belajarmu'}</h2><p className="account-email">{session.user?.email}</p></div></div>
        <div className="account-sync" role="status"><span className="account-status-dot" aria-hidden="true"/><p>{progressStatus}</p></div>
        <div className="account-actions"><Link className="account-continue" href="/">Lanjut belajar <span aria-hidden="true">→</span></Link><button type="button" className="account-secondary" disabled={busy} onClick={sync}>Sinkronkan progres</button></div>
        <button type="button" className="account-signout" disabled={busy} onClick={logout}>{busy ? 'Memproses…' : 'Keluar dari perangkat ini'}</button>
      </> : <><span className="account-card-symbol" aria-hidden="true">F<span>.</span></span><h2>Selamat datang di Fiks.</h2><p className="account-intro">Satu akun untuk menyimpan progres Listrik, Jaringan, dan IoT.</p>
        <div className="account-actions"><button type="button" className="account-google" disabled={!configured || busy} onClick={login}>
          <svg aria-hidden="true" viewBox="0 0 48 48" width="20" height="20"><path fill="#4285F4" d="M43.6 24.5c0-1.5-.1-3-.4-4.5H24v8.5h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.9 6.1-15.3Z"/><path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5.1c-1.8 1.2-4.1 1.9-6.9 1.9-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3A20.4 20.4 0 0 0 24 44Z"/><path fill="#FBBC05" d="M12.6 27.5a12 12 0 0 1 0-7V15H5.8a20.4 20.4 0 0 0 0 18l6.8-5.5Z"/><path fill="#EA4335" d="M24 12.1c3 0 5.6 1 7.7 3l5.8-5.8A19.6 19.6 0 0 0 24 4 20.4 20.4 0 0 0 5.8 15l6.8 5.5C14.2 15.7 18.7 12.1 24 12.1Z"/></svg>
          {busy ? 'Menghubungkan ke Google…' : 'Masuk dengan Google'}</button><Link className="account-guest" href="/">Belajar tanpa akun <span aria-hidden="true">→</span></Link></div>
        <p className="account-reassurance">Tidak perlu membuat kata sandi baru.</p>
        {!configured && <p role="status" className="account-small">Login Google sedang disiapkan. Kamu tetap dapat membaca materi dan menandai progres tanpa akun.</p>}
      </>}
      {message && <p role="alert" className="account-message">{message}</p>}
    </section><aside className="account-about"><p className="account-eyebrow">BELAJAR DENGAN TENANG</p><h2>Mulai di sini.<br/>{' '}Lanjut di mana saja.</h2><ul className="account-benefits"><li><span aria-hidden="true">01</span><div><strong>Progres mengikuti akun</strong><p>Buka perangkat lain dan lanjutkan dengan akun Google yang sama.</p></div></li><li><span aria-hidden="true">02</span><div><strong>Centang yang lama tetap berarti</strong><p>Progres tanpa akun digabungkan saat pertama kali tersinkron.</p></div></li><li><span aria-hidden="true">03</span><div><strong>Semua materi tetap gratis</strong><p>Kamu juga bisa belajar tanpa masuk. Progres tersimpan di browser.</p></div></li></ul><p className="account-footnote">Saat offline, perubahan disimpan sementara. Progres akun dan tanpa akun dipisahkan.</p></aside></div>
  </main>;
}
