// Exercise the published dashboard code with SDK/DOM substitutes, without a cloud project.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const lessons = JSON.parse(fs.readFileSync('lib/iot-connected-lessons.json', 'utf8'));
const code = lessons.find(l => l.slug === 'firebase-dashboard').lab.blocks.find(b => b.language === 'javascript').code;
const elements = Object.fromEntries(['login','logout','email','password','submit','status','temperature','kind','freshness','timestamp'].map(id => [id, { textContent:'', value:'', hidden:false, disabled:false, events:{}, addEventListener(type, fn) { this.events[type] = fn; } }]));
let authChanged, receive, denied, tick, unsubscribed=0;
const now=1792422000000;
class Clock extends Date { static now() { return now; } }
const sandbox = {
 document:{ getElementById:id=>elements[id] }, Date:Clock,
 initializeApp:()=>({}), getAuth:()=>({}), getDatabase:()=>({}),
 signInWithEmailAndPassword:async()=>({}), signOut:async()=>authChanged(null),
 onAuthStateChanged:(_,fn)=>{authChanged=fn;},
 ref:(_,path)=>{assert.equal(path,'devices/esp32-01/latest');return path;},
 onValue:(_,ok,error)=>{receive=ok;denied=error;return ()=>{unsubscribed++;};},
 setInterval:fn=>{tick=fn;return 1;}
};
vm.runInNewContext(code.replace(/^import .*;\n/gm,''),sandbox);
authChanged({uid:'reader'});
receive({val:()=>({deviceId:'esp32-01',temperature:29.4,unit:'C',simulated:true,receivedAt:now-5000})});
assert.equal(elements.temperature.textContent,'29.4 °C');
assert.match(elements.kind.textContent,/SIMULASI/);
assert.match(elements.freshness.textContent,/Data baru/);
receive({val:()=>({deviceId:'esp32-01',temperature:29.4,unit:'C',simulated:true,receivedAt:now-25000})});
tick();assert.match(elements.freshness.textContent,/Data lama: 25 detik/);
authChanged(null);
assert.equal(unsubscribed,1);assert.equal(elements.temperature.textContent,'—');assert.equal(elements.logout.hidden,true);
authChanged({uid:'other'});denied();assert.match(elements.status.textContent,/ditolak/);assert.equal(elements.temperature.textContent,'—');
receive({val:()=>({deviceId:'esp32-01',temperature:'panas',unit:'C',simulated:true,receivedAt:now})});
assert.equal(elements.temperature.textContent,'—');
console.log('PASS: tutorial dashboard handles new/stale data, simulation label, logout cleanup, permission denial, and invalid values. SDK/DOM are mocked.');
