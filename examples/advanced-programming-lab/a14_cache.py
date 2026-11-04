from collections import OrderedDict
from time import monotonic
import math

class CacheTTL:
    def __init__(self,capacity=2,clock=monotonic):
        if type(capacity) is not int or capacity<1:raise ValueError('Kapasitas positif.')
        self.capacity=capacity;self.clock=clock;self.data=OrderedDict()
    def put(self,key,value,ttl):
        if not isinstance(ttl,(int,float)) or isinstance(ttl,bool) or not math.isfinite(ttl) or ttl<=0:raise ValueError('TTL finite positif.')
        if value is None:raise ValueError('None dipakai sebagai tanda cache miss.')
        now=self.clock()
        for old in list(self.data):
            if self.data[old][0]<=now:self.data.pop(old)
        self.data[key]=(now+ttl,value);self.data.move_to_end(key)
        while len(self.data)>self.capacity:self.data.popitem(last=False)
    def get(self,key):
        if key not in self.data:return None
        end,value=self.data[key]
        if end<=self.clock():self.data.pop(key);return None
        self.data.move_to_end(key);return value
    def invalidate(self,key):self.data.pop(key,None)

if __name__=='__main__':
    now=[0.0];cache=CacheTTL(clock=lambda:now[0])
    cache.put('status','up',ttl=5)
    print('Sebelum kedaluwarsa:',cache.get('status'))
    now[0]=5
    print('Tepat batas TTL:',cache.get('status'))
    cache.put('status','down',ttl=5);cache.invalidate('status')
    print('Sesudah invalidasi:',cache.get('status'))
