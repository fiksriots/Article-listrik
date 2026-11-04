import codecs
pesan = 'Suhu 27°C'
data = pesan.encode('utf-8')
print('Karakter:', len(pesan))
print('Byte:', len(data))
# Potong tepat di tengah encoding dua byte karakter derajat.
batas = data.index(b'\xc2') + 1
decoder = codecs.getincrementaldecoder('utf-8')()
bagian1 = decoder.decode(data[:batas], final=False)
bagian2 = decoder.decode(data[batas:], final=True)
print('Pulih:', bagian1 + bagian2)
