from queue import Queue
from threading import Thread

class RetryableError(Exception):pass

def kerjakan(tasks,handler,max_attempts=2):
    if type(max_attempts) is not int or not 1<=max_attempts<=3:raise ValueError('Percobaan 1..3.')
    if len(tasks)>20 or any(not isinstance(t,str) or not t for t in tasks) or len(set(tasks))!=len(tasks):
        raise ValueError('Maksimal 20 ID unik terisi.')
    queue=Queue(maxsize=2);success=[];dead=[]
    def worker():
        while True:
            task=queue.get()
            try:
                if task is None:return
                for attempt in range(1,max_attempts+1):
                    try:
                        handler(task);success.append(task);break
                    except Exception as exc:
                        if not isinstance(exc,RetryableError) or attempt==max_attempts:
                            dead.append({'id':task,'attempts':attempt,'error':type(exc).__name__});break
            finally:queue.task_done()
    thread=Thread(target=worker);thread.start()
    for task in tasks:queue.put(task)
    queue.put(None);queue.join();thread.join()
    return success,dead

if __name__=='__main__':
    attempts={}
    def handler(task):
        attempts[task]=attempts.get(task,0)+1
        if task=='ulang' and attempts[task]==1:raise RetryableError()
        if task=='rusak':raise ValueError('data invalid')
    success,dead=kerjakan(['baik','ulang','rusak'],handler)
    print('Selesai:',success)
    print('Dead letter:',dead)
    print('Percobaan ulang:',attempts['ulang'])
    print('Antrean memori; bukan broker persisten')
