import traceback

def rasio_lama(ok,total):
    return ok/total

def rasio_baru(ok,total):
    return ok/total if total else None

if __name__=='__main__':
    try:
        rasio_lama(0,0)
    except ZeroDivisionError as exc:
        frame=traceback.extract_tb(exc.__traceback__)[-1]
        print('Jenis:',type(exc).__name__)
        print('Fungsi:',frame.name)
    print('Kontrak kosong:',rasio_baru(0,0))
# Untuk sesi interaktif saja, tambahkan breakpoint() sebelum pemanggilan.
# Gunakan p nama_variabel, n, s, c, dan q pada pdb; jangan sisakan di CI.
