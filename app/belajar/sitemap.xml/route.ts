import {winboxItems,WINBOX_BASE} from '@/lib/winbox-course';
import {GET as getCatalogue} from '@/app/api/articles/route';
export const dynamic='force-static';
const origin='https://fikss.id';
const indexPaths=['/belajar','/listrik','/modul','/galeri','/simulator','/jaringan','/jaringan/winbox','/jaringan/mtcna','/jaringan/mtcre','/jaringan/mtcre/kurikulum','/jaringan/troubleshooting','/jaringan/simulator','/jaringan/simulator/ipv6','/jaringan/simulator/next-hop','/jaringan/simulator/ospf','/jaringan/simulator/failover','/iot','/iot/arduino','/git','/git/dasar','/git/github','/git/gitlab','/git/panduan-cepat'];
function escape(value:string){return value.replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]!));}
export async function GET(){
  const catalogue=await (await getCatalogue()).json() as {items:{url:string}[]};
  const urls=[...new Set([...indexPaths.map(path=>origin+path),...catalogue.items.map(item=>item.url),...winboxItems.map(item=>origin+WINBOX_BASE+'/'+item.slug)])];
  return new Response('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls.map(url=>'<url><loc>'+escape(url)+'</loc></url>').join('')+'</urlset>',{headers:{'Content-Type':'application/xml; charset=utf-8','Cache-Control':'public, max-age=3600'}});
}
