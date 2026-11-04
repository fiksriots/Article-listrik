import argparse
import json
import os
from .core import konfigurasi
from .pipeline import buat_laporan, rencanakan
from .web import buat_server

def main():
    parser = argparse.ArgumentParser(description='Lab laporan layanan fiktif')
    commands = parser.add_subparsers(dest='command', required=True)
    build = commands.add_parser('build-report')
    build.add_argument('--input', required=True)
    build.add_argument('--db', required=True)
    build.add_argument('--output', required=True)
    build.add_argument('--dry-run', action='store_true', help='Validasi dan hitung tanpa menulis database atau JSON')
    serve = commands.add_parser('serve')
    serve.add_argument('--db', required=True)
    serve.add_argument('--host', default='127.0.0.1')
    serve.add_argument('--port', type=int, default=8000)
    args = parser.parse_args()
    try:
        if args.command == 'build-report':
            limit = konfigurasi(os.environ)
            if args.dry_run:
                summary = rencanakan(args.input,args.db,args.output,limit)
                print(json.dumps({'dry_run':True,'ringkasan':summary},sort_keys=True))
            else:
                summary = buat_laporan(args.input,args.db,args.output,limit)
                print(json.dumps(summary,sort_keys=True))
        else:
            if not 0 <= args.port <= 65535:
                raise ValueError('Port di luar rentang.')
            with buat_server(args.db,args.host,args.port) as server:
                print('Dashboard lab:',server.server_address,flush=True)
                try:server.serve_forever()
                except KeyboardInterrupt:pass
    except (ValueError,OSError) as exc:
        parser.exit(2,'Gagal: '+str(exc)+'\n')

if __name__=='__main__':main()
