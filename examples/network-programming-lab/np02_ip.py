from ipaddress import ip_address, ip_network

def validasi_endpoint(alamat, port):
    ip = ip_address(alamat)
    if isinstance(port, bool) or not isinstance(port, int) or not 1 <= port <= 65535:
        raise ValueError('Port tujuan wajib integer 1..65535.')
    return str(ip), port

if __name__ == '__main__':
    print('IPv4:', validasi_endpoint('127.0.0.1', 50501))
    print('IPv6:', validasi_endpoint('::1', 50501))
    print('Dalam subnet:', ip_address('192.0.2.10') in ip_network('192.0.2.0/24'))
