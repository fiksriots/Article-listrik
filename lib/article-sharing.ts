import type {Metadata} from 'next';
export function articleMetadata(title:string,description:string,path:string):Metadata{
 const url='https://article.fikss.site'+path;
 const image='https://article.fikss.site/bagikan/gambar?'+new URLSearchParams({title,description:description.slice(0,220)});
 return {alternates:{canonical:url},openGraph:{type:'article',locale:'id_ID',siteName:'Ruang Belajar Fikri',title,description,url,images:[{url:image,width:1200,height:630,alt:title}]},twitter:{card:'summary_large_image',title,description,images:[image]}};
}
