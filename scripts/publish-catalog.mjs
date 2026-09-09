import { createHash } from 'node:crypto';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Build data for a static HTTPS host. Deployment is a separate, explicit step.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(process.argv[2] ?? resolve(root, 'dist'));
const source = JSON.parse(await readFile(resolve(root, 'catalog.json'), 'utf8'));
const apps = [];
await mkdir(resolve(output, 'packages'), { recursive: true });
for (const entry of source.apps) {
  if (!['first-party-preview', 'community-reviewed'].includes(entry.status)) continue;
  if (entry.path !== `apps/${entry.id}/app.json`) throw new Error('Invalid catalog path');
  const bytes = await readFile(resolve(root, entry.path));
  const manifest = JSON.parse(bytes);
  if (manifest.id !== entry.id || manifest.schemaVersion !== 1) throw new Error('Invalid app package');
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  const path = `packages/${sha256}.json`;
  await writeFile(resolve(output, path), bytes);
  apps.push({ id: manifest.id, version: manifest.version, name: manifest.name,
    description: manifest.description, author: manifest.author, license: manifest.license,
    permissions: manifest.permissions, sources: manifest.sources, schemaVersion: manifest.schemaVersion, path, sha256 });
}
await writeFile(resolve(output, 'catalog.json'), JSON.stringify({ schemaVersion: 1, apps }, null, 2) + '\n');
console.log(`Built ${apps.length} app packages and catalog.json in ${output}`);
