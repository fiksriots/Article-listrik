import {mtcreLabs} from '@/lib/mtcre-labs';
import {iotLessons} from '@/lib/iot-course';
import { networkLessons } from '@/lib/network-course';
import { lessons } from '@/lib/course';
import { getLesson } from '@/lib/content';
import { devicePhotos } from '@/lib/device-photos';

const lessonPhotos: Record<string, string> = {
  'apa-itu-listrik': 'saklar',
  'volt-ampere-ohm': 'multimeter',
  'konduktor-isolator-rangkaian': 'saklar',
  'ac-dc-sumber-listrik': 'kapasitor',
  'hukum-ohm-daya': 'resistor',
  'rangkaian-seri-paralel': 'resistor',
  'multimeter': 'multimeter',
  'keselamatan-dc': 'mcb',
  'komponen-pasif-led': 'resistor',
  'dioda-transistor-ic': 'resistor',
  'power-supply-baterai': 'kapasitor',
  'sensor-relay-iot': 'relay',
  'pembangkit-trafo': 'motor',
  'satu-tiga-phase': 'motor',
  'netral-grounding-proteksi': 'rccb',
  'panel-kabel-beban': 'mcb',
  'motor-elektromagnet': 'motor',
  'kontaktor-relay-panel': 'relay',
  'vfd-plc': 'plc',
  'ups-genset-ats': 'relay',
  'membaca-skema': 'saklar',
  'troubleshooting-power': 'multimeter',
  'daya-cctv-server': 'multimeter',
  'simulasi-gangguan': 'mcb',
  'mengenal-arus-kuat': 'mcb',
  'komponen-ac-penggunaan': 'mcb',
  'proteksi-motor': 'motor',
  'daya-ac-faktor-daya': 'kapasitor',
  'komponen-dc-penggunaan': 'resistor',
  'penyearah-regulator': 'kapasitor',
  'kapasitor-induktor-ac-dc': 'kapasitor',
  'memilih-komponen-ac-dc': 'relay',
};

// The public catalogue is rebuilt whenever the learning site is deployed.
export const dynamic = 'force-static';

export function GET() {
  const origin = 'https://article.fikss.site';
  const items = lessons.flatMap((lesson, index) => {
    const doc = getLesson(lesson.slug);
    if (!doc) return [];
    const photoKey = doc.content.match(/<DeviceGuide\s+type=["']([^"']+)["']/)?.[1];
    const photo = devicePhotos[lessonPhotos[lesson.slug] || photoKey || 'saklar'] || devicePhotos.saklar;
    return [{
      id: `listrik-${lesson.slug}`,
      slug: lesson.slug,
      title: String(doc.data.title || lesson.title),
      summary: String(doc.data.summary || lesson.summary),
      url: `${origin}/materi/${lesson.slug}`,
      category: 'Belajar Listrik',
      tags: ['Listrik', 'Pemula'],
      minutes: lesson.minutes,
      order: index + 1,
      image: photo ? {
        url: `${origin}${photo.src}`,
        alt: photo.label,
        author: photo.author,
        source: photo.source,
        license: photo.license,
        licenseUrl: photo.licenseUrl,
        changes: photo.changes,
      } : null,
    }];
  });

  const networkItems = networkLessons.map((lesson, index) => ({
    id: `network-${lesson.slug}`, slug: lesson.slug, title: lesson.title,
    summary: lesson.summary, url: `${origin}/jaringan/${lesson.slug}`,
    category: 'Belajar Jaringan', tags: lesson.mtcre ? ['Jaringan', 'MTCRE', 'Routing'] : ['Jaringan', 'Network', 'Pemula'],
    minutes: lesson.minutes, order: lessons.length + index + 1,
    image: { url: `${origin}/network/${lesson.slug}.svg`, alt: lesson.title,
      author: 'Learn Jaringan', source: `${origin}/jaringan/${lesson.slug}`,
      license: 'Ilustrasi edukasi', licenseUrl: '', changes: 'Ilustrasi vektor skematis asli' },
  }));
  const iotItems = iotLessons.map((l,index)=>({id:`iot-${l.slug}`,slug:l.slug,title:l.title,summary:l.summary,url:`${origin}/iot/${l.slug}`,category:'Belajar IoT',tags:['IoT','ESP32','Pemula'],minutes:l.minutes,order:lessons.length+networkLessons.length+index+1,image:{url:`${origin}/iot/${l.slug}.svg`,alt:l.title,author:'Fiks Learn IoT',source:`${origin}/iot/${l.slug}`,license:'Ilustrasi edukasi',licenseUrl:'',changes:'Ilustrasi vektor skematis asli'}}));
  const labItems = mtcreLabs.map((l,index)=>({id:`mtcre-lab-${l.slug}`,slug:`mtcre-lab-${l.slug}`,title:`Lab MTCRE · ${l.title}`,summary:l.goal,url:`${origin}/jaringan/mtcre/lab/${l.slug}`,category:'Belajar Jaringan',tags:['MTCRE','Lab','RouterOS v7'],minutes:45,order:lessons.length+networkLessons.length+iotLessons.length+index+1,image:{url:`${origin}/network/lab-${l.slug}.svg`,alt:l.title,author:'Fiks Learn Jaringan',source:`${origin}/jaringan/mtcre/lab/${l.slug}`,license:'Ilustrasi edukasi',licenseUrl:'',changes:'Topologi lab skematis asli'}}));
  return Response.json({ title: 'Akademi Belajar Listrik & Elektronika', url: origin, items: [...items, ...networkItems, ...iotItems, ...labItems] }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
