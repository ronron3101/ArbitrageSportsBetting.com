import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve('.');
const siteBase = '/ArbitrageSportsBetting.com';
const files = [];

function walk(dir) {
  for (const file of readdirSync(dir)) {
    const path = join(dir, file);
    if (statSync(path).isDirectory()) walk(path);
    else if (path.endsWith('.html')) files.push(path);
  }
}

walk(root);
const bad = [];

for (const path of files) {
  const html = readFileSync(path, 'utf8');
  if (!html.includes('<title>')) bad.push(`${path}: missing title`);
  if (!html.includes('Affiliate disclosure')) bad.push(`${path}: missing affiliate disclosure`);

  for (const match of html.matchAll(/href="(\/[^"#]+)"/g)) {
    let href = match[1];
    if (href.startsWith(`${siteBase}/`)) href = href.slice(siteBase.length);
    const originalHref = match[1];
    let target = join(root, href);
    const looksLikeFile = /\.[a-z0-9]+$/i.test(href);
    if (!looksLikeFile && !target.endsWith('/')) target += '/';
    const checkPath = looksLikeFile ? target : join(target, 'index.html');
    try {
      statSync(checkPath);
    } catch {
      bad.push(`${path}: broken internal link ${originalHref}`);
    }
  }
}

if (bad.length) {
  console.error(bad.join('\n'));
  process.exit(1);
}

console.log(`Checked ${files.length} HTML files; no missing titles/disclosures or broken internal links.`);
