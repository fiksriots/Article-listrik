import {devicePhotos} from '@/lib/device-photos';
export function DevicePhotograph({id,credit=true}:{id:string;credit?:boolean}) {
  const p=devicePhotos[id];
  if(!p) return null;
  return <div className="device-photograph"><div className="device-photo-frame">
    <img src={p.src} width={p.width} height={p.height} alt={'Foto perangkat asli: '+p.label} loading="lazy" decoding="async"/>
  </div><p className="device-photo-label">{p.label}</p>
  {credit&&<p className="device-photo-credit">Foto: {p.author} · <a href={p.source}>Sumber</a> · {p.licenseUrl?<a href={p.licenseUrl}>{p.license}</a>:p.license}. {p.changes}</p>}
  </div>;
}
export function PhotoCredits() {
  return <details className="photo-credits panel"><summary className="font-bold text-teal-800 cursor-pointer">Kredit foto dan lisensi</summary>
    <p className="muted text-sm my-3">Foto asli dari Wikimedia Commons. WebP dan penyesuaian ukuran tidak mengubah isi perangkat. Bentuk, terminal, dan rating berbeda menurut model; foto bukan rekomendasi pembelian atau petunjuk pengawatan.</p>
    <ul className="space-y-3">{Object.entries(devicePhotos).map(([id,p])=><li key={id} className="text-sm"><a className="text-teal-700 underline" href={p.source}>{p.label}</a> — {p.author} · {p.licenseUrl?<a className="underline" href={p.licenseUrl}>{p.license}</a>:p.license}. {p.changes}</li>)}</ul>
  </details>;
}
