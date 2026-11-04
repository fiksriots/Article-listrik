from typing import Sequence,TypeVar
T=TypeVar('T')

def pertama(items:Sequence[T])->T:
    if not items:raise ValueError('Urutan kosong.')
    return items[0]

if __name__=='__main__':
    print('Integer:',pertama([3,4]))
    print('Teks:',pertama(['radio','kabel']))
    print('Anotasi tidak menggantikan validasi runtime')
