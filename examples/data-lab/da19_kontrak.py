import numpy as np
import pandas as pd
def profil_kualitas(data):
    if not {'id','status','rtt_ms'}<=set(data.columns):
        raise ValueError('Kolom wajib: id, status, rtt_ms.')
    identitas=data['id'].astype('string').str.strip()
    rtt=pd.to_numeric(data['rtt_ms'],errors='coerce')
    invalid=data['rtt_ms'].notna() & (rtt.isna() | ~np.isfinite(rtt) | (rtt<0))
    return {'baris':len(data),
            'id_kosong':int((identitas.isna()|identitas.eq('')).sum()),
            'baris_id_ganda':int(identitas.duplicated(keep=False).sum()),
            'status_asing':int((~data['status'].isin(['up','down'])).sum()),
            'rtt_invalid':int(invalid.sum()),
            'rtt_wajib_kosong':int((data['status'].eq('up') & data['rtt_ms'].isna()).sum())}
if __name__=='__main__':
    data=pd.DataFrame({'id':['A','B','B','C'],'status':['up','down','up','up'],'rtt_ms':[20,None,-3,None]})
    for aturan,jumlah in profil_kualitas(data).items():print(aturan+':',jumlah)
