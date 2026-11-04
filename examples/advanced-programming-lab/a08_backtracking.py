def pilih_jumlah(values,target):
    if type(target) is not int or target<0 or any(type(x) is not int or x<=0 for x in values):
        raise ValueError('Bilangan positif dan target nonnegatif.')
    if len(values)>16:raise ValueError('Batas eksplorasi lab 16 elemen.')
    hasil=[]
    def cari(index,total,pilihan):
        if total==target:
            hasil.append(pilihan.copy());return
        if total>target or index==len(values):return
        pilihan.append(values[index]);cari(index+1,total+values[index],pilihan);pilihan.pop()
        cari(index+1,total,pilihan)
    cari(0,0,[])
    return hasil

if __name__=='__main__':
    print('Subset untuk 5:',pilih_jumlah([2,3,5],5))
    print('Input dipakai paling banyak sekali per indeks')
