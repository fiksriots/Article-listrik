import pandas as pd
if __name__=='__main__':
    lebar=pd.DataFrame({'waktu':['2026-10-01','2026-10-02'],'A':[20,25],'B':[35,40]})
    panjang=lebar.melt(id_vars='waktu',var_name='perangkat',value_name='rtt_ms')
    pulih=panjang.pivot(index='waktu',columns='perangkat',values='rtt_ms').reset_index()
    pulih.columns.name=None
    print('Baris long:',len(panjang))
    print('Pulih sama:',pulih.equals(lebar))
    try:
        pd.concat([panjang,panjang.iloc[[0]]]).pivot(index='waktu',columns='perangkat',values='rtt_ms')
    except ValueError:
        print('Key ganda terdeteksi sebelum pivot')
