export type AuthAction='signin'|'signup'|'forgot'|'recovery'|'resend';
export function authErrorMessage(error:{code?:string;status?:number;name?:string},action:AuthAction){
 if(error.code==='email_not_confirmed')return 'Email belum dikonfirmasi. Buka email pendaftaran dan konfirmasikan sebelum masuk.';
 if(error.code==='invalid_credentials')return 'Email atau kata sandi tidak cocok. Periksa kembali, termasuk huruf besar dan kecil pada kata sandi.';
 if(error.status===429||['over_email_send_rate_limit','over_request_rate_limit','email_send_rate_limit_exceeded'].includes(error.code||''))return 'Permintaan terlalu sering. Tunggu beberapa menit sebelum mencoba lagi.';
 if(error.code==='signup_disabled')return 'Pendaftaran akun belum dibuka. Kamu tetap dapat belajar tanpa akun.';
 if(error.code==='email_address_not_authorized'||error.code==='email_address_not_allowed')return 'Layanan belum dapat mengirim email ke alamat ini. Pengelola perlu menyiapkan pengiriman email akun.';
 if(error.code==='weak_password')return 'Kata sandi belum cukup kuat. Gunakan minimal 10 karakter dan gabungkan beberapa kata yang unik.';
 if(error.code==='user_already_exists')return 'Alamat ini sudah terdaftar. Gunakan menu Masuk atau pulihkan kata sandi.';
 if(error.code==='same_password')return 'Gunakan kata sandi baru yang berbeda dari kata sandi sebelumnya.';
 if(error.name==='AuthRetryableFetchError'||error.name==='TimeoutError'||error.name==='AbortError')return 'Layanan akun tidak merespons. Periksa koneksi lalu coba lagi.';
 return action==='signin'?'Belum berhasil masuk. Coba lagi beberapa saat.':'Permintaan akun belum berhasil. Coba lagi beberapa saat.';
}
export async function accountFetch(input:RequestInfo|URL,init?:RequestInit){
 // Bound network waits without leaving an in-flight request after the UI retries.
 const controller=new AbortController();
 const abort=()=>controller.abort(init?.signal?.reason);
 if(init?.signal?.aborted)abort();else init?.signal?.addEventListener('abort',abort,{once:true});
 const timer=setTimeout(()=>controller.abort(new DOMException('Account request timed out','TimeoutError')),15000);
 try{return await fetch(input,{...init,signal:controller.signal});}
 finally{clearTimeout(timer);init?.signal?.removeEventListener('abort',abort);}
}
