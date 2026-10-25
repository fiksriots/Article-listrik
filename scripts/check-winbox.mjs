import assert from 'node:assert/strict';
import fs from 'node:fs';

const lessons = JSON.parse(fs.readFileSync('lib/winbox-lessons.json', 'utf8'));
const base = '/jaringan/winbox';
const parent = fs.readFileSync(`.next/server/app${base}.html`, 'utf8');
assert.equal(lessons.length, 23);
for (const slug of ['persiapan', 'menu-winbox', 'interfaces', 'bridge', 'menu-ip', 'rencana-jaringan', 'praktik-internet', 'wan-static-pppoe', 'dhcp-dns', 'firewall-nat', 'routing-dua-router', 'monitoring-pemulihan', 'simple-queues', 'troubleshooting', 'latihan']) assert.ok(lessons.some(item => item.slug === slug), `Existing progress key must remain: ${slug}`);
assert.deepEqual([...new Set(lessons.map(item => item.phase))], [0,1,2,3,4,5,6,7]);
assert.equal(new Set(lessons.map(item => item.slug)).size, lessons.length);
assert.ok(parent.includes('id="submateri-winbox"'));
const home = fs.readFileSync('.next/server/app/jaringan.html', 'utf8');
assert.ok(home.includes('href="/jaringan/winbox"'), 'Winbox needs its own learning-path entry');
assert.ok(parent.includes('PRAKTIK WINBOX / KURIKULUM BELAJAR'));
const redirects = JSON.parse(fs.readFileSync('.next/routes-manifest.json', 'utf8')).redirects;
assert.ok(redirects.some(rule => rule.source === '/jaringan/mikrotik-winbox/:topic' && rule.destination === '/jaringan/winbox/:topic' && rule.statusCode === 308), 'Legacy sublesson URLs must redirect');
const intro = fs.readFileSync('.next/server/app/jaringan/mikrotik-winbox.html', 'utf8');
assert.ok(intro.includes('Buka Praktik Winbox'));
assert.ok(!intro.includes('class="winbox-outline"'), 'Intro must link to the standalone path');

const localRoutes = new Set(lessons.map(item => `${base}/${item.slug}`));
let pictures = 0;
for (const [index, item] of lessons.entries()) {
  const path = `${base}/${item.slug}`;
  const html = fs.readFileSync(`.next/server/app${path}.html`, 'utf8');
  assert.ok(parent.includes(`href="${path}"`), `Parent must link to ${path}`);
  assert.ok(html.includes(item.title), `Missing heading for ${item.slug}`);
  assert.ok(html.includes(`https://article.fikss.site${path}`), `Missing canonical for ${item.slug}`);
  assert.ok(html.includes('Tandai sudah dibaca'));
  assert.ok(item.html.includes('Hasil yang diperiksa'), `Missing observable outcome for ${item.slug}`);
  assert.ok(item.html.includes('Jika perlu kembali ke kondisi awal'), `Missing recovery for ${item.slug}`);
  assert.ok(item.html.includes('Daftar isi submateri ini'), `Missing chapter navigation for ${item.slug}`);
  assert.ok(index === 0 || item.phase >= lessons[index - 1].phase, 'Phases must follow learning order');
  const previous = lessons[index - 1];
  const next = lessons[index + 1];
  if (previous) assert.ok(html.includes(`href="${base}/${previous.slug}"`));
  if (next) assert.ok(html.includes(`href="${base}/${next.slug}"`));
  assert.ok(!/\bon[a-z]+\s*=|<script\b|<iframe\b|data:image\//i.test(item.html), `Inline code or unextracted image in ${item.slug}`);
  const ids = [...item.html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size, `Duplicate local ID in ${item.slug}`);
  for (const [, target] of item.html.matchAll(/href="#([^"]+)"/g)) {
    assert.ok(ids.includes(target), `Broken local anchor #${target} in ${item.slug}`);
  }
  for (const [, target] of item.html.matchAll(/href="(\/jaringan\/winbox\/[^"#]+)"/g)) {
    assert.ok(localRoutes.has(target), `Broken sublesson link ${target}`);
  }
  for (const [, target] of item.html.matchAll(/(?:src|href)="(\/network\/winbox\/[^"#]+)"/g)) {
    assert.ok(fs.existsSync(`public${target}`), `Missing image ${target}`);
    pictures++;
  }
}
const practice = lessons.find(item => item.slug === 'praktik-internet').html;
assert.equal((practice.match(/class="step"/g) || []).length, 14);
assert.equal((practice.match(/screenshot step-shot/g) || []).length, 15);
assert.ok(lessons.find(item => item.slug === 'interfaces').html.includes('Praktik C'));
for (const slug of ['vlan-access-trunk', 'firewall-antar-vlan', 'pcq-bandwidth', 'failover-dua-isp-winbox', 'wireguard-remote-winbox', 'keamanan-akses-router', 'troubleshooting-kasus-nyata', 'proyek-kantor-kecil']) {
  const chapter = lessons.find(item => item.slug === slug);
  assert.ok(chapter, `Missing advanced chapter: ${slug}`);
  assert.ok(chapter.html.includes('Diagram topologi lab'), `Missing topology for ${slug}`);
  assert.ok(chapter.html.includes('<table>'), `Missing configuration/evidence table for ${slug}`);
}
console.log(`PASS: ${lessons.length} Winbox sublessons, parent catalogue, canonical URLs, previous/next links, ${pictures} image references, 14 illustrated practice steps, and local anchors.`);
