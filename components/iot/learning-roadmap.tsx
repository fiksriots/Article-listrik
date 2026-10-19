import Link from 'next/link';
import {iotGroups} from '@/lib/iot-course';
export default function LearningRoadmap(){
 return <section id="alur-belajar" className="iot-roadmap" aria-labelledby="iot-roadmap-title">
  <p className="net-eyebrow">MULAI DARI MANA?</p>
  <h2 id="iot-roadmap-title">Pahami alurnya, lalu pilih titik mulai.</h2>
  <p>Jika baru belajar, mulai dari konsep dan lanjutkan dasar rangkaian serta pemrograman. Materi bertanda pilihan dapat dipelajari sesuai perangkat dan tujuan proyek.</p>
  <div className="iot-start-options">
   <Link href="/iot/apa-itu-iot"><small>BARU MULAI</small><strong>Kenali IoT dari nol</strong><span>Kelompok 01 → perangkat → pemrograman dan sensor.</span></Link>
   <a href="#kelompok-arduino-a"><small>MEMAKAI ARDUINO UNO</small><strong>Ikuti Arduino A–D</strong><span>Kelompok 03–06. Wi-Fi memakai modul ESP8266 AT.</span></a>
   <a href="#kelompok-esp32"><small>SUDAH PAHAM DASAR</small><strong>Lanjut ke ESP32</strong><span>Kelompok 07 → MQTT → Firebase. Ulangi dasar bila belum siap.</span></a>
  </div>
  <h3>Bagaimana sistem IoT bekerja?</h3>
  <ol className="iot-system-flow">
   <li><strong>1. Sensor</strong><span>Membaca keadaan nyata.</span></li>
   <li><strong>2. Perangkat</strong><span>Memeriksa data dan menjalankan aturan lokal.</span></li>
   <li><strong>3. Komunikasi</strong><span>MQTT mengirim pesan melalui broker.</span></li>
   <li><strong>4. Penyimpanan</strong><span>Program penghubung menulis ke Firebase.</span></li>
   <li><strong>5. Aplikasi</strong><span>Menampilkan data; perintah memakai jalur balik dan balasan.</span></li>
  </ol>
  <details className="iot-roadmap-details"><summary>Lihat peta {iotGroups.length} kelompok dan tujuan belajarnya</summary>
   <ol className="iot-roadmap-list">{iotGroups.map((group,n)=><li key={group.id}><a href={'#kelompok-'+group.id}><small>{String(n+1).padStart(2,'0')} · {group.kind}</small><strong>{group.title}</strong><span>{group.goal}</span></a></li>)}</ol>
  </details>
 </section>;
}
