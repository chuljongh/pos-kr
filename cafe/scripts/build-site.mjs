import { readdir, mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const files = ['index.html', 'robots.txt', 'sitemap.xml', 'favicon.webp'];
async function collect(directory) {
    for (const entry of await readdir(path.join(root, directory), { withFileTypes: true })) {
        const relative = `${directory}/${entry.name}`;
        if (entry.isDirectory()) await collect(relative);
        else if (/\.(?:webp|png|jpe?g|gif|svg|ico|css|js)$/i.test(entry.name) && entry.name !== 'input.css') files.push(relative);
    }
}
for (const directory of ['css', 'images', 'js']) await collect(directory);
for (const file of files) {
    const destination = path.join(root, 'public', file);
    await mkdir(path.dirname(destination), { recursive: true });
    await copyFile(path.join(root, file), destination);
}
console.log(`Published ${files.length} cafe service files.`);
