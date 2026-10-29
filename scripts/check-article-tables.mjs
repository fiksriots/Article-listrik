import fs from 'node:fs';
import assert from 'node:assert/strict';
import matter from 'gray-matter';
import {createProcessor} from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
const parser=createProcessor({remarkPlugins:[[remarkGfm,{singleTilde:false}]]});
const inventory=[];let audited=0;
function tables(node,result=[]){if(node.type==='table')result.push(node);for(const child of node.children||[])tables(child,result);return result;}
for(const file of fs.readdirSync('content/materi').filter(f=>f.endsWith('.mdx'))){
 audited++;const slug=file.slice(0,-4),doc=matter(fs.readFileSync('content/materi/'+file,'utf8'));
 const parsed=tables(parser.parse(doc.content));
 const html=fs.readFileSync('.next/server/app/materi/'+slug+'.html','utf8');
 const article=html.match(/<article class="lesson-article">([\s\S]*?)<\/article>/)?.[1];assert.ok(article,slug+' article');
 const rendered=[...article.matchAll(/<div class="article-table-scroll"[^>]*><table[^>]*>([\s\S]*?)<\/table>/g)].map(m=>m[1]);
 assert.ok(rendered.length>=parsed.length,slug+': markdown tables must render as real tables');
 assert.ok(!/\|\s*:?-{3,}:?\s*\|/.test(article.replace(/<pre[\s\S]*?<\/pre>/g,'')),slug+': raw table delimiter leaked');
 for(const table of parsed){assert.ok(table.children.length>=2,slug+': header and data');const columns=table.children[0].children.length;for(const row of table.children)assert.equal(row.children.length,columns,slug+': inconsistent columns');}
 if(parsed.length){for(const table of rendered){assert.match(table,/<thead>/);assert.match(table,/<tbody>/);assert.match(table,/<th(?:\s|>)/);assert.match(table,/<td(?:\s|>)/);}inventory.push({slug,tables:parsed.length});}
}
const capstone=fs.readFileSync('.next/server/app/materi/proyek-akhir-rak-jaringan.html','utf8').match(/<article class="lesson-article">([\s\S]*?)<\/article>/)[1];
assert.match(capstone,/<th[^>]*>Beban latihan<\/th>/);assert.match(capstone,/<td[^>]*>Router<\/td>/);assert.match(capstone,/<td[^>]*>10 W DC<\/td>/);
console.log(`PASS: all ${audited} articles audited; ${inventory.length} articles with ${inventory.reduce((n,p)=>n+p.tables,0)} Markdown tables render semantic headers/cells without raw delimiters`);
fs.writeFileSync('/tmp/article-table-inventory.json',JSON.stringify(inventory));
