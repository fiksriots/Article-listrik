const ts=require('typescript'),fs=require('fs'),assert=require('node:assert/strict');
const source=fs.readFileSync('lib/ospf-lab.ts','utf8');const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const mod={exports:{}};new Function('exports','module',compiled)(mod.exports,mod);const {initialLinks,calculatePaths,bestPaths}=mod.exports;
const costs=(c)=>initialLinks.map((l,i)=>({...l,cost:c[i]}));
assert.deepEqual(bestPaths(calculatePaths(initialLinks)).map(p=>p.routers),[['R1','R2','R4']]);
assert.equal(calculatePaths(initialLinks)[0].total,30);
assert.equal(bestPaths(calculatePaths(costs([10,10,10,10]))).length,2);
assert.equal(bestPaths(calculatePaths(costs([35,10,20,20])))[0].routers[1],'R3');
assert.equal(bestPaths(calculatePaths(initialLinks.map(l=>({...l,up:l.id!=='r2-r4'}))))[0].total,50);
assert.equal(calculatePaths(initialLinks.map(l=>({...l,up:l.b!=='R4'}))).length,0);
assert.equal(calculatePaths(initialLinks,'R1','R4',20)[0].total,40);
assert.equal(calculatePaths(initialLinks,'R4','R1')[0].total,30);
assert.throws(()=>calculatePaths(costs([0,10,10,10])));
assert.throws(()=>calculatePaths(costs([1.5,10,10,10])));
assert.throws(()=>calculatePaths(initialLinks,'R1','R4',65536));
// Exhaust all sixteen link-failure combinations against two independent path sums.
for(let mask=0;mask<16;mask++){const links=initialLinks.map((l,i)=>({...l,up:!!(mask&(1<<i))}));const expected=[];if(links[0].up&&links[1].up)expected.push(30);if(links[2].up&&links[3].up)expected.push(50);assert.deepEqual(calculatePaths(links).map(p=>p.total),expected);}
console.log('PASS OSPF: all 16 failure combinations, cost change, ECMP, LAN cost, reverse paths and invalid inputs');
