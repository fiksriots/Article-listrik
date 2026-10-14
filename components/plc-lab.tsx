'use client';
import {useState} from 'react';
export default function PlcLab() {
  const [request, setRequest] = useState(false);
  const [sensor, setSensor] = useState(false);
  const [stop, setStop] = useState(false);
  const output = request && sensor && !stop;
  return <section className="panel space-y-5" aria-labelledby="plc-lab-title">
    <div><p className="text-teal-700 font-bold text-sm">LOGIKA PLC VIRTUAL</p><h2 id="plc-lab-title" className="text-2xl font-extrabold">Kapan konveyor boleh bergerak?</h2><p className="muted">Ubah masukan dan lihat bagaimana aturan AND serta NOT menentukan keluaran. Ini model logika sederhana, bukan program keselamatan mesin.</p></div>
    <div className="grid sm:grid-cols-3 gap-3">{[{name:'Permintaan jalan',value:request,set:setRequest},{name:'Sensor barang aktif',value:sensor,set:setSensor},{name:'Perintah berhenti',value:stop,set:setStop}].map(x => <button key={x.name} aria-pressed={x.value} className={'rounded-xl border p-4 text-left '+(x.value?'bg-teal-50 border-teal-600':'bg-slate-50 border-slate-300')} onClick={() => x.set(!x.value)}><span className="font-bold block">{x.name}</span><span>{x.value?'ON · 1':'OFF · 0'}</span></button>)}</div>
    <div className="rounded-xl bg-slate-900 p-5 text-white"><p className="font-mono text-sm break-words">Output = Jalan AND Sensor AND NOT Berhenti</p><p className="mt-3" role="status">Motor virtual: <strong>{output?'ON · konveyor bergerak':'OFF · konveyor diam'}</strong></p><p className="mt-2 text-sm text-slate-300">{output?'Semua syarat terpenuhi.':'Jalan dan sensor harus ON, serta perintah berhenti harus OFF.'}</p></div>
    <p className="text-sm muted">Kontrol nyata memerlukan driver, rating output, interlock, serta rangkaian keselamatan yang sesuai. Urutan scan dan pembaruan I/O bergantung PLC yang digunakan.</p>
    <button className="text-teal-700 font-bold" onClick={() => {setRequest(false);setSensor(false);setStop(false);}}>Reset masukan</button>
  </section>;
}
