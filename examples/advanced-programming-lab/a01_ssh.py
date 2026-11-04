from io import BytesIO

def baca_identitas(client):
    # Perintah tetap untuk VM Linux lab; bukan perintah universal semua router.
    stdin,stdout,stderr=client.exec_command('uname -s',timeout=3)
    try:
        raw=stdout.read(257);error=stderr.read(257)
        if len(raw)>256 or error:raise ValueError('Respons SSH tidak sesuai batas lab.')
        if stdout.channel.recv_exit_status()!=0:raise ValueError('Perintah gagal.')
        return raw.decode('utf-8').strip()
    finally:
        stdin.close();stdout.close();stderr.close()

def hubungkan_lab(host,port,username,key_filename,known_hosts):
    if host not in {'127.0.0.1','::1'} or type(port) is not int or not 1<=port<=65535:
        raise ValueError('Hanya endpoint loopback lab yang ditentukan.')
    import paramiko  # Dependensi opsional, diperlukan saat koneksi nyata.
    with paramiko.SSHClient() as client:
        client.load_host_keys(known_hosts)
        client.set_missing_host_key_policy(paramiko.RejectPolicy())
        client.connect(hostname=host,port=port,username=username,key_filename=key_filename,
                       allow_agent=False,look_for_keys=False,timeout=3,banner_timeout=3,auth_timeout=3)
        return baca_identitas(client)

class SSHSimulasi:
    def exec_command(self,command,timeout):
        assert command=='uname -s' and timeout==3
        output=BytesIO(b'Linux\n')
        output.channel=type('Channel',(),{'recv_exit_status':lambda self:0})()
        return BytesIO(),output,BytesIO()

if __name__=='__main__':
    print('Identitas simulasi:',baca_identitas(SSHSimulasi()))
    print('Tidak membuka koneksi SSH; host key lab nyata wajib diverifikasi')
