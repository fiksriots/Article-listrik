const tables: Record<string, string[][]> = {
  "memilih-komponen-ac-dc": [
    [
      "Router 12V DC",
      "Adaptor",
      "Cocokkan tegangan, polaritas, konektor, dan kapasitas arus",
      "Adaptor 19V bukan pengganti hanya karena colokannya sama"
    ],
    [
      "LED 5V DC",
      "Pembatas arus",
      "Periksa Vf dan arus sasaran, lalu nilai serta daya resistor",
      "LED langsung ke sumber bisa rusak"
    ],
    [
      "Motor AC",
      "Kendali dan proteksi motor",
      "Periksa data motor, arus awal, kategori kontaktor, serta koordinasi proteksi",
      "Kontaktor saja belum melindungi dari overload"
    ],
    [
      "Cabang baterai",
      "Pengaman DC",
      "Periksa tegangan, arus gangguan, rating DC, serta kondisi pemasangan",
      "Pemutus khusus AC tidak otomatis cocok"
    ],
    [
      "Koil relay DC",
      "Driver dan peredam",
      "Periksa arus koil, tegangan kendali, dan penanganan energi induktif",
      "Pin mikrokontroler belum tentu mampu memasok koil langsung"
    ]
  ],
  "komponen-dc-penggunaan": [
    [
      "Resistor",
      "Membatasi arus atau membagi tegangan",
      "LED sederhana, bias, dan pengukuran tertentu",
      "Periksa nilai Ω serta disipasi daya"
    ],
    [
      "Kapasitor",
      "Menyimpan energi dan membantu penyaringan",
      "Decoupling suplai atau mengurangi ripple sesuai desain",
      "Periksa tegangan, polaritas, ripple current, dan energi tersimpan"
    ],
    [
      "Dioda",
      "Menghantarkan terutama satu arah",
      "Penyearahan, proteksi tertentu, flyback koil DC",
      "Periksa arus, tegangan balik, kecepatan, dan panas"
    ],
    [
      "Transistor / MOSFET",
      "Mengendalikan jalur arus",
      "Driver LED, relay, atau motor DC yang sesuai",
      "Pin, tegangan kendali, rating, dan termal penting"
    ],
    [
      "Converter DC-DC",
      "Mengubah level tegangan DC",
      "Menyesuaikan 12V menjadi 5V atau aplikasi lain",
      "Batas arus keluaran, efisiensi, dan isolasi bergantung model"
    ],
    [
      "Sekering / pemutus DC",
      "Proteksi arus sesuai rating DC",
      "Cabang baterai atau beban DC dalam rancangan yang benar",
      "Perlu kemampuan pemutusan dan tegangan DC yang cukup"
    ],
    [
      "BMS",
      "Mengawasi dan melindungi paket baterai sesuai fungsinya",
      "Paket sel yang membutuhkan sistem pengelolaan",
      "Bukan otomatis charger; jumlah sel dan kimia harus cocok"
    ],
    [
      "Konektor / saklar DC",
      "Menyambung atau memutus jalur",
      "Sambungan layanan dan kontrol beban DC",
      "Cocokkan polaritas dan rating pensaklaran DC"
    ]
  ],
  "komponen-ac-penggunaan": [
    [
      "Saklar / isolator",
      "Mengendalikan atau mengisolasi sesuai fungsi dan rating",
      "Saat memerlukan ON/OFF atau pemisahan sumber terencana",
      "Saklar biasa tidak selalu layak sebagai isolator keselamatan"
    ],
    [
      "MCB / MCCB",
      "Memutus arus lebih dan hubung singkat sesuai karakteristik",
      "Pada sirkuit yang perlu proteksi arus",
      "Rating, kurva, kemampuan pemutusan, dan koordinasi harus sesuai"
    ],
    [
      "RCCB / RCBO",
      "Mendeteksi arus sisa; RCBO juga memiliki proteksi arus lebih",
      "Saat rancangan memerlukan perlindungan arus sisa",
      "RCCB sendiri tidak menggantikan proteksi arus lebih; jenis RCD harus cocok"
    ],
    [
      "SPD",
      "Membatasi surja tegangan transien",
      "Pada rancangan proteksi surja yang terkoordinasi",
      "Bukan pengatur tegangan untuk overvoltage terus-menerus"
    ],
    [
      "Kontaktor",
      "Pensaklaran beban melalui koil kontrol",
      "Motor, pemanas, atau beban lain sesuai kategori penggunaan",
      "Tidak otomatis menyediakan proteksi overload"
    ],
    [
      "Trafo",
      "Menyesuaikan tegangan AC lewat induksi",
      "Distribusi tenaga atau suplai kontrol tertentu",
      "Tidak semua trafo memberi isolasi; autotrafo berbeda"
    ],
    [
      "Kapasitor motor",
      "Membantu karakter starting/running motor tertentu",
      "Hanya pada motor yang memang membutuhkan jenis ini",
      "Nilai, jenis start/run, tegangan AC, dan duty mengikuti spesifikasi"
    ],
    [
      "Terminal / bar N / bar PE",
      "Titik sambung, distribusi netral, atau proteksi",
      "Untuk sambungan yang tertata sesuai desain",
      "N dan PE tidak boleh digabung sembarangan"
    ]
  ],
  "penyearah-regulator": [
    [
      "Jembatan dioda",
      "Penyearahan AC menjadi satu polaritas",
      "Tahap penyearah dalam catu daya yang dirancang",
      "Tidak otomatis menurunkan tegangan, memberi isolasi, atau regulasi"
    ],
    [
      "Regulator linear / LDO",
      "Menurunkan dan mengatur tegangan DC",
      "Beban sesuai batas termal dan kebutuhan noise",
      "Selisih tegangan berubah menjadi panas; butuh headroom"
    ],
    [
      "Buck",
      "Menurunkan tegangan DC",
      "Contoh suplai 12V ke 5V yang kompatibel",
      "Batas input, arus, ripple, dan termal tetap diperiksa"
    ],
    [
      "Boost",
      "Menaikkan tegangan DC",
      "Saat keluaran lebih tinggi daripada sumber",
      "Arus masukan dapat lebih besar; bukan menambah energi gratis"
    ],
    [
      "Buck-boost",
      "Menaikkan atau menurunkan menurut topologi",
      "Saat sumber dapat berada di atas maupun di bawah keluaran",
      "Polaritas dan konfigurasi berbeda menurut jenis"
    ],
    [
      "Inverter",
      "Menghasilkan AC dari DC",
      "UPS atau sistem energi dengan desain sesuai",
      "Bentuk gelombang, daya, isolasi, dan pengaman tidak sama pada semua model"
    ]
  ],
  "proteksi-motor": [
    [
      "Kontaktor",
      "Menyambung dan memutus sesuai perintah kontrol",
      "Operasi start/stop berulang sesuai kategori beban",
      "Bukan pengaman overload otomatis"
    ],
    [
      "Overload relay",
      "Mendeteksi kondisi overload menurut model termal/elektronik",
      "Proteksi motor yang terkoordinasi dengan kontaktor",
      "Umumnya memberi perintah trip kontrol; tidak menggantikan proteksi korsleting"
    ],
    [
      "Pemutus proteksi motor / proteksi korsleting",
      "Memutus gangguan sesuai fungsi perangkat",
      "Ketika rancangan memerlukan proteksi arus yang tepat",
      "Fungsi gabungan dan pengaturannya bergantung model"
    ],
    [
      "Pemantau phase / sensor suhu",
      "Mengawasi phase atau temperatur sesuai perangkat",
      "Saat motor dan proses membutuhkan pemantauan tambahan",
      "Tidak semua overload memiliki semua fungsi ini"
    ]
  ]
};
export function ComponentTable({type}:{type:string}) {
  const rows = tables[type];
  if (!rows) throw new Error("Unknown component reference: " + type);
  return <><p className="text-sm text-teal-700 sm:hidden">↔ Geser tabel ke samping untuk melihat kapan digunakan dan catatannya.</p><div className="component-reference" tabIndex={0} role="region" aria-label="Tabel fungsi dan penggunaan komponen, dapat digeser mendatar"><table>
    <thead><tr>{['Komponen','Fungsi','Kapan digunakan','Yang diperhatikan'].map(x=><th key={x} scope="col">{x}</th>)}</tr></thead>
    <tbody>{rows.map(row=><tr key={row[0]}><th scope="row">{row[0]}</th>{row.slice(1).map((cell,i)=><td key={i}>{cell}</td>)}</tr>)}</tbody>
  </table></div></>;
}
export function ConversionGuide() {
  const parts=[{a:'AC',b:'DC berdenyut',name:'Penyearah'},{a:'DC tinggi',b:'DC rendah',name:'Buck'},{a:'DC rendah',b:'DC tinggi',name:'Boost'},{a:'DC',b:'AC',name:'Inverter'}];
  return <figure className="article-illustration"><svg viewBox="0 0 640 320" role="img" aria-label="Empat alur konversi: penyearah AC ke DC berdenyut, buck menurunkan DC, boost menaikkan DC, inverter DC ke AC" className="w-full">{parts.map((p,i)=><g key={p.name}>
    <rect x="10" y={12+i*76} width="160" height="54" rx="9" fill="#dbeafe"/><text x="90" y={45+i*76} textAnchor="middle" fill="#1e3a8a" fontSize="17">{p.a}</text>
    <path d={'M175 '+(39+i*76)+' H224 l-7 -6 m7 6 l-7 6 M416 '+(39+i*76)+' H465 l-7 -6 m7 6 l-7 6'} fill="none" stroke="#0f766e" strokeWidth="3"/>
    <rect x="230" y={12+i*76} width="180" height="54" rx="9" fill="#ccfbf1"/><text x="320" y={45+i*76} textAnchor="middle" fill="#115e59" fontSize="17">{p.name}</text>
    <rect x="470" y={12+i*76} width="160" height="54" rx="9" fill="#dbeafe"/><text x="550" y={45+i*76} textAnchor="middle" fill="#1e3a8a" fontSize="17">{p.b}</text>
  </g>)}</svg><figcaption>Alur fungsi dasar. Tegangan, isolasi, proteksi, dan kualitas keluaran mengikuti desain converter.</figcaption></figure>;
}
