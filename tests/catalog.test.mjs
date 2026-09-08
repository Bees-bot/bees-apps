import { readFileSync, readdirSync } from "node:fs";
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
