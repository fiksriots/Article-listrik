const ts=require('typescript'),fs=require('fs'),assert=require('node:assert/strict');
const code=ts.transpileModule(fs.readFileSync('lib/failover-lab.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const m={exports:{}};new Function('exports','module',code)(m.exports,m);const {healthyWan,evaluateFailover}=m.exports;
const h=healthyWan;
assert.equal(evaluateFailover(h(),h(),'gateway').selected,'A');
assert.equal(evaluateFailover({...h(),link:false},h(),'gateway').selected,'B');
const upstream={...h(),upstream:false};
assert.deepEqual([evaluateFailover(upstream,h(),'gateway').selected,evaluateFailover(upstream,h(),'gateway').service],['A',false]);
assert.deepEqual([evaluateFailover(upstream,h(),'recursive').selected,evaluateFailover(upstream,h(),'recursive').service],['B',true]);
assert.equal(evaluateFailover({...h(),probe:false},h(),'gateway').selected,'A');
assert.equal(evaluateFailover({...h(),probe:false},h(),'recursive').selected,'B');
const nat=evaluateFailover({...h(),link:false},{...h(),nat:false},'recursive');assert.equal(nat.selected,'B');assert.equal(nat.service,false);
assert.equal(evaluateFailover(upstream,upstream,'recursive').selected,null);
assert.equal(evaluateFailover({...h(),link:false,gateway:true},h(),'gateway').first.gateway,false);
// All 1024 physical/probe/NAT combinations across both methods obey priority and dependencies.
const keys=['link','gateway','upstream','probe','nat'];
for(let mask=0;mask<1024;mask++)for(const mode of ['gateway','recursive']){const a={},b={};keys.forEach((k,i)=>{a[k]=!!(mask&(1<<i));b[k]=!!(mask&(1<<(i+5)))});const r=evaluateFailover(a,b,mode);if(r.selected==='A')assert.ok(r.first.eligible);if(r.selected==='B'){assert.ok(!r.first.eligible);assert.ok(r.second.eligible)}if(!r.selected)assert.equal(r.service,false);if(r.service){const selected=r.selected==='A'?a:b;assert.ok(selected.link&&selected.gateway&&selected.upstream&&selected.nat)}if(!a.link)assert.equal(r.first.probe,false);}
assert.equal(evaluateFailover(h(),h(),'recursive').selected,'A','primary recovered');
console.log('PASS failover: gateway vs upstream failure, probe false failure, missing NAT, recovery and 2048 state/method combinations');
