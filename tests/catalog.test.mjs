import { readFileSync, readdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { resolve } from "node:path";
import assert from "node:assert/strict";
import test from "node:test";

const root = new URL("../", import.meta.url);
const catalog = JSON.parse(readFileSync(new URL("catalog.json", root)));
test("catalog paths, package identities and declarative-only contents", () => {
  assert.equal(catalog.schemaVersion, 1);
  assert.equal(new Set(catalog.apps.map((a) => a.id)).size, catalog.apps.length);
  for (const entry of catalog.apps) {
    assert.match(entry.path, /^apps\/[a-z][a-z0-9-]+\/app\.json$/);
    const app = JSON.parse(readFileSync(new URL(entry.path, root)));
    assert.equal(app.id, entry.id);
    assert.equal(app.schemaVersion, 1);
    assert.match(app.version, /^\d+\.\d+\.\d+$/);
    assert.deepEqual(Object.keys(app).sort(), ["schemaVersion", "id", "version", "name", "description", "author", "license", "permissions", "inputs", "sources", "task", "review"].sort());
    assert.ok(app.task.length && app.review.length);
    assert.ok(app.permissions.every((p) => ["public-sources", "draft-actions", "portfolio-read"].includes(p)));
    assert.equal(new Set(app.inputs.map((f) => f.key)).size, app.inputs.length);
    for (const source of app.sources) { assert.equal(new URL(source.url).protocol, "https:"); assert.ok(app.permissions.includes("public-sources")); }
    assert.deepEqual(readdirSync(new URL(entry.path.replace("app.json", ""), root)).filter((p) => /\.(js|mjs|py|sh|sqlite|db)$/.test(p)), []);
  }
});

test("optional integration: packages satisfy the actual Bees host contract", { skip: !process.env.BEES_DESKTOP_DIR }, async () => {
  const { pathToFileURL } = await import("node:url");
  const contract = await import(pathToFileURL(resolve(process.env.BEES_DESKTOP_DIR, "dsh-runtime/plugin/lib/app-contract.js")));
  for (const entry of catalog.apps) contract.validateApp(JSON.parse(readFileSync(new URL(entry.path, root))));
});

test('publish artifact contains reviewed apps and checksum-addressed packages only', () => {
  const output = mkdtempSync(resolve(tmpdir(), 'bees-catalog-test-'));
  try {
    execFileSync(process.execPath, [new URL('../scripts/publish-catalog.mjs', import.meta.url).pathname, output]);
    const published = JSON.parse(readFileSync(resolve(output, 'catalog.json')));
    assert.equal(published.apps.length, catalog.apps.filter((a) => ['first-party-preview', 'community-reviewed'].includes(a.status)).length);
    for (const entry of published.apps) {
      assert.equal(entry.path, `packages/${entry.sha256}.json`);
      const bytes = readFileSync(resolve(output, entry.path));
      assert.equal(createHash('sha256').update(bytes).digest('hex'), entry.sha256);
      const manifest = JSON.parse(bytes);
      for (const key of ['id', 'version', 'permissions', 'sources']) assert.deepEqual(entry[key], manifest[key]);
    }
    assert.deepEqual(readdirSync(output).sort(), ['catalog.json', 'packages']);
  } finally { rmSync(output, { recursive: true }); }
});
