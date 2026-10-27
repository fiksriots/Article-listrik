import fs from 'node:fs';
import assert from 'node:assert/strict';

const path = '/jaringan/troubleshooting';
const page = fs.readFileSync(`.next/server/app${path}.html`, 'utf8');
assert.equal((page.match(/<h1\b/g) || []).length, 1);
assert.ok(page.includes('https://article.fikss.site/jaringan/troubleshooting'));
for (const id of ['pemeriksaan-dasar', 'kasus-gangguan', 'alat-dan-pemulihan', 'pendalaman-routing']) {
  assert.ok(page.includes(`id="${id}"`), `Missing group: ${id}`);
  assert.ok(page.includes(`href="#${id}"`), `Broken group navigation: ${id}`);
}
const main = page.match(/<main\b[^>]*>.*?<\/main>/s)[0];
const links = [...main.matchAll(/href="(\/jaringan\/[^"#]+)"/g)].map(match => match[1]);
for (const href of new Set(links)) assert.ok(fs.existsSync(`.next/server/app${href}.html`), `Broken material link: ${href}`);
assert.ok(links.includes('/jaringan/flapping-jaringan'));
const home = fs.readFileSync('.next/server/app/jaringan.html', 'utf8');
assert.ok(home.includes('href="/jaringan/troubleshooting"'));
const article = fs.readFileSync('.next/server/app/jaringan/flapping-jaringan.html', 'utf8');
assert.ok(article.includes('href="/jaringan/troubleshooting"'));
const header = page.match(/<header\b[^>]*class="academy-header[^>]*>.*?<\/header>/s)[0];
assert.ok(header.includes('Troubleshooting'));
assert.ok(header.includes('href="/jaringan/troubleshooting"'));
console.log(`PASS: dedicated troubleshooting hub, four groups, ${new Set(links).size} valid material/curriculum links, header menu, homepage entry and article return link.`);
