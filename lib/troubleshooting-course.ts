import {networkLessons} from './network-course';
import {winboxLessons} from './winbox-course';

export type TroubleshootingItem = {title: string; summary: string; href: string; minutes: number};
function network(slug: string): TroubleshootingItem {
  const lesson = networkLessons.find(item => item.slug === slug);
  if (!lesson) throw new Error(`Troubleshooting references missing lesson: ${slug}`);
  return {title: lesson.title, summary: lesson.summary, href: `/jaringan/${slug}`, minutes: lesson.minutes};
}
function winbox(slug: string): TroubleshootingItem {
  const lesson = winboxLessons.find(item => item.slug === slug);
  if (!lesson) throw new Error(`Troubleshooting references missing Winbox lesson: ${slug}`);
  return {title: lesson.title, summary: lesson.summary, href: `/jaringan/winbox/${slug}`, minutes: lesson.minutes};
}

export const troubleshootingGroups = [
  {id: 'pemeriksaan-dasar', title: 'Mulai dari pemeriksaan dasar', description: 'Belum tahu harus mengecek apa? Mulai dari gejala, jalur yang diuji, dan hasil pembanding.', items: [network('troubleshooting-runtut'), network('monitoring-ping'), network('bandwidth-latency')]},
  {id: 'kasus-gangguan', title: 'Kenali pola gangguan', description: 'Bedakan perubahan link, MAC, rute, dan neighbor; lanjutkan ke kasus DHCP, DNS, VLAN, serta akses perangkat.', items: [network('flapping-jaringan'), winbox('troubleshooting-kasus-nyata')]},
  {id: 'alat-dan-pemulihan', title: 'Kumpulkan bukti dan siapkan pemulihan', description: 'Gunakan alat yang sesuai, catat kondisi awal, dan ketahui cara kembali bila percobaan tidak membantu.', items: [winbox('troubleshooting'), network('mtcna-tools-monitoring'), network('monitoring-snmp-baseline'), winbox('monitoring-pemulihan')]},
  {id: 'pendalaman-routing', title: 'Pendalaman gangguan routing dan OSPF', description: 'Untuk yang sudah memahami routing dasar: periksa neighbor, adjacency, pemilihan jalur, dan kondisi link.', items: [network('mtcre-ospf-neighbor'), network('mtcre-ospf-cost')]},
];
export const troubleshootingItems = troubleshootingGroups.flatMap(group => group.items);
export const flappingArticle = network('flapping-jaringan');
