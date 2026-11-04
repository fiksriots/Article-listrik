import asyncio

async def echo(reader, writer):
    try:
        data = await asyncio.wait_for(reader.readline(), timeout=2)
        if not data.endswith(b'\n') or len(data) > 100:
            raise ValueError('Butuh satu baris maksimal 100 byte.')
        writer.write(data)
        await writer.drain()
    finally:
        writer.close()
        await writer.wait_closed()

async def main():
    pending = set()
    async def tracked(reader, writer):
        task = asyncio.current_task()
        pending.add(task)
        try:
            await echo(reader, writer)
        finally:
            pending.discard(task)
    server = await asyncio.start_server(tracked, '127.0.0.1', 0, limit=100)
    alamat = server.sockets[0].getsockname()
    async def client(nomor):
        reader, writer = await asyncio.wait_for(asyncio.open_connection(*alamat, limit=100), 2)
        try:
            writer.write(f'pesan-{nomor}\n'.encode('ascii'))
            await writer.drain()
            return (await asyncio.wait_for(reader.readline(), 2)).decode('ascii').strip()
        finally:
            writer.close()
            await writer.wait_closed()
    async with server:
        hasil = await asyncio.gather(*(client(n) for n in range(1, 4)))
    if pending:
        await asyncio.gather(*list(pending))
    return hasil

if __name__ == '__main__':
    print('Balasan async:', asyncio.run(main()))
