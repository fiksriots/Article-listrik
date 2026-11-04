def minimum_koin(koin,target):
    if type(target) is not int or not 0<=target<=10000 or not koin or any(type(x) is not int or x<=0 for x in koin):
        raise ValueError('Koin positif, target 0..10000.')
    dp=[None]*(target+1);dp[0]=0
    for total in range(1,target+1):
        kandidat=[dp[total-k]+1 for k in set(koin) if k<=total and dp[total-k] is not None]
        dp[total]=min(kandidat) if kandidat else None
    return dp[target]

if __name__=='__main__':
    print('Minimum untuk 6:',minimum_koin([1,3,4],6))
    print('Tidak terjangkau:',minimum_koin([4],6))
    print('Target nol:',minimum_koin([1,3,4],0))
