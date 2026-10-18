import data from './electric-lessons.json';
export type ElectricLesson = {slug:string;title:string;summary:string;minutes:number};
export const stages = [
  {
    "id": "dasar",
    "name": "Dasar dan keselamatan",
    "description": "Kenali listrik, satuan, sumber, dan cara belajar dengan aman.",
    "prerequisite": "Belum perlu pengalaman listrik.",
    "slugs": [
      "apa-itu-listrik",
      "keselamatan-dc",
      "volt-ampere-ohm",
      "konduktor-isolator-rangkaian",
      "ac-dc-sumber-listrik"
    ]
  },
  {
    "id": "rangkaian",
    "name": "Rangkaian dan pengukuran",
    "description": "Hitung rangkaian sederhana, kenali alat ukur, lalu baca skemanya.",
    "prerequisite": "Pahami tegangan, arus, hambatan, dan sumber AC/DC.",
    "slugs": [
      "hukum-ohm-daya",
      "rangkaian-seri-paralel",
      "multimeter",
      "membaca-skema"
    ]
  },
  {
    "id": "elektronika",
    "name": "Komponen dan catu daya DC",
    "description": "Bedakan komponen pasif, aktif, dan kebutuhan suplai perangkat.",
    "prerequisite": "Pahami rangkaian seri/paralel dan pembacaan skema.",
    "slugs": [
      "komponen-pasif-led",
      "dioda-transistor-ic",
      "komponen-dc-penggunaan",
      "sekering-proteksi-dc",
      "power-supply-baterai"
    ]
  },
  {
    "id": "konversi",
    "name": "Konversi energi dan kontrol dasar",
    "description": "Pahami perubahan tegangan, pemilihan komponen, serta input–proses–output.",
    "prerequisite": "Kenali komponen dasar dan catu daya DC.",
    "slugs": [
      "kapasitor-induktor-ac-dc",
      "penyearah-regulator",
      "memilih-komponen-ac-dc",
      "saklar-no-nc",
      "sensor-relay-iot"
    ]
  },
  {
    "id": "tenaga",
    "name": "Pengenalan listrik arus kuat",
    "description": "Ikuti perjalanan energi, satu/tiga phase, daya AC, dan perangkat tenaga.",
    "prerequisite": "Kuasai dasar AC/DC dan perhitungan daya.",
    "slugs": [
      "mengenal-arus-kuat",
      "pembangkit-trafo",
      "satu-tiga-phase",
      "daya-ac-faktor-daya",
      "komponen-ac-penggunaan"
    ]
  },
  {
    "id": "proteksi",
    "name": "Instalasi dan sistem proteksi",
    "description": "Bedakan netral/PE, pengaman, panel distribusi, dan pertimbangan kabel.",
    "prerequisite": "Kenali tiga phase, sifat beban, dan perangkat AC.",
    "slugs": [
      "netral-grounding-proteksi",
      "terminal-sambungan-kabel",
      "panel-kabel-beban"
    ]
  },
  {
    "id": "motor",
    "name": "Motor dan otomasi",
    "description": "Pahami motor sebelum kontaktor, proteksi motor, VFD, dan PLC.",
    "prerequisite": "Pahami distribusi dan fungsi pengaman; mulai dari simulasi.",
    "slugs": [
      "motor-elektromagnet",
      "nameplate-motor",
      "kontaktor-relay-panel",
      "proteksi-motor",
      "kontrol-start-stop",
      "sensor-industri-sinyal",
      "vfd-plc"
    ]
  },
  {
    "id": "penerapan",
    "name": "Penerapan dan troubleshooting",
    "description": "Gabungkan konsep untuk daya cadangan, perangkat IT, dan analisis gangguan.",
    "prerequisite": "Selesaikan fondasi; ulangi materi proteksi sebelum menganalisis gangguan.",
    "slugs": [
      "ups-genset-ats",
      "troubleshooting-power",
      "daya-cctv-server",
      "simulasi-gangguan"
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
