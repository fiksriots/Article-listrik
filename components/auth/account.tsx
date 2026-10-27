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
  return <main id="konten" className="account-main">
    <Link href="/" className="account-back">← Ruang Belajar</Link>
    <header><p className="hub-eyebrow">AKUN BELAJAR / OPSIONAL</p><h1>Belajar bersama.<br/><em>Masuk dengan Google.</em></h1><p>Gunakan akun Google untuk masuk. Tidak perlu membuat kata sandi baru. Semua materi tetap terbuka tanpa login.</p></header>
    <div className="account-layout"><section className="account-panel" aria-label="Akun belajar">
      {status === 'loading' ? <p role="status">Memeriksa sesi akun…</p> : session ? <>
        <span className="account-badge">SUDAH MASUK</span><h2>{session.user?.name || 'Akun belajarmu'}</h2><p className="account-email">{session.user?.email}</p>
        <p className="account-sync" role="status">{progressStatus}</p><button className="account-secondary" onClick={sync}>Sinkronkan progres</button>
        <button className="account-submit" disabled={busy} onClick={logout}>{busy ? 'Memproses…' : 'Keluar dari perangkat ini'}</button>
      </> : <><h2>Satu langkah untuk masuk</h2><p>Pilih akun Google yang ingin digunakan untuk belajar.</p>
        <button className="account-submit" disabled={!configured || busy} onClick={login}>{busy ? 'Menghubungkan ke Google…' : 'Masuk dengan Google'}</button>
        {!configured && <p role="status" className="account-small">Login Google sedang disiapkan. Kamu tetap dapat membaca materi dan menandai progres tanpa akun.</p>}
      </>}
      <p role="status" className="account-message">{message}</p><Link className="account-link" href="/">Lanjut belajar →</Link>
    </section><aside className="account-about"><h2>Belajar tetap bisa tanpa akun.</h2><p>Saat pertama masuk, tanda sudah dibaca tanpa akun digabungkan ke akun Google setelah sinkronisasi berhasil.</p><p>Masuk dengan akun Google yang sama di perangkat lain untuk memuat progres yang sudah tersinkron. Saat offline, perubahan disimpan sementara di browser. Progres akun dan tanpa akun dipisahkan.</p></aside></div>
  </main>;
}
