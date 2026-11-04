import cProfile,pstats,tracemalloc
from pathlib import Path

def olah(n):
    return sum(x*x for x in range(n))

if __name__=='__main__':
    folder=Path('hasil-latihan');folder.mkdir(exist_ok=True)
    profiler=cProfile.Profile();tracemalloc.start()
    result=profiler.runcall(olah,10000)
    _,peak=tracemalloc.get_traced_memory();tracemalloc.stop()
    profiler.dump_stats(folder/'profil.prof')
    stats=pstats.Stats(profiler)
    print('Checksum:',result)
    print('Ada panggilan tercatat:',stats.total_calls>0)
    print('Peak alokasi Python teramati:',peak>0)
    print('Profil: hasil-latihan/profil.prof')
