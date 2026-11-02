export function ringkasan(nama, jumlah) {
  const bersih = nama.trim();
  if (!bersih || bersih.length > 80 || !Number.isInteger(jumlah) || jumlah < 1 || jumlah > 100) {
    throw new Error('Nama 1–80 karakter dan jumlah 1–100 diperlukan.');
  }
  return `${bersih}: ${jumlah} unit`;
}
