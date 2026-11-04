import Link from 'next/link';
const topics:Record<string,{slug:string;title:string}[]>={
 'terstruktur':[{slug:'lanjut-closure',title:'Closure'},{slug:'lanjut-decorator',title:'Decorator'},{slug:'lanjut-generics',title:'Generics dan pemeriksaan tipe'}],
 'struktur-data':[{slug:'lanjut-greedy',title:'Greedy'},{slug:'lanjut-backtracking',title:'Backtracking'},{slug:'lanjut-dp',title:'Dynamic programming'}],
 'pemrograman-jaringan':[{slug:'lanjut-ssh',title:'SSH dan verifikasi host'},{slug:'lanjut-api-status',title:'Inventaris melalui API'},{slug:'lanjut-snmp',title:'Membaca data SNMP'}],
 'pengujian-debugging':[{slug:'lanjut-browser-form',title:'Pengujian formulir di browser'},{slug:'lanjut-browser-api',title:'Integrasi browser dan API'}],
 'proyek-otomasi':[{slug:'lanjut-cache',title:'Cache, TTL, dan invalidasi'},{slug:'lanjut-antrean',title:'Antrean, worker, dan retry'}],
 'rekayasa-deployment':[{slug:'lanjut-profiling',title:'Profiling dan memori'},{slug:'lanjut-beban-lokal',title:'Pengukuran beban lokal'}],
 'data-science':[{slug:'ds-time-series',title:'Deret waktu'},{slug:'ds-pca',title:'PCA'},{slug:'ds-model-eksperimen',title:'Penyimpanan model dan eksperimen'}],
};
export default function AdvancedPracticeNote({id}:{id:string}){
 const items=topics[id];if(!items)return null;
 return <aside className="net-track-note"><strong>Pendalaman setelah materi inti</strong><ul>{items.map(t=><li key={t.slug}><Link href={'/programming/'+t.slug}>{t.title} →</Link></li>)}</ul>{id!=='data-science' && <><p><a href="/programming/lab/advanced/advanced-programming-lab.zip" download>Unduh kode dan panduan latihan lanjutan (.zip) ↓</a> · <a href="https://github.com/fiksriots/Article-listrik/tree/main/examples/advanced-programming-lab" target="_blank" rel="noopener noreferrer">Sumber dan README ↗</a></p><p>Python 3.12 atau lebih baru. Contoh inti menggunakan pustaka bawaan. Pemeriksaan tipe, SSH, dan Playwright mengikuti instalasi terpisah dalam README. Data SNMP berupa simulasi; contoh API memakai server loopback.</p></>}{id==='pengujian-debugging' && <p><a href="/programming/lab/advanced/index.html" target="_blank" rel="noopener noreferrer">Coba formulir simulasi di browser ↗</a> · Simulasi ini menyimpan data sementara di memori halaman; proyek unduhan menyediakan API lokal untuk latihan integrasi.</p>}{id==='data-science' && <p>Ketiga materi tersedia dalam paket data-lab dan notebook Colab. Gunakan data sintetis, pisahkan data latih dan evaluasi, serta muat hanya artefak model yang tepercaya.</p>}</aside>;
}
