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
  const origin = 'https://listrik.fikss.site';
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

  return Response.json({ title: 'Akademi Belajar Listrik & Elektronika', url: origin, items }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
