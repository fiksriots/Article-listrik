import data from './electric-lessons.json';
export type ElectricLesson = {slug:string;title:string;summary:string;minutes:number};
export const stages = [
  {
    "id": "dasar",
    "name": "Dasar dan keselamatan",
    "description": "Kenali listrik, pengendalian energi, satuan, sumber, label perangkat, dan cara belajar dengan aman.",
    "prerequisite": "Belum perlu pengalaman listrik.",
    "slugs": [
      "apa-itu-listrik",
      "keselamatan-dc",
      "keselamatan-loto",
      "volt-ampere-ohm",
      "konduktor-isolator-rangkaian",
      "ac-dc-sumber-listrik",
      "membaca-label-perangkat"
    ]
  },
  {
    "id": "rangkaian",
    "name": "Rangkaian dan pengukuran",
    "description": "Hitung rangkaian, pahami fungsi alat ukur, lalu baca skema tanpa menebak.",
    "prerequisite": "Pahami tegangan, arus, hambatan, dan sumber AC/DC.",
    "slugs": [
      "hukum-ohm-daya",
      "rangkaian-seri-paralel",
      "multimeter",
      "alat-ukur-lanjutan",
      "membaca-skema"
    ]
  },
  {
    "id": "elektronika",
    "name": "Komponen dan catu daya DC",
    "description": "Kenali komponen, coba lab LED baterai, lalu pahami suplai DC.",
    "prerequisite": "Pahami rangkaian seri/paralel dan pembacaan skema.",
    "slugs": [
      "komponen-pasif-led",
      "lab-dc-led-relay",
      "dioda-transistor-ic",
      "komponen-dc-penggunaan",
      "sekering-proteksi-dc",
      "power-supply-baterai"
    ]
  },
  {
    "id": "konversi",
    "name": "Konversi energi dan kontrol dasar",
    "description": "Pahami konversi energi, pemilihan komponen, datasheet, dan kontrol dasar.",
    "prerequisite": "Kenali komponen dasar dan catu daya DC.",
    "slugs": [
      "kapasitor-induktor-ac-dc",
      "penyearah-regulator",
      "memilih-komponen-ac-dc",
      "membaca-datasheet-derating",
      "saklar-no-nc",
      "sensor-relay-iot"
    ]
  },
  {
    "id": "tenaga",
    "name": "Pengenalan listrik arus kuat",
    "description": "Ikuti perjalanan energi, dasar PLTS, satu/tiga fasa, faktor daya dan kualitas pasokan.",
    "prerequisite": "Kuasai dasar AC/DC dan perhitungan daya.",
    "slugs": [
      "mengenal-arus-kuat",
      "pembangkit-trafo",
      "dasar-plts-komponen",
      "satu-tiga-phase",
      "daya-ac-faktor-daya",
      "kualitas-daya",
      "komponen-ac-penggunaan"
    ]
  },
  {
    "id": "proteksi",
    "name": "Dasar instalasi dan proteksi",
    "description": "Pahami PE, gangguan, sambungan, kabel, panel, lalu koordinasi pengaman.",
    "prerequisite": "Kenali tiga phase, sifat beban, dan perangkat AC.",
    "slugs": [
      "netral-grounding-proteksi",
      "jenis-gangguan-listrik",
      "terminal-sambungan-kabel",
      "panel-kabel-beban",
      "koordinasi-pengaman"
    ]
  },
  {
    "id": "grounding-bonding",
    "name": "Grounding dan bonding",
    "description": "Kenali sistem pembumian, elektroda, pengukuran, dan hubungan ekuipotensial.",
    "prerequisite": "Pahami PE, jenis gangguan, dan dasar instalasi/proteksi.",
    "slugs": [
      "grounding-sistem-pembumian",
      "bonding-ekuipotensial"
    ]
  },
  {
    "id": "petir-spd",
    "name": "Proteksi petir dan SPD",
    "description": "Bedakan sistem proteksi petir, arrester, rating SPD, dan koordinasi antarlapisan.",
    "prerequisite": "Pahami grounding dan bonding sebelum membaca rancangan proteksi surja.",
    "slugs": [
      "arrester-proteksi-petir",
      "spd-pemilihan-koordinasi"
    ]
  },
  {
    "id": "motor",
    "name": "Motor dan otomasi",
    "description": "Pahami motor dan starter, lalu sinyal industri, PLC, VFD, serta perawatan berbasis kondisi.",
    "prerequisite": "Pahami distribusi dan fungsi pengaman; mulai dari simulasi.",
    "slugs": [
      "motor-elektromagnet",
      "nameplate-motor",
      "kontaktor-relay-panel",
      "proteksi-motor",
      "kontrol-start-stop",
      "kontrol-forward-reverse",
      "star-delta-motor",
      "sensor-industri-sinyal",
      "sensor-analog-pnp-npn",
      "vfd-plc",
      "plc-ladder-timer-counter",
      "vfd-parameter-diagnosis",
      "perawatan-motor-kondisi"
    ]
  },
  {
    "id": "penerapan",
    "name": "Penerapan dan troubleshooting",
    "description": "Terapkan daya dan monitoring, nilai efisiensi, lalu gabungkan semuanya dalam proyek akhir rak jaringan.",
    "prerequisite": "Pahami instalasi, grounding–bonding, serta proteksi petir/SPD sebelum studi kasus outdoor.",
    "slugs": [
      "baterai-ups-runtime",
      "ups-genset-ats",
      "daya-cctv-server",
      "catu-daya-poe-jaringan",
      "proteksi-bts-cctv-outdoor",
      "monitoring-kelistrikan",
      "efisiensi-energi-audit",
      "dokumentasi-inspeksi-listrik",
      "troubleshooting-power",
      "simulasi-gangguan",
      "proyek-akhir-rak-jaringan"
    ]
  }
];
const catalog: ElectricLesson[] = data;
export const lessons: ElectricLesson[] = stages.flatMap(stage => stage.slugs.map(slug => {
  const lesson = catalog.find(item => item.slug === slug);
  if (!lesson) throw new Error('Missing electric lesson: ' + slug);
  return lesson;
}));
export function getLessonPosition(slug:string) {
  const index = lessons.findIndex(lesson => lesson.slug === slug);
  const stageIndex = stages.findIndex(stage => stage.slugs.includes(slug));
  const stage = stages[stageIndex];
  return {index, stageIndex, stage, inStage:stage?.slugs.indexOf(slug)??-1, previous:lessons[index-1], next:lessons[index+1]};
}
