# Varbind yang SUDAH didekode; bukan implementasi paket SNMP atau polling langsung.
SYSNAME='1.3.6.1.2.1.1.5.0'
OPER='1.3.6.1.2.1.2.2.1.8.1'

def ringkas_varbind(varbinds):
    mapping={row['oid']:row for row in varbinds}
    if len(mapping)!=len(varbinds):raise ValueError('OID ganda perlu ditinjau.')
    name,status=mapping[SYSNAME],mapping[OPER]
    if name['type']!='OctetString' or not isinstance(name['value'],str):raise ValueError('Tipe sysName salah.')
    if status['type']!='Integer' or type(status['value']) is not int:raise ValueError('Tipe status salah.')
    return {'nama':name['value'],'status':{1:'up',2:'down'}.get(status['value'],'lainnya')}

def delta_counter32(before,after,uptime_before,uptime_after):
    if any(type(x) is not int or not 0<=x<2**32 for x in [before,after,uptime_before,uptime_after]):raise ValueError('Butuh Counter32.')
    if uptime_after<uptime_before:return None
    return (after-before)%(2**32)  # Asumsi maksimum satu wrap dan tidak ada reset tersembunyi.

if __name__=='__main__':
    rows=[{'oid':SYSNAME,'type':'OctetString','value':'BTS-LAB'},{'oid':OPER,'type':'Integer','value':1}]
    print('Varbind fiktif:',ringkas_varbind(rows))
    print('Delta dengan asumsi satu wrap:',delta_counter32(2**32-6,4,100,110))
    print('Uptime turun, delta:',delta_counter32(10,20,100,5))
    print('Tidak mengirim SNMP GET atau WALK')
