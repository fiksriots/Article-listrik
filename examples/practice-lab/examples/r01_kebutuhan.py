from praktik_layanan.core import ringkas
rows=[{'layanan':'a','hasil':'ok'},{'layanan':'b','hasil':'timeout'}]
result=ringkas(rows)
kriteria={'total_observasi':result['total']==2,'rasio_sampel':result['rasio_ok']==.5,'tanpa_klaim_sla':'sla' not in result}
for nama,lulus in kriteria.items():print(nama+':',lulus)
# Kriteria ini contoh acceptance terukur, bukan pengganti diskusi kebutuhan.
