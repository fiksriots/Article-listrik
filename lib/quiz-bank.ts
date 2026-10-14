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
  ]
};
