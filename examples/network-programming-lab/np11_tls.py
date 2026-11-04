import ssl

def konteks_tls():
    context = ssl.create_default_context()
    context.minimum_version = ssl.TLSVersion.TLSv1_2
    return context

if __name__ == '__main__':
    context = konteks_tls()
    print('Verifikasi sertifikat:', context.verify_mode == ssl.CERT_REQUIRED)
    print('Pemeriksaan hostname:', context.check_hostname)
    print('Minimum TLS 1.2:', context.minimum_version == ssl.TLSVersion.TLSv1_2)
    print('Demo konfigurasi; belum melakukan handshake TLS')
# Saat koneksi HTTPS ke layanan milik sendiri, berikan context ini ke urlopen.
# Gunakan nama domain yang cocok dengan sertifikat, serta timeout.
