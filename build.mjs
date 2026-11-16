import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const template = await readFile(path.join(root, 'src/index.template.html'), 'utf8');
const css = await readFile(path.join(root, 'src/styles.css'), 'utf8');
let app = await readFile(path.join(root, 'src/app.bundle.js'), 'utf8');
app = app.replace(/<\/script/gi, '<\\/script');
const html = template
  .replace('/*__CSS__*/', () => css)
  .replace('//__APP__', () => app);
await writeFile(path.join(root, 'index.html'), html, 'utf8');
console.log(`Built index.html — ${(html.length / 1024).toFixed(1)} KB`);
