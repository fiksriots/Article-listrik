import pandas as pd
if __name__ == '__main__':
    data = pd.DataFrame({'waktu':['2026-10-01T00:00:00Z','2026-10-01T02:00:00Z'], 'rtt':[20.,40.]})
    data['waktu'] = pd.to_datetime(data['waktu'], utc=True)
    per_jam = data.set_index('waktu')['rtt'].resample('h').mean()
    print('Jam tersedia:', len(per_jam))
    print('Jam tanpa observasi:', int(per_jam.isna().sum()))
    print('Rata-rata sampel valid:', float(data['rtt'].mean()))
    print('Waktu lokal pertama:', data['waktu'].dt.tz_convert('Asia/Jakarta').iloc[0].strftime('%H:%M'))
