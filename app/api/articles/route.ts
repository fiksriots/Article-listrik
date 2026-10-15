import { lessons } from '@/lib/course';
import { getLesson } from '@/lib/content';
import { devicePhotos } from '@/lib/device-photos';

// The public catalogue is rebuilt whenever the learning site is deployed.
export const dynamic = 'force-static';

export function GET() {
  const origin = 'https://listrik.fikss.site';
  const items = lessons.flatMap((lesson, index) => {
    const doc = getLesson(lesson.slug);
    if (!doc) return [];
    const photoKey = doc.content.match(/<DeviceGuide\s+type=["']([^"']+)["']/)?.[1];
    const photo = photoKey ? devicePhotos[photoKey] : undefined;
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
