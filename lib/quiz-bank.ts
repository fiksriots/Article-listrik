export type Question = { q: string; o: string[]; a: number; why: string };
export const quizBank: Record<string, Question[]> = {
  "apa-itu-listrik": [
    {
      "q": "Apa yang diubah lampu menjadi cahaya dan panas?",
      "o": [
        "Energi listrik",
        "Elektron menjadi habis",
        "Isolasi kabel"
      ],
      "a": 0,
      "why": "Lampu mengubah energi; muatan tetap mengalir dalam jalur tertutup."
    },
    {
      "q": "Arus listrik adalah...",
      "o": [
        "Laju aliran muatan",
        "Jumlah warna kabel",
        "Suhu baterai"
      ],
      "a": 0,
      "why": "Arus menyatakan muatan per satuan waktu."
    }
  ],
  "volt-ampere-ohm": [
    {
      "q": "Lampu 10W menyala 5 jam. Energinya?",
      "o": [
        "50 kWh",
        "0,05 kWh",
        "2 kWh"
      ],
      "a": 1,
      "why": "10 × 5 / 1000 = 0,05 kWh."
    },
    {
      "q": "500mA sama dengan...",
      "o": [
        "500A",
        "0,5A",
        "5A"
      ],
      "a": 1,
      "why": "1000mA = 1A."
    }
  ],
  "konduktor-isolator-rangkaian": [
    {
      "q": "Saklar terbuka pada rangkaian sederhana menyebabkan...",
      "o": [
        "Arus bertambah",
        "Jalur arus terputus",
        "Hambatan menjadi nol"
      ],
      "a": 1,
      "why": "Kontak yang terbuka memutus jalur tertutup."
    },
    {
      "q": "Bahan penghantar umum pada kabel adalah...",
      "o": [
        "Tembaga",
        "Karet",
        "Plastik"
      ],
      "a": 0,
      "why": "Tembaga menghantarkan listrik; isolasi membungkusnya."
    }
  ],
  "ac-dc-sumber-listrik": [
    {
      "q": "Frekuensi 50Hz memiliki periode...",
      "o": [
        "50 detik",
        "20 milidetik",
        "2 detik"
      ],
      "a": 1,
      "why": "T = 1/50 = 0,02 detik = 20ms."
    },
    {
      "q": "Polaritas DC ideal...",
      "o": [
        "Tetap",
        "Berganti tiap setengah siklus",
        "Selalu tiga fase"
      ],
      "a": 0,
      "why": "DC ideal memiliki polaritas tetap."
    }
  ],
  "hukum-ohm-daya": [
    {
      "q": "12V pada resistor 6Ω menghasilkan arus...",
      "o": [
        "0,5A",
        "2A",
        "72A"
      ],
      "a": 1,
      "why": "I = V/R = 12/6 = 2A."
    },
    {
      "q": "12V dan 2A menghasilkan daya DC...",
      "o": [
        "6W",
        "24W",
        "14W"
      ],
      "a": 1,
      "why": "P = VI = 12 × 2 = 24W."
    }
  ],
  "rangkaian-seri-paralel": [
    {
      "q": "Cabang paralel terhubung pada dua simpul sama memiliki...",
      "o": [
        "Tegangan sama",
        "Arus selalu sama",
        "Hambatan selalu sama"
      ],
      "a": 0,
      "why": "Arus cabang bergantung hambatan, tetapi beda potensial pada simpul yang sama tetap sama."
    },
    {
      "q": "4Ω dan 6Ω diseri menghasilkan...",
      "o": [
        "10Ω",
        "2Ω",
        "24Ω"
      ],
      "a": 0,
      "why": "Hambatan seri dijumlahkan."
    }
  ],
  "multimeter": [
    {
      "q": "Mode arus dipasang langsung antara dua kutub sumber berisiko...",
      "o": [
        "Mengukur tegangan dengan tepat",
        "Hubung singkat",
        "Menambah isolasi"
      ],
      "a": 1,
      "why": "Jalur ukur arus berhambatan rendah dan dapat membuat hubung singkat."
    },
    {
      "q": "Hambatan diukur saat rangkaian...",
      "o": [
        "Masih menyala",
        "Bebas tegangan dan energi tersimpan aman",
        "Terhubung PLN"
      ],
      "a": 1,
      "why": "Pengukuran Ω tidak dilakukan pada rangkaian bertegangan."
    }
  ],
  "keselamatan-dc": [
    {
      "q": "Mengapa LED latihan membutuhkan resistor?",
      "o": [
        "Agar membatasi arus",
        "Agar mengubahnya menjadi AC",
        "Agar baterai korslet"
      ],
      "a": 0,
      "why": "LED memerlukan pembatas arus untuk mencegah arus berlebih."
    },
    {
      "q": "Baterai besar tegangan rendah...",
      "o": [
        "Selalu aman dikorslet",
        "Tetap bisa berbahaya saat korslet",
        "Tidak menyimpan energi"
      ],
      "a": 1,
      "why": "Arus hubung singkat besar dapat menyebabkan panas dan kebakaran."
    }
  ],
  "komponen-pasif-led": [
    {
      "q": "Kapasitor menyimpan energi dalam...",
      "o": [
        "Medan listrik",
        "Gerak mekanik",
        "Gelang warna"
      ],
      "a": 0,
      "why": "Energi tersimpan pada medan listrik di antara penghantarnya."
    },
    {
      "q": "Resistor membatasi...",
      "o": [
        "Arus",
        "Frekuensi PLN selalu",
        "Nomor pin"
      ],
      "a": 0,
      "why": "Hambatan membatasi arus pada kondisi tegangan tertentu."
    }
  ],
  "dioda-transistor-ic": [
    {
      "q": "Dua transistor dengan bentuk sama pasti memiliki kaki sama?",
      "o": [
        "Ya",
        "Tidak",
        "Hanya jika warnanya sama"
      ],
      "a": 1,
      "why": "Urutan kaki dan rating harus diperiksa pada datasheet."
    },
    {
      "q": "VGS(th) MOSFET berarti...",
      "o": [
        "Sudah ON penuh",
        "Ambang mulai menghantar pada kondisi uji",
        "Daya maksimum"
      ],
      "a": 1,
      "why": "Lihat RDS(on) pada tegangan gerbang yang sesuai untuk ON."
    }
  ],
  "power-supply-baterai": [
    {
      "q": "Label arus 2A pada adaptor menunjukkan...",
      "o": [
        "Arus selalu dipaksa 2A",
        "Batas kemampuan suplai",
        "Tegangan 2V"
      ],
      "a": 1,
      "why": "Beban menarik arus sesuai kebutuhannya selama suplai bekerja dalam batasnya."
    },
    {
      "q": "12V × 7Ah memberi energi nominal...",
      "o": [
        "84Wh",
        "84W selalu",
        "0,58Wh"
      ],
      "a": 0,
      "why": "Wh ≈ tegangan nominal × kapasitas Ah."
    }
  ],
  "sensor-relay-iot": [
    {
      "q": "Histeresis membantu mencegah...",
      "o": [
        "Berkedip di dekat ambang",
        "Semua kerusakan hardware",
        "Kebutuhan sumber daya"
      ],
      "a": 0,
      "why": "Ambang ON dan OFF yang berbeda mencegah perubahan cepat di sekitar satu batas."
    },
    {
      "q": "Sensor adalah bagian...",
      "o": [
        "Input",
        "Output daya motor",
        "Pengaman semua gangguan"
      ],
      "a": 0,
      "why": "Sensor memberi informasi kepada kontroler."
    }
  ],
  "pembangkit-trafo": [
    {
      "q": "Untuk daya sama, tegangan transmisi naik membuat arus ideal...",
      "o": [
        "Naik",
        "Turun",
        "Selalu nol"
      ],
      "a": 1,
      "why": "P = VI pada model sederhana: arus berkurang ketika tegangan naik."
    },
    {
      "q": "Rugi panas resistor kabel mengikuti...",
      "o": [
        "I²R",
        "I/R",
        "R/I"
      ],
      "a": 0,
      "why": "Pada model resistif, Ploss = I²R."
    }
  ],
  "satu-tiga-phase": [
    {
      "q": "Selisih sudut tiga fase seimbang adalah...",
      "o": [
        "90°",
        "120°",
        "180°"
      ],
      "a": 1,
      "why": "Tiga gelombang tersebar merata dalam 360°: 360/3 = 120°."
    },
    {
      "q": "230V phase-netral pada bintang seimbang berarti antarphase sekitar...",
      "o": [
        "230V",
        "398V",
        "690V"
      ],
      "a": 1,
      "why": "VLL = √3 × VLN."
    }
  ],
  "netral-grounding-proteksi": [
    {
      "q": "Penghantar PE dipakai sebagai...",
      "o": [
        "Jalur arus kerja normal",
        "Penghantar proteksi",
        "Pengganti semua pengaman"
      ],
      "a": 1,
      "why": "PE tidak dirancang menjadi jalur arus kerja normal."
    },
    {
      "q": "SPD terutama membatasi...",
      "o": [
        "Surja transien",
        "Semua overload",
        "Gangguan internet"
      ],
      "a": 0,
      "why": "Surja singkat berbeda dari kenaikan tegangan berkepanjangan."
    }
  ],
  "panel-kabel-beban": [
    {
      "q": "Pemilihan kabel perlu mempertimbangkan...",
      "o": [
        "Daya brosur saja",
        "Panjang, suhu, pemasangan, dan pengaman",
        "Warna bodi alat saja"
      ],
      "a": 1,
      "why": "Kemampuan hantar arus dan jatuh tegangan bergantung kondisi pemasangan."
    },
    {
      "q": "Diagram satu garis menunjukkan...",
      "o": [
        "Hubungan distribusi secara sederhana",
        "Semua terminal fisik lengkap",
        "Warna cat panel"
      ],
      "a": 0,
      "why": "Pengawatan terminal memerlukan dokumen lain yang sesuai."
    }
  ],
  "motor-elektromagnet": [
    {
      "q": "Motor mengubah energi listrik menjadi...",
      "o": [
        "Energi mekanik",
        "Hanya energi kimia",
        "Muatan baru"
      ],
      "a": 0,
      "why": "Poros memberikan keluaran mekanik; sebagian energi menjadi rugi panas."
    },
    {
      "q": "Bagian diam motor disebut...",
      "o": [
        "Rotor",
        "Stator",
        "Poros"
      ],
      "a": 1,
      "why": "Stator diam, rotor berputar."
    }
  ],
  "kontaktor-relay-panel": [
    {
      "q": "Kontak NO ketika koil tidak diaktifkan umumnya...",
      "o": [
        "Terbuka",
        "Tertutup",
        "Terhubung ke PE"
      ],
      "a": 0,
      "why": "Normally open berarti terbuka dalam keadaan normal tidak diaktifkan."
    },
    {
      "q": "Kontaktor otomatis memberi proteksi overload motor?",
      "o": [
        "Tidak",
        "Ya selalu",
        "Hanya jika besar"
      ],
      "a": 0,
      "why": "Perlu proteksi motor sesuai rancangan."
    }
  ],
  "vfd-plc": [
    {
      "q": "Motor 4 kutub pada 50Hz memiliki kecepatan sinkron...",
      "o": [
        "1500 rpm",
        "200 rpm",
        "6000 rpm"
      ],
      "a": 0,
      "why": "ns = 120f/p = 120 × 50 / 4 = 1500 rpm."
    },
    {
      "q": "VFD mengatur kecepatan motor AC tertentu melalui...",
      "o": [
        "Frekuensi dan tegangan keluaran",
        "Warna kabel",
        "Kapasitas browser"
      ],
      "a": 0,
      "why": "Metode kendali dan batas operasi mengikuti motor dan drive."
    }
  ],
  "ups-genset-ats": [
    {
      "q": "ATS berfungsi terutama untuk...",
      "o": [
        "Memindahkan sumber suplai",
        "Menyimpan energi kimia",
        "Mengukur hambatan LED"
      ],
      "a": 0,
      "why": "ATS mengatur perpindahan antar sumber sesuai rancangan."
    },
    {
      "q": "Angka VA UPS langsung menunjukkan runtime?",
      "o": [
        "Ya",
        "Tidak",
        "Selalu 1 jam"
      ],
      "a": 1,
      "why": "Runtime juga memerlukan energi baterai dan daya beban."
    }
  ],
  "membaca-skema": [
    {
      "q": "Persilangan garis pada skema selalu tersambung?",
      "o": [
        "Ya",
        "Tidak, periksa titik dan legenda",
        "Hanya jika garisnya panjang"
      ],
      "a": 1,
      "why": "Konvensi sambungan harus dibaca dari simbol dan legenda."
    },
    {
      "q": "Layout berbeda dari skema karena menunjukkan...",
      "o": [
        "Posisi fisik",
        "Hukum listrik berbeda",
        "Energi baterai"
      ],
      "a": 0,
      "why": "Skema fokus pada hubungan, layout pada posisi."
    }
  ],
  "troubleshooting-power": [
    {
      "q": "Tegangan adaptor normal tanpa beban berarti pasti sehat?",
      "o": [
        "Pasti",
        "Belum tentu",
        "Berarti tidak perlu cek label"
      ],
      "a": 1,
      "why": "Kemampuan suplai di bawah beban juga menentukan operasi."
    },
    {
      "q": "Adaptor pengganti harus cocok...",
      "o": [
        "Konektor saja",
        "Tegangan, polaritas, konektor, dan kapasitas",
        "Warna saja"
      ],
      "a": 1,
      "why": "Kecocokan mekanik saja belum cukup."
    }
  ],
  "daya-cctv-server": [
    {
      "q": "Empat kamera 6W dan perekam 18W totalnya...",
      "o": [
        "24W",
        "42W",
        "108W"
      ],
      "a": 1,
      "why": "4 × 6 + 18 = 42W sebelum rugi dan cadangan."
    },
    {
      "q": "PoE switch perlu diperiksa...",
      "o": [
        "Anggaran total dan daya per port",
        "Jumlah lampu saja",
        "Warna konektor"
      ],
      "a": 0,
      "why": "Periksa juga standar dan kebutuhan tiap perangkat."
    }
  ],
  "simulasi-gangguan": [
    {
      "q": "MCB sering trip sebaiknya...",
      "o": [
        "Diganti lebih besar langsung",
        "Dicari penyebabnya oleh tenaga kompeten",
        "Direset terus tanpa pemeriksaan"
      ],
      "a": 1,
      "why": "Memperbesar pengaman tanpa evaluasi dapat menghilangkan perlindungan kabel."
    },
    {
      "q": "Lampu redup memastikan satu penyebab saja?",
      "o": [
        "Tidak",
        "Ya, pasti motor",
        "Ya, pasti MCB"
      ],
      "a": 0,
      "why": "Gejala perlu dianalisis bersama kondisi dan cakupan gangguan."
    }
  ],
  "mengenal-arus-kuat": [
    {
      "q": "Istilah arus kuat terutama menunjuk...",
      "o": [
        "Bidang tenaga listrik",
        "Semua arus di atas angka pasti",
        "Semua AC tanpa pengecualian"
      ],
      "a": 0,
      "why": "Istilahnya menggambarkan bidang penggunaan, bukan batas ampere yang universal."
    },
    {
      "q": "Dua beban dengan watt sama pasti mempunyai arus awal sama?",
      "o": [
        "Ya",
        "Tidak",
        "Hanya jika kabelnya sama"
      ],
      "a": 1,
      "why": "Jenis beban dan karakter starting dapat berbeda."
    }
  ],
  "komponen-ac-penggunaan": [
    {
      "q": "Perangkat yang membatasi surja transien adalah...",
      "o": [
        "SPD",
        "Kontaktor biasa",
        "Terminal N"
      ],
      "a": 0,
      "why": "SPD digunakan dalam rancangan proteksi surja."
    },
    {
      "q": "Rating koil dan kontak kontaktor...",
      "o": [
        "Selalu sama",
        "Perlu dibaca terpisah",
        "Hanya bergantung warna"
      ],
      "a": 1,
      "why": "Koil menggerakkan mekanisme, kontak menangani beban."
    }
  ],
  "proteksi-motor": [
    {
      "q": "Overload relay biasa menggantikan proteksi korsleting?",
      "o": [
        "Tidak",
        "Ya selalu",
        "Jika motor besar"
      ],
      "a": 0,
      "why": "Proteksi overload dan korsleting memerlukan koordinasi."
    },
    {
      "q": "Arus saat motor mulai berputar...",
      "o": [
        "Selalu sama dengan nominal",
        "Bisa lebih tinggi daripada normal",
        "Pasti nol"
      ],
      "a": 1,
      "why": "Karakter starting mengikuti motor dan metode start."
    }
  ],
  "daya-ac-faktor-daya": [
    {
      "q": "230V × 5A menghasilkan daya semu...",
      "o": [
        "1.150VA",
        "920VA selalu",
        "46VA"
      ],
      "a": 0,
      "why": "S = Vrms × Irms pada satu phase."
    },
    {
      "q": "PF 0,8 pada daya semu 1.150VA memberikan daya aktif...",
      "o": [
        "1.150W",
        "920W",
        "230W"
      ],
      "a": 1,
      "why": "P = S × PF = 1.150 × 0,8 = 920W."
    }
  ],
  "komponen-dc-penggunaan": [
    {
      "q": "Dioda flyback pada aplikasi koil DC tertentu membantu...",
      "o": [
        "Menangani energi induktif saat dimatikan",
        "Menaikkan arus tanpa batas",
        "Mengganti semua pengaman"
      ],
      "a": 0,
      "why": "Energi koil memerlukan jalur pelepasan yang sesuai rancangan."
    },
    {
      "q": "BMS adalah...",
      "o": [
        "Charger universal",
        "Pengelola/proteksi paket baterai sesuai spesifikasi",
        "Pengganti semua sekering"
      ],
      "a": 1,
      "why": "BMS dan charger mempunyai tugas berbeda."
    }
  ],
  "penyearah-regulator": [
    {
      "q": "Converter untuk menurunkan 12V DC menjadi 5V DC adalah...",
      "o": [
        "Buck",
        "Boost",
        "Penyearah saja"
      ],
      "a": 0,
      "why": "Buck menurunkan level tegangan DC sesuai batasnya."
    },
    {
      "q": "Rugi linear dari 12V ke 5V pada 0,5A sekitar...",
      "o": [
        "2,5W",
        "3,5W",
        "0W"
      ],
      "a": 1,
      "why": "(12 − 5) × 0,5 = 3,5W, mengabaikan arus internal."
    }
  ],
  "kapasitor-induktor-ac-dc": [
    {
      "q": "Frekuensi naik membuat reaktansi kapasitor ideal...",
      "o": [
        "Turun",
        "Naik",
        "Selalu nol"
      ],
      "a": 0,
      "why": "XC berbanding terbalik dengan f."
    },
    {
      "q": "Kapasitor motor dan elektrolit biasa dengan µF sama...",
      "o": [
        "Pasti bisa saling mengganti",
        "Belum tentu kompatibel",
        "Hanya berbeda warna"
      ],
      "a": 1,
      "why": "Jenis, rating AC/DC, polaritas, dan duty harus cocok."
    }
  ],
  "memilih-komponen-ac-dc": [
    {
      "q": "Label 10A AC otomatis berlaku pada semua tegangan DC?",
      "o": [
        "Tidak",
        "Ya",
        "Jika mereknya sama"
      ],
      "a": 0,
      "why": "Rating jenis sumber dan kondisi beban harus diperiksa."
    },
    {
      "q": "Untuk adaptor pengganti, yang diperiksa adalah...",
      "o": [
        "Warna bodi",
        "Tegangan, polaritas, konektor, dan kapasitas",
        "Konektor saja"
      ],
      "a": 1,
      "why": "Kecocokan fisik saja tidak menjamin cocok secara listrik."
    }
  ],
  "saklar-no-nc": [
    {
      "q": "NO pada tombol berarti apa saat tidak ditekan?",
      "o": [
        "Kontak terbuka",
        "Kontak selalu rusak",
        "Kontak selalu menghantar"
      ],
      "a": 0,
      "why": "Normal mengacu pada keadaan aktuator belum ditekan."
    },
    {
      "q": "Push button sesaat setelah dilepas akan…",
      "o": [
        "Kembali ke posisi awal",
        "Selalu mengunci ON",
        "Mengubah tegangan sumber"
      ],
      "a": 0,
      "why": "Tombol sesaat kembali; fungsi menetap mempertahankan pilihan."
    }
  ],
  "sekering-proteksi-dc": [
    {
      "q": "Sekering dipilih hanya dari ampere beban?",
      "o": [
        "Tidak, periksa rating DC, kurva, kabel dan kemampuan pemutusan",
        "Ya, selalu sama",
        "Cukup dari warna"
      ],
      "a": 0,
      "why": "Arus nominal bukan satu-satunya syarat penggunaan aman."
    },
    {
      "q": "Sekering terus putus sebaiknya…",
      "o": [
        "Dicari penyebabnya sebelum penggantian sesuai desain",
        "Diganti kawat",
        "Selalu dinaikkan ratingnya"
      ],
      "a": 0,
      "why": "Menghilangkan fungsi pengaman dapat membahayakan kabel dan perangkat."
    }
  ],
  "terminal-sambungan-kabel": [
    {
      "q": "Ferrule cocok untuk semua terminal tanpa pemeriksaan?",
      "o": [
        "Tidak, ikuti spesifikasi terminal",
        "Ya, semua sama",
        "Hanya warna yang penting"
      ],
      "a": 0,
      "why": "Jenis penghantar dan kapasitas koneksi harus sesuai datasheet."
    },
    {
      "q": "Arus naik dua kali pada hambatan kontak tetap. Panasnya…",
      "o": [
        "Empat kali",
        "Dua kali",
        "Tetap"
      ],
      "a": 0,
      "why": "P = I²R, sehingga penggandaan arus menghasilkan empat kali daya panas."
    }
  ],
  "nameplate-motor": [
    {
      "q": "kW pada nameplate motor umumnya menyatakan…",
      "o": [
        "Daya poros nominal",
        "Konsumsi tetap setiap saat",
        "Tegangan koil"
      ],
      "a": 0,
      "why": "Daya masuk juga dipengaruhi efisiensi dan beban."
    },
    {
      "q": "Contoh pelat 230 V Δ / 400 V Y memasangkan 400 V dengan…",
      "o": [
        "Star",
        "Delta",
        "Sembarang hubungan"
      ],
      "a": 0,
      "why": "Pasangan tegangan dan hubungan pada pelat harus dibaca bersama."
    }
  ],
  "kontrol-start-stop": [
    {
      "q": "Kontak pengunci pada model dipasang…",
      "o": [
        "Paralel START",
        "Paralel STOP untuk melewatinya",
        "Menggantikan semua pengaman"
      ],
      "a": 0,
      "why": "Jalur alternatif START mempertahankan koil, STOP tetap memutus seri."
    },
    {
      "q": "Sesudah overload direset dalam model, motor…",
      "o": [
        "Menunggu START baru",
        "Otomatis harus berjalan",
        "Tidak perlu pengaman lagi"
      ],
      "a": 0,
      "why": "Reset mengizinkan kontrol kembali, bukan memberi perintah mulai."
    }
  ],
  "sensor-industri-sinyal": [
    {
      "q": "PNP pada contoh sensor DC aktif akan…",
      "o": [
        "Menyuplai arus menuju input",
        "Selalu menghasilkan sinyal analog",
        "Mengukur tegangan PLN"
      ],
      "a": 0,
      "why": "PNP adalah sourcing output; cocokkan dengan input dan common."
    },
    {
      "q": "Skala 0–10 bar = 4–20 mA. Nilai 12 mA adalah…",
      "o": [
        "5 bar",
        "12 bar",
        "0 bar"
      ],
      "a": 0,
      "why": "(12−4)/16 × 10 = 5 bar."
    }
  ],
  "star-delta-motor": [
    {
      "q": "Pada sumber 400 V, pelat mana kandidat starter star–delta?",
      "o": [
        "400 V Δ / 690 V Y, bila syarat lain terpenuhi",
        "230 V Δ / 400 V Y",
        "Semua motor enam terminal"
      ],
      "a": 0,
      "why": "Motor harus boleh berjalan delta pada tegangan sumber; jumlah terminal saja belum cukup."
    },
    {
      "q": "Mengapa kontaktor star dan delta perlu interlock?",
      "o": [
        "Mencegah keduanya aktif bersamaan",
        "Agar keduanya selalu ON",
        "Menggantikan semua proteksi"
      ],
      "a": 0,
      "why": "Aktif bersamaan dapat menimbulkan hubung singkat; interlock listrik dan mekanis diperlukan."
    },
    {
      "q": "Arus awal star kira-kira sepertiga dibanding apa?",
      "o": [
        "Arus start langsung delta pada motor dan sumber yang sama",
        "Arus nominal setiap motor",
        "Arus listrik seluruh gedung"
      ],
      "a": 0,
      "why": "Perbandingan ini terhadap start langsung delta, bukan terhadap arus nominal."
    }
  ],
  "membaca-label-perangkat": [
    {
      "q": "OUTPUT 12 V DC 1 A pada adaptor tegangan tetap berarti…",
      "o": [
        "Kapasitas keluaran sampai 1 A pada 12 V sesuai spesifikasi",
        "Selalu memaksa beban menarik 1 A",
        "Masukan harus 12 V AC"
      ],
      "a": 0,
      "why": "Kapasitas arus sumber bukan arus yang selalu ditarik beban. Periksa juga polaritas dan konektor."
    },
    {
      "q": "IP rating terutama menjelaskan…",
      "o": [
        "Perlindungan enclosure sesuai pengujian benda padat/akses dan air",
        "Jaminan kebal petir",
        "Energi per bulan"
      ],
      "a": 0,
      "why": "IP tidak menjamin perlindungan terhadap semua kondisi lingkungan atau gangguan listrik."
    }
  ],
  "jenis-gangguan-listrik": [
    {
      "q": "Kontak longgar bisa panas ketika MCB belum trip karena…",
      "o": [
        "Hambatan lokal menimbulkan panas pada arus di bawah ambang trip",
        "MCB membaca suhu setiap terminal",
        "Arus selalu nol"
      ],
      "a": 0,
      "why": "Model P = I²R membantu memahami panas di titik kontak. MCB tidak mendeteksi semua masalah sambungan."
    },
    {
      "q": "RCCB tanpa proteksi arus lebih terintegrasi…",
      "o": [
        "Masih memerlukan koordinasi proteksi arus lebih",
        "Selalu menggantikan MCB",
        "Membuat sentuhan bertegangan aman"
      ],
      "a": 0,
      "why": "Deteksi residual berbeda dari proteksi beban lebih dan hubung singkat."
    }
  ],
  "kualitas-daya": [
    {
      "q": "Selisih antara sumber 230 V dan beban 221 V pada kondisi sebanding adalah…",
      "o": [
        "9 V atau sekitar 3,91%",
        "221 V atau 96%",
        "0 V"
      ],
      "a": 0,
      "why": "(230 − 221) / 230 × 100% ≈ 3,91%. Ini belum menentukan kelayakan instalasi."
    },
    {
      "q": "Harmonisa ketiga dari frekuensi dasar 50 Hz berada pada…",
      "o": [
        "150 Hz",
        "53 Hz",
        "16,7 Hz"
      ],
      "a": 0,
      "why": "Harmonisa adalah kelipatan bilangan bulat frekuensi dasar: 3 × 50 = 150 Hz."
    }
  ],
  "kontrol-forward-reverse": [
    {
      "q": "Dalam model, jika MAJU aktif lalu MUNDUR diminta…",
      "o": [
        "Tolak MUNDUR sampai STOP dan syarat berhenti terpenuhi",
        "Aktifkan dua kontaktor",
        "Jumper overload"
      ],
      "a": 0,
      "why": "Dua keadaan arah saling melarang. OFF kontaktor juga belum membuktikan motor sudah berhenti."
    },
    {
      "q": "Interlock berbeda dari pengunci karena…",
      "o": [
        "Interlock mencegah keadaan bertentangan; pengunci mempertahankan perintah",
        "Interlock menentukan watt motor",
        "Pengunci menggantikan proteksi"
      ],
      "a": 0,
      "why": "Kontrol arah, pengunci dan proteksi mempunyai peran berbeda; mesin nyata memerlukan desain yang sesuai."
    }
  ],
  "lab-dc-led-relay": [
    {
      "q": "Sumber 3 V, LED diasumsikan 2 V dan resistor 330 Ω menghasilkan arus kira-kira…",
      "o": [
        "3 mA",
        "3 A",
        "330 mA"
      ],
      "a": 0,
      "why": "I = (3 − 2) / 330 A ≈ 0,003 A. Ini pendekatan berdasarkan asumsi LED."
    },
    {
      "q": "Sebelum memindahkan kabel breadboard…",
      "o": [
        "Lepaskan baterai dan periksa ulang jalur setelah perubahan",
        "Buat korslet untuk memeriksa",
        "Hilangkan resistor"
      ],
      "a": 0,
      "why": "Rakit dan ubah jalur tanpa sumber. Lab ini tidak melibatkan PLN."
    }
  ],
  "grounding-sistem-pembumian": [
    {
      "q": "Angka resistansi elektroda kecil membuktikan…",
      "o": [
        "Hanya aspek pengujian tersebut, bukan seluruh proteksi",
        "Seluruh PE pasti tersambung",
        "Semua bodi selalu nol volt"
      ],
      "a": 0,
      "why": "Kontinuitas PE, pemutusan gangguan, bonding dan kondisi uji perlu dinilai terpisah."
    },
    {
      "q": "Bolehkah netral dijumper ke rak di sembarang lokasi?",
      "o": [
        "Tidak, harus mengikuti sistem dan desain",
        "Boleh untuk menghemat kabel",
        "Wajib di setiap stopkontak"
      ],
      "a": 0,
      "why": "N, PE dan PEN memiliki aturan koneksi yang berbeda."
    }
  ],
  "bonding-ekuipotensial": [
    {
      "q": "Tujuan bonding protektif terutama…",
      "o": [
        "Membatasi beda potensial antarbagian yang ditentukan",
        "Menggantikan semua MCB",
        "Menaikkan tegangan"
      ],
      "a": 0,
      "why": "Bonding dan pembumian saling melengkapi, bukan fungsi yang sama."
    },
    {
      "q": "Clean earth membenarkan melepas PE?",
      "o": [
        "Tidak",
        "Ya untuk semua perangkat IT",
        "Ya ketika hujan"
      ],
      "a": 0,
      "why": "Fungsi EMC tidak boleh mengorbankan proteksi keselamatan."
    }
  ],
  "arrester-proteksi-petir": [
    {
      "q": "Air terminal dan SPD panel…",
      "o": [
        "Memiliki fungsi berbeda dalam lapisan proteksi",
        "Selalu perangkat yang sama",
        "Sama-sama UPS"
      ],
      "a": 0,
      "why": "Sistem luar dan pembatasan surja pada rangkaian perlu dikoordinasikan."
    },
    {
      "q": "Saat badai, pemeriksaan menara sebaiknya…",
      "o": [
        "Ditunda mengikuti prosedur cuaca aman",
        "Dilakukan dengan menyentuh konduktor",
        "Dibarengi melepas grounding"
      ],
      "a": 0,
      "why": "Jangan memanjat atau memanipulasi kabel outdoor saat petir berlangsung."
    }
  ],
  "spd-pemilihan-koordinasi": [
    {
      "q": "40 kA pada rating pelepasan SPD berarti…",
      "o": [
        "Karakteristik arus surja dengan uji terkait",
        "Arus beban panel yang boleh kontinu",
        "Tegangan keluaran selalu 40 kV"
      ],
      "a": 0,
      "why": "Arus impuls tidak sama dengan rating arus beban."
    },
    {
      "q": "Uc dan Up…",
      "o": [
        "Menyatakan besaran berbeda dan perlu dibaca bersama sistem",
        "Selalu sama",
        "Keduanya menunjukkan kapasitas baterai"
      ],
      "a": 0,
      "why": "Uc membahas tegangan kontinu; Up level proteksi hasil pengujian."
    }
  ],
  "proteksi-bts-cctv-outdoor": [
    {
      "q": "Radio mati saat hujan membuktikan…",
      "o": [
        "Ada gejala yang perlu diagnosis",
        "Pasti petir langsung",
        "Pasti kurang satu rod"
      ],
      "a": 0,
      "why": "Air, konektor, catu daya, kabel dan surja merupakan kemungkinan yang perlu dibedakan."
    },
    {
      "q": "PoE pasif dan 802.3af/at/bt…",
      "o": [
        "Tidak otomatis saling cocok",
        "Selalu sama karena RJ45",
        "Tidak memerlukan cek tegangan"
      ],
      "a": 0,
      "why": "Periksa tegangan, pinout, jenis PoE, kapasitas dan kecocokan pengaman."
    }
  ]
};
