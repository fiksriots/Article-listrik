from functools import wraps

def hitung_panggilan(function):
    @wraps(function)
    def wrapper(*args,**kwargs):
        wrapper.calls+=1
        return function(*args,**kwargs)
    wrapper.calls=0
    return wrapper

@hitung_panggilan
def tambah(a:int,b:int)->int:
    """Jumlah dua bilangan."""
    return a+b

if __name__=='__main__':
    print('Hasil:',tambah(2,b=3))
    print('Panggilan:',tambah.calls)
    print('Nama dipertahankan:',tambah.__name__)
    print('Fungsi asli:',tambah.__wrapped__(1,2))
