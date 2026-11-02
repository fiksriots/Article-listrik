from io import StringIO


class CatatanSementara:
    def __enter__(self):
        self.buffer = StringIO()
        return self.buffer

    def __exit__(self, jenis_error, nilai_error, traceback):
        self.buffer.close()
        return False  # Error tetap diteruskan ke pemanggil.


if __name__ == '__main__':
    catatan = CatatanSementara()
    try:
        with catatan as buffer:
            buffer.write('Mulai pemeriksaan')
            print(buffer.getvalue())
            raise ValueError('Sensor latihan gagal')
    except ValueError:
        print('Error ditangani pemanggil')
    print('Buffer tertutup:', catatan.buffer.closed)
