"""Generate exact, labelled SVG topologies for the Winbox advanced labs."""
from pathlib import Path
from html import escape

OUT = Path(__file__).resolve().parents[1] / 'public/network/winbox'
INK = '#193a32'
GREEN = '#236b62'


def svg(name, title, subtitle, boxes, edges, notes=()):
    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 640" role="img" aria-labelledby="title desc"><title id="title">{escape(title)}</title><desc id="desc">{escape(subtitle)}</desc>',
             '<rect width="900" height="640" rx="20" fill="#f4f7f2"/>',
             f'<g font-family="Arial,sans-serif" fill="{INK}"><text x="38" y="45" font-size="25" font-weight="700">{escape(title)}</text><text x="38" y="75" font-size="17">{escape(subtitle)}</text></g>']
    for x1, y1, x2, y2, label, lx, ly in edges:
        parts.append(f'<path d="M{x1} {y1} L{x2} {y2}" stroke="#77938a" stroke-width="3" fill="none"/>')
        if label:
            width = min(520, len(label) * 9 + 18)
            parts.append(f'<rect x="{lx-width/2}" y="{ly-18}" width="{width}" height="26" rx="5" fill="#f4f7f2"/><text x="{lx}" y="{ly}" text-anchor="middle" font-family="Arial,sans-serif" font-size="17" fill="{INK}">{escape(label)}</text>')
    for x, y, w, height, lines, dark in boxes:
        bg, fg = (GREEN, '#ffffff') if dark else ('#ffffff', INK)
        parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{height}" rx="12" fill="{bg}" stroke="#c1d5c8"/>')
        first_y = y + height / 2 - (len(lines) - 1) * 13 + 7
        for n, line in enumerate(lines):
            parts.append(f'<text x="{x+w/2}" y="{first_y+n*26}" text-anchor="middle" font-family="Arial,sans-serif" font-size="{20 if n == 0 else 17}" font-weight="{700 if n == 0 else 400}" fill="{fg}">{escape(line)}</text>')
    for i, note in enumerate(notes):
        parts.append(f'<text x="38" y="{586+i*24}" font-family="Arial,sans-serif" font-size="17" fill="{INK}">{escape(note)}</text>')
    parts.append('</svg>')
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / f'{name}.svg').write_text(''.join(parts))

svg('lab-vlan', 'VLAN: access dan trunk', 'Lab Layer 2: gateway VLAN dibuat pada materi berikutnya.',
    [(50,110,230,90,['Admin R1','ether2 / bridge lama'],False), (365,110,230,90,['R1 / br-lab','ether5 = trunk'],True),
     (365,305,230,80,['S1 / br-lab','ether1 = trunk'],True), (45,450,220,90,['Staf VLAN 10','S1 ether2: untagged'],False),
     (340,450,220,90,['CCTV VLAN 30','S1 ether3: untagged'],False), (635,450,220,90,['Tamu VLAN 20','S1 ether4: untagged'],False)],
    [(280,155,365,155,'',0,0),(480,200,480,305,'tagged VLAN 10, 20, 30',480,260),
     (400,385,155,450,'',0,0),(480,385,450,450,'',0,0),(560,385,745,450,'',0,0)],
    ['R1 ether3: access VLAN 10; ether4: access VLAN 20.', 'Admin S1 memakai ether5 terpisah dari bridge data.'])

svg('lab-intervlan', 'VLAN dan kebijakan routed', 'Gateway VLAN tidak otomatis menjadi izin semua trafik.',
    [(350,110,200,70,['Internet / WAN'],False),(320,255,260,90,['R1: gateway + firewall','10.1 / 20.1 / 30.1'],True),
     (40,435,230,100,['Staf VLAN 10','192.168.10.0/24','Internet + NVR TCP 80'],False),
     (335,435,230,100,['Tamu VLAN 20','192.168.20.0/24','Internet saja'],False),
     (630,435,230,100,['CCTV VLAN 30','192.168.30.0/24','NVR .30.10; WAN ditolak'],False)],
    [(450,180,450,255,'NAT untuk sumber yang diizinkan',450,222),(365,345,155,435,'',0,0),(450,345,450,435,'',0,0),(535,345,745,435,'',0,0)],
    ['Input: akses ke router. Forward: akses melewati router.', 'Izin staf ke NVR dibatasi interface, sumber, tujuan, dan layanan.'])

svg('lab-pcq', 'PCQ menurut IP klien', 'Lab terpisah: LAN 192.168.88.0/24; mask classifier IPv4 /32.',
    [(335,110,230,75,['Jalur internet uji','Kapasitas memadai'],False),
     (260,270,380,95,['R1 / LAB-PCQ-LAN','Total upload 10M / download 30M','PCQ rate 0 pada type'],True),
     (35,450,240,90,['Klien .88.100','Contoh: 3,33M / 10M'],False),
     (330,450,240,90,['Klien .88.101','Contoh: 3,33M / 10M'],False),
     (625,450,240,90,['Klien .88.102','Contoh: 3,33M / 10M'],False)],
    [(450,185,450,270,'',0,0),(330,365,155,450,'',0,0),(450,365,450,450,'',0,0),(570,365,745,450,'',0,0)],
    ['Pembagian contoh saat tiga klien aktif sama-sama meminta penuh.', 'Upload: src-address. Download: dst-address. Hasil aktual perlu diukur.'])

svg('lab-failover', 'Recursive failover dua ISP', 'Lab tersendiri: admin melalui ether3; ether2 digunakan untuk WAN2.',
    [(60,110,300,100,['Probe 8.8.8.8/32','via 192.168.1.1 / ISP1','WAN1 ether1: 192.168.1.2'],False),
     (540,110,300,100,['Probe 1.1.1.1/32','via 192.168.2.1 / ISP2','WAN2 ether2: 192.168.2.2'],False),
     (270,315,360,100,['R1 / routing table main','Default utama distance 1','Default cadangan distance 2'],True),
     (270,485,360,60,['LAN 192.168.88.0/24'],False)],
    [(210,210,370,315,'ISP1 utama',255,270),(690,210,530,315,'ISP2 cadangan',660,270),(450,415,450,485,'',0,0)],
    ['Probe /32 dipasangkan ke gateway ISP masing-masing.', 'Route aktif belum membuktikan DNS dan HTTPS klien berhasil.'])

svg('lab-wireguard', 'WireGuard untuk admin Winbox', 'Endpoint UDP berbeda dari alamat IP di dalam tunnel.',
    [(55,125,290,100,['Laptop jaringan luar','VPN 10.77.77.2/32','Menyimpan private key sendiri'],False),
     (520,125,320,100,['Endpoint publik lab','UDP 13231','WAN/modem menuju R1'],False),
     (520,340,320,105,['R1 / wg-lab','VPN 10.77.77.1/24','Peer: public key laptop'],True),
     (55,340,290,105,['Winbox ke 10.77.77.1','TCP 8291 melalui VPN','Diizinkan dari peer /32'],False)],
    [(345,175,520,175,'handshake',430,165),(680,225,680,340,'tunnel',680,290),(520,395,345,395,'',0,0)],
    ['AllowedIPs laptop awal: hanya 10.77.77.1/32.', 'CGNAT memerlukan rancangan endpoint yang dapat dijangkau.'])

svg('lab-security', 'Membatasi pintu pengelolaan', 'Akun, Services, firewall, dan MAC access diperiksa secara terpisah.',
    [(45,125,260,90,['Admin lokal','bridge admin / .88.0/24'],False),
     (595,125,260,90,['Peer VPN terdaftar','10.77.77.2/32'],False),
     (300,300,300,105,['Router / layanan admin','Akun + izin source','Input filter + Services'],True),
     (45,465,260,80,['VLAN tamu','Winbox ditolak'],False),
     (595,465,260,80,['Internet / WAN','Winbox langsung ditolak'],False)],
    [(175,215,365,300,'izin terbatas',210,267),(725,215,535,300,'izin VPN',695,267),
     (175,465,365,405,'tolak',210,445),(725,465,535,405,'tolak',695,445)],
    ['MAC Winbox hanya pada interface pengelolaan yang tepercaya.', 'Discovery dimatikan tidak sama dengan mematikan akses IP.'])

svg('lab-cases', 'Alur bukti troubleshooting', 'Lanjutkan berdasarkan hasil; ubah satu hal pada satu waktu.',
    [(60,120,300,85,['Laptop dan adapter','IP, prefix, gateway, DNS'],False),
     (540,120,300,85,['Link dan VLAN','Running, PVID, tagged'],False),
     (540,300,300,85,['Gateway dan WAN','Route, probe, NAT/filter'],True),
     (60,300,300,85,['DNS dan aplikasi','nslookup, HTTPS'],False),
     (180,465,540,85,['Catatan dan pemulihan','Waktu + prediksi + hasil + tindakan'],False)],
    [(360,163,540,163,'',0,0),(690,205,690,300,'',0,0),(540,343,360,343,'',0,0),
     (210,385,335,465,'',0,0),(690,385,565,465,'',0,0)],
    ['Ping gateway gagal: periksa lokal sebelum langsung mengganti DNS.'])

svg('lab-project', 'Proyek kantor kecil: pemetaan final', 'Pada proyek ini WAN2 = ether3; ether2 tetap jalur admin.',
    [(50,105,240,75,['ISP1 / gateway .1.1','R1 ether1 / .1.2'],False),
     (610,105,240,75,['ISP2 / gateway .2.1','R1 ether3 / .2.2'],False),
     (320,235,260,95,['R1 / gateway kantor','VLAN + firewall + PCQ','VPN admin terbatas'],True),
     (45,240,215,90,['Admin lokal','ether2 / .88.1'],False),
     (320,395,260,65,['S1 / trunk ether1'],True),
     (30,505,250,55,['Staf / VLAN 10'],False),
     (325,505,250,55,['Tamu / VLAN 20'],False),
     (620,505,250,55,['CCTV / VLAN 30'],False)],
    [(170,180,365,235,'',0,0),(730,180,535,235,'',0,0),(260,285,320,285,'',0,0),
     (450,330,450,395,'R1 ether5: tagged 10/20/30',450,370),
     (355,460,155,505,'',0,0),(450,460,450,505,'',0,0),(545,460,745,505,'',0,0)],
    ['Tamu PCQ total 5M upload / 10M download; CCTV tidak diberi WAN.', 'Failover LAN tidak otomatis memindahkan endpoint VPN publik.'])
print('Generated 8 labelled SVG topology diagrams.')
