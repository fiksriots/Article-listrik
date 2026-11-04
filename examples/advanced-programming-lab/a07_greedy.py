def greedy(koin,target):
    if type(target) is not int or target<0 or not koin or any(type(x) is not int or x<=0 for x in koin):
        raise ValueError('Koin positif dan target integer nonnegatif.')
    hasil=[];sisa=target
    for nilai in sorted(set(koin),reverse=True):
        jumlah,sisa=divmod(sisa,nilai)
        hasil.extend([nilai]*jumlah)
    return hasil if sisa==0 else None

if __name__=='__main__':
    print('Greedy [1,3,4] untuk 6:',greedy([1,3,4],6))
    print('Solusi lebih sedikit:',[3,3])
    print('Pilihan lokal terbesar tidak selalu optimal global')
