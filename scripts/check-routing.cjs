const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm'),ts=require('typescript');
const js=ts.transpileModule(fs.readFileSync('lib/routing-lab.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const mod={exports:{}};vm.runInNewContext(js,{exports:mod.exports,module:mod});
const {defaultRoutingConfig:config,simulateRouting:run,pcs}=mod.exports;
// Every ordered pair works with complete routes, including both local LANs.
for(const a of Object.keys(pcs))for(const b of Object.keys(pcs))if(a!==b){const r=run(a,b,config());assert.equal(r.success,true,`${a} -> ${b}`);assert.equal(r.requestReached,true);assert.ok(r.steps.some(s=>s.phase==='Balasan'));for(const s of r.steps){assert.equal(s.source,s.phase==='Permintaan'?pcs[a].ip:pcs[b].ip);assert.equal(s.destination,s.phase==='Permintaan'?pcs[b].ip:pcs[a].ip);}}
let c=config();let r=run('a1','b1',c);assert.equal(r.steps.length,10);assert.equal(r.steps[0].nextHop,'192.168.10.1');assert.equal(r.steps[2].nextHop,'10.10.10.2');assert.equal(r.steps[7].nextHop,'10.10.10.1');
c=config();c.routes.r1.enabled=false;r=run('a1','b1',c);assert.equal(r.success,false);assert.equal(r.requestReached,false);assert.equal(r.steps.at(-1).to,'r1');
c=config();c.routes.r2.enabled=false;r=run('a1','b1',c);assert.equal(r.success,false);assert.equal(r.requestReached,true);assert.equal(r.steps.at(-1).phase,'Balasan');assert.equal(r.steps.at(-1).to,'r2');
c=config();c.gateways.b1='';r=run('a1','b1',c);assert.equal(r.requestReached,true);assert.equal(r.success,false);assert.equal(r.steps.at(-1).to,'b1');
c=config();c.routes.r1.nextHop='10.10.10.1';r=run('a1','b1',c);assert.equal(r.requestReached,false);assert.ok(r.steps.at(-1).message.includes('sendiri'));
c=config();c.routes.r2.nextHop='10.10.10.9';r=run('a1','b1',c);assert.equal(r.requestReached,true);assert.equal(r.success,false);
c=config();c.gateways.a1='192.168.20.1';r=run('a1','b1',c);assert.equal(r.steps.length,1);assert.equal(r.success,false);
c=config();c.gateways.a1='';c.gateways.a2='';c.routes.r1.enabled=false;c.routes.r2.enabled=false;r=run('a1','a2',c);assert.equal(r.success,true);assert.equal(r.steps.length,4);assert.ok(r.steps.every(s=>s.from!=='r1'&&s.to!=='r1'&&s.from!=='r2'&&s.to!=='r2'));
assert.equal(run('a1','a1',config()).success,false);assert.notStrictEqual(config().routes,config().routes);
console.log('PASS: all 12 PC pairs, gateway/next-hop roles, unchanged destination IP, independent return path, missing route, self/unreachable next hop and local LAN bypass');
