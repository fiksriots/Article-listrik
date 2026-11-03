import pandas as pd
def retensi(users,events,akhir='2026-03'):
    users,events=users.copy(),events.copy()
    if users.empty or not {'id','daftar'}<=set(users.columns) or not {'id','bulan'}<=set(events.columns):
        raise ValueError('Master user tidak kosong dan kolom harus lengkap.')
    users['id']=users['id'].astype('string').str.strip()
    events['id']=events['id'].astype('string').str.strip()
    if users['id'].eq('').any() or events['id'].eq('').any():
        raise ValueError('ID tidak boleh kosong.')
    if users['id'].isna().any() or users['id'].duplicated().any() or events['id'].isna().any():
        raise ValueError('ID user wajib unik dan terisi.')
    users['cohort']=pd.PeriodIndex(users['daftar'],freq='M')
    events['bulan']=pd.PeriodIndex(events['bulan'],freq='M')
    batas=pd.Period(akhir,freq='M')
    if users['cohort'].isna().any() or (users['cohort']>batas).any() or events['bulan'].isna().any():
        raise ValueError('Cohort atau bulan tidak sesuai.')
    joined=events.merge(users[['id','cohort']],on='id',how='left',validate='many_to_one',indicator=True)
    if joined['_merge'].ne('both').any() or (joined['bulan']<joined['cohort']).any() or (joined['bulan']>batas).any():
        raise ValueError('Aktivitas tanpa user, sebelum daftar, atau setelah cutoff.')
    aktif=joined.drop_duplicates(['id','bulan'])
    hasil=[]
    for cohort,grup in users.groupby('cohort',sort=True):
        ukuran=len(grup)
        for umur,bulan in enumerate(pd.period_range(cohort,batas,freq='M')):
            jumlah=aktif.loc[aktif['cohort'].eq(cohort)&aktif['bulan'].eq(bulan),'id'].nunique()
            hasil.append({'cohort':str(cohort),'umur':umur,'retensi':jumlah/ukuran})
    return pd.DataFrame(hasil).pivot(index='cohort',columns='umur',values='retensi')
if __name__=='__main__':
    users=pd.DataFrame({'id':['A','B','C','D'],'daftar':['2026-01','2026-01','2026-02','2026-03']})
    events=pd.DataFrame({'id':['A','A','A','B','C','C','D'],'bulan':['2026-01','2026-01','2026-02','2026-01','2026-02','2026-03','2026-03']})
    tabel=retensi(users,events)
    for cohort,row in tabel.iterrows():
        print(cohort+':', ['belum teramati' if pd.isna(v) else round(float(v),2) for v in row])
