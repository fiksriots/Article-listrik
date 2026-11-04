def pembuat_batas(minimum):
    def memenuhi(nilai):
        return nilai>=minimum
    return memenuhi

def pengali_benar():
    return [lambda x,n=n:x*n for n in range(3)]

if __name__=='__main__':
    lulus=pembuat_batas(75)
    print('74/75:',lulus(74),lulus(75))
    print('Binding tiap iterasi:',[fungsi(10) for fungsi in pengali_benar()])
