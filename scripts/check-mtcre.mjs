import fs from 'node:fs';
import assert from 'node:assert/strict';
const all=JSON.parse(fs.readFileSync('lib/network-lessons.json','utf8'));
const lessons=all.filter(l=>l.mtcre);
assert.equal(lessons.length,20);
assert.deepEqual(lessons.map(l=>l.mtcre),Array.from({length:20},(_,i)=>i+1));
const landing=fs.readFileSync('.next/server/app/jaringan/mtcre.html','utf8');
for(const l of lessons){
 assert.ok(l.practice.length>=5&&l.sourcePages&&l.source.startsWith('https://'));
 assert.ok(landing.includes('/jaringan/'+l.slug),`Missing roadmap link ${l.slug}`);
 const page=fs.readFileSync(`.next/server/app/jaringan/${l.slug}.html`,'utf8');
 assert.ok(page.includes('MTCRE.pdf')&&page.replace(/<!--.*?-->/gs,'').includes('halaman '+l.sourcePages));
 assert.ok(page.includes(`/network/${l.slug}.svg`));
 assert.ok(page.includes('Cek pemahaman')&&page.includes('Praktik lab langkah demi langkah'));
}
const api=JSON.parse(fs.readFileSync('.next/server/app/api/articles.body','utf8'));
assert.ok(api.items.length>=112);
assert.equal(new Set(api.items.map(i=>i.id)).size,api.items.length);
for(const l of lessons)assert.ok(api.items.some(i=>i.slug===l.slug));
console.log('PASS: 20 MTCRE routes rendered, roadmap links, page references, illustrations, labs, self-checks, and unique portfolio feed entries');
