import io
import json
import logging
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch
from urllib.error import HTTPError
from urllib.request import Request,build_opener,ProxyHandler
from a01_ssh import baca_identitas,SSHSimulasi,hubungkan_lab
from a02_api import baca_api
from a03_snmp import ringkas_varbind,delta_counter32,SYSNAME,OPER
from a04_closure import pembuat_batas,pengali_benar
from a05_decorator import hitung_panggilan
from a06_typing import pertama
from a07_greedy import greedy
from a08_backtracking import pilih_jumlah
from a09_dp import minimum_koin
from a13_load import nearest_rank,ukur
from a14_cache import CacheTTL
from a15_queue import kerjakan,RetryableError
from lab_web import server_lab

class AdvancedLab(unittest.TestCase):
    def test_ssh_simulasi_dan_scope(self):
        self.assertEqual(baca_identitas(SSHSimulasi()),'Linux')
        with self.assertRaises(ValueError):hubungkan_lab('192.0.2.1',22,'lab','key','known')
    def test_ssh_kebijakan_connector(self):
        from types import SimpleNamespace
        calls=[]
        class Client:
            def __enter__(self):return self
            def __exit__(self,*args):calls.append('closed')
            def load_host_keys(self,path):calls.append(('keys',path))
            def set_missing_host_key_policy(self,policy):calls.append(policy)
            def connect(self,**kwargs):calls.append(kwargs)
            def exec_command(self,*args,**kwargs):return SSHSimulasi().exec_command(*args,**kwargs)
        fake=SimpleNamespace(SSHClient=Client,RejectPolicy=lambda:'reject')
        with patch.dict(sys.modules,{'paramiko':fake}):self.assertEqual(hubungkan_lab('127.0.0.1',2222,'lab','key','known'),'Linux')
        self.assertIn('reject',calls);self.assertIn(('keys','known'),calls)
        options=next(x for x in calls if isinstance(x,dict))
        self.assertFalse(options['look_for_keys']);self.assertFalse(options['allow_agent']);self.assertEqual(calls[-1],'closed')
    def test_snmp_counter_dan_tipe(self):
        self.assertEqual(delta_counter32(2**32-2,3,100,110),5)
        self.assertIsNone(delta_counter32(10,20,100,5))
        with self.assertRaises(ValueError):delta_counter32(True,2,3,4)
        rows=[{'oid':SYSNAME,'type':'OctetString','value':'lab'},{'oid':OPER,'type':'Integer','value':2}]
        self.assertEqual(ringkas_varbind(rows),{'nama':'lab','status':'down'})
        with self.assertRaises(ValueError):ringkas_varbind(rows+rows)
    def test_closure_isolasi(self):
        self.assertTrue(pembuat_batas(2)(2));self.assertFalse(pembuat_batas(3)(2))
        self.assertEqual([f(7) for f in pengali_benar()],[0,7,14])
    def test_decorator_kembalian_dan_exception(self):
        @hitung_panggilan
        def bagi(a,b):return a/b
        self.assertEqual(bagi(6,b=2),3)
        with self.assertRaises(ZeroDivisionError):bagi(1,0)
        self.assertEqual(bagi.calls,2);self.assertEqual(bagi.__name__,'bagi')
    def test_generic_kosong(self):
        self.assertEqual(pertama(('a','b')),'a')
        with self.assertRaises(ValueError):pertama([])
    def test_greedy_bukan_optimum(self):
        self.assertEqual(greedy([1,3,4],6),[4,1,1]);self.assertIsNone(greedy([4],6))
        self.assertEqual(minimum_koin([1,3,4],6),2)
    def test_backtracking_dengan_oracle_kombinasi(self):
        from itertools import combinations
        values=[1,2,4,7]
        expected=[tuple(c) for n in range(5) for c in combinations(values,n) if sum(c)==8]
        self.assertEqual(sorted(map(tuple,pilih_jumlah(values,8))),sorted(expected))
        with self.assertRaises(ValueError):pilih_jumlah(list(range(1,18)),8)
    def test_dp_dengan_bfs(self):
        from collections import deque
        for coins,target in [([2,5],11),([4,6],7),([1,3,4],9),([2],0)]:
            queue=deque([(0,0)]);seen={0};expected=None
            while queue:
                value,count=queue.popleft()
                if value==target:expected=count;break
                for coin in coins:
                    new=value+coin
                    if new<=target and new not in seen:seen.add(new);queue.append((new,count+1))
            self.assertEqual(minimum_koin(coins,target),expected)
    def test_cache_ttl_lru_dan_invalidation(self):
        clock=[0.];cache=CacheTTL(2,lambda:clock[0])
        cache.put('a',1,5);cache.put('b',2,5);self.assertEqual(cache.get('a'),1)
        cache.put('c',3,5);self.assertIsNone(cache.get('b'))
        clock[0]=5;self.assertIsNone(cache.get('a'))
        cache.invalidate('c');self.assertIsNone(cache.get('c'))
        for ttl in [0,float('nan'),float('inf')]:
            with self.assertRaises(ValueError):cache.put('x',1,ttl)
    def test_antrean_retry_dan_dead_letter(self):
        attempts={}
        def handle(task):
            attempts[task]=attempts.get(task,0)+1
            if task=='sementara' and attempts[task]<2:raise RetryableError()
            if task=='tetap':raise ValueError()
        success,dead=kerjakan(['sementara','tetap'],handle)
        self.assertEqual(success,['sementara']);self.assertEqual(dead,[{'id':'tetap','attempts':1,'error':'ValueError'}])
        self.assertEqual(attempts,{'sementara':2,'tetap':1})
    def test_antrean_batas_dan_habis_retry(self):
        def fail(task):raise RetryableError()
        success,dead=kerjakan(['a'],fail,max_attempts=2)
        self.assertEqual(success,[]);self.assertEqual(dead[0]['attempts'],2)
        with self.assertRaises(ValueError):kerjakan(['a','a'],fail)
    def test_percentile_dan_scope_beban(self):
        self.assertEqual(nearest_rank([4,1,2,3],.5),2)
        self.assertEqual(nearest_rank([4,1,2,3],.95),4)
        with self.assertRaises(ValueError):ukur('http://192.0.2.1/api/observasi')
    def test_api_nyata_lokal(self):
        opener=build_opener(ProxyHandler({}))
        with server_lab() as root:
            self.assertEqual(baca_api(root),[])
            data=json.dumps({'layanan':'BTS-LAB','hasil':'ok'}).encode()
            with opener.open(Request(root+'/api/observasi',data=data,headers={'Content-Type':'application/json'}),timeout=2) as response:self.assertEqual(response.status,201)
            self.assertEqual(baca_api(root),[{'id':1,'layanan':'BTS-LAB','hasil':'ok'}])
            with opener.open(root,timeout=2) as response:self.assertIn('data-mode="api"',response.read().decode())
    def test_api_error_dan_batas(self):
        opener=build_opener(ProxyHandler({}))
        with server_lab() as root:
            for path,payload,content_type,status in [('/hilang',None,None,404),('/api/observasi',b'{}','application/json',400),('/api/observasi',b'{}','text/plain',415),('/api/observasi',b'X'*2049,'application/json',413)]:
                request=Request(root+path,data=payload,headers={'Content-Type':content_type} if content_type else {})
                with self.assertRaises(HTTPError) as caught:opener.open(request,timeout=2)
                with caught.exception:self.assertEqual(caught.exception.code,status)
            for n in range(20):
                data=json.dumps({'layanan':'lab-'+str(n),'hasil':'ok'}).encode()
                with opener.open(Request(root+'/api/observasi',data=data,headers={'Content-Type':'application/json'}),timeout=2):pass
            with self.assertRaises(HTTPError) as caught:opener.open(Request(root+'/api/observasi',data=data,headers={'Content-Type':'application/json'}),timeout=2)
            with caught.exception:self.assertEqual(caught.exception.code,429)

if __name__=='__main__':unittest.main()
