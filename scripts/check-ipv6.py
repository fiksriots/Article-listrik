"""Cross-check the IPv6 engine against Python's independent ipaddress implementation."""
import ipaddress,json,random,subprocess,tempfile
from pathlib import Path
random.seed(6)
fixtures=[]
for _ in range(512):
    address=ipaddress.IPv6Address(random.getrandbits(128))
    prefix=random.randrange(129)
    network=ipaddress.IPv6Network((address,prefix),strict=False)
    fixtures.append(dict(address=str(address),prefix=prefix,compressed=address.compressed,expanded=address.exploded,network=str(network.network_address),last=str(network.broadcast_address),count=str(network.num_addresses)))
with tempfile.TemporaryDirectory() as directory:
    fixture=Path(directory)/'fixtures.json'
    fixture.write_text(json.dumps(fixtures))
    subprocess.run(['node',str(Path(__file__).with_suffix('.mjs')),str(fixture)],check=True)
