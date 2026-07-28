import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const llmsText = await readFile(path.join(root, 'public', 'llms.txt'), 'utf8');
const registries = [
  ['services', 'src/content/services.ts'],
  ['case-studies', 'src/content/case-studies.ts'],
  ['insights', 'src/content/insights.ts'],
  ['products', 'src/content/products.ts'],
];

const missing = [];
for (const [section, relativePath] of registries) {
  const source = await readFile(path.join(root, relativePath), 'utf8');
  const slugs = [...source.matchAll(/\bslug:\s*['"]([^'"]+)['"]/g)].map((match) => match[1]);
  for (const slug of slugs) {
    const pathname = `/${section}/${slug}`;
    if (!llmsText.includes(`https://www.codingbullz.com${pathname}`)) missing.push(pathname);
  }
}

if (missing.length) {
  console.error(`llms.txt is missing ${missing.length} public content URL(s):`);
  missing.forEach((pathname) => console.error(`  - ${pathname}`));
  process.exit(1);
}

console.log('✓ llms.txt contains every static service, case study, insight, and product URL');
