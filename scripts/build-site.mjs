// Publish service pages and browser assets only; internal records stay in Git/local storage.
import { readdir, mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'public');
const pages = ['index', 'price', 'proposal', 'cases', 'guide', 'hamba-pos', 'brochure1', 'brochure2', 'privacy', 'terms'];
const files = pages.map(name => `${name}.html`);
files.push('robots.txt', 'sitemap.xml', 'llms.txt', 'bb6039768bc960f80c3c91aaaeb933f1.txt');
const asset = /\.(?:webp|png|jpe?g|gif|svg|ico|css|js)$/i;
for (const entry of await readdir(root, { withFileTypes: true })) {
    if (entry.isFile() && asset.test(entry.name)) files.push(entry.name);
}
async function collect(directory, allowed) {
    for (const entry of await readdir(path.join(root, directory), { withFileTypes: true })) {
        const relative = `${directory}/${entry.name}`;
        if (entry.isDirectory()) await collect(relative, allowed);
        else if (allowed.test(entry.name)) files.push(relative);
    }
}
for (const dir of ['guide', 'cases']) await collect(dir, /\.html$/);
for (const dir of ['assets', 'images', 'css', 'js', 'hamba/css', 'hamba/js', 'hamba/images']) await collect(dir, asset);
for (const file of files) {
    const destination = path.join(output, file);
    await mkdir(path.dirname(destination), { recursive: true });
    await copyFile(path.join(root, file), destination);
}
console.log(`Published ${files.length} service files; no internal documents or development sources.`);
