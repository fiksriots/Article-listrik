import {searchTracks} from '@/lib/search-catalog';

export const dynamic = 'force-static';
export function GET() {
  const items = [...new Map(searchTracks.flatMap(track => track.lessons.map(lesson => [lesson.href, {
    title:lesson.title, href:lesson.href, summary:lesson.summary, track:track.title,
  }] as const))).values()];
  return Response.json(items, {headers:{'Cache-Control':'public, max-age=3600, s-maxage=3600'}});
}
