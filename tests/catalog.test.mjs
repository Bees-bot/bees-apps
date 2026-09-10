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
    assert.ok([1, 2].includes(app.schemaVersion));
    assert.match(app.version, /^\d+\.\d+\.\d+$/);
    const fields = ["schemaVersion", "id", "version", "name", "description", "author", "license", "permissions", "inputs", "sources", "task", "review"];
    if (app.schemaVersion === 2 && app.recordTypes) fields.push("recordTypes");
    assert.deepEqual(Object.keys(app).sort(), fields.sort());
    assert.ok(app.task.length && app.review.length);
    assert.ok(app.task.length <= 16000 && app.review.length <= 4000);
    assert.ok(Buffer.byteLength(JSON.stringify(app)) <= 64 * 1024);
    assert.ok(app.permissions.every((p) => ["public-sources", "draft-actions", "portfolio-read"].includes(p)));
    assert.equal(new Set(app.inputs.map((f) => f.key)).size, app.inputs.length);
    for (const source of app.sources) {
      assert.equal(new URL(source.url).protocol, "https:");
      assert.ok(app.permissions.includes("public-sources"));
      if (source.type === "page") {
        assert.equal(app.schemaVersion, 2);
        assert.ok(source.pathPrefix.startsWith("/"));
        assert.equal(source.queryParam, undefined);
      } else assert.ok(source.queryParam);
    }
    assert.ok((app.recordTypes?.length ?? 0) <= 12);
    assert.equal(new Set((app.recordTypes ?? []).map((type) => type.key)).size, app.recordTypes?.length ?? 0);
    for (const type of app.recordTypes ?? []) {
      assert.match(type.key, /^[a-z][a-z0-9-]{1,63}$/);
      assert.ok(type.label && type.fields.length <= 24);
      assert.equal(new Set(type.fields.map((field) => field.key)).size, type.fields.length);
      for (const field of type.fields) {
        assert.match(field.key, /^[a-z][a-z0-9-]{1,63}$/);
        assert.ok(field.label && ["text", "number", "boolean"].includes(field.type));
        if (field.required !== undefined) assert.equal(typeof field.required, "boolean");
      }
    }
    assert.deepEqual(readdirSync(new URL(entry.path.replace("app.json", ""), root)).filter((p) => /\.(js|mjs|py|sh|sqlite|db)$/.test(p)), []);
  }
});

test("optional integration: packages satisfy the actual Bees host contract", { skip: !process.env.BEES_DESKTOP_DIR }, async () => {
  const { pathToFileURL } = await import("node:url");
  const contract = await import(pathToFileURL(resolve(process.env.BEES_DESKTOP_DIR, "dsh-runtime/plugin/lib/app-contract.js")));
  for (const entry of catalog.apps) contract.validateApp(JSON.parse(readFileSync(new URL(entry.path, root))));
});

test('optional integration: Marketing Operations installs, configures and stores records in the actual host without execution', { skip: !process.env.BEES_DESKTOP_DIR }, async () => {
  const { pathToFileURL } = await import('node:url');
  const { DatabaseSync } = await import('node:sqlite');
  const host = (path) => import(pathToFileURL(resolve(process.env.BEES_DESKTOP_DIR, 'dsh-runtime/plugin/lib', path)));
  const [{ BeesProduct, initializeProductDatabase }, { AgentRuntime }, { AppPlatform }] = await Promise.all([
    host('product.js'), host('agent-runtime.js'), host('app-platform.js'),
  ]);
  const db = new DatabaseSync(':memory:');
  const workspace = mkdtempSync(resolve(tmpdir(), 'bees-marketing-smoke-'));
  try {
    initializeProductDatabase(db);
    const runtime = new AgentRuntime({ on: () => () => undefined, tools: { schemas: () => [] },
      agentPresets: { defaultId: 'standard', mount: async () => undefined } }, db);
    let starts = 0; let sourceRequests = 0;
    const processes = { isAutomatic: () => true, startItem: async () => { starts++; return { status: 'started' }; } };
    const product = new BeesProduct(db, runtime, processes, workspace);
    const apps = new AppPlatform(product, async () => { sourceRequests++; throw new Error('No live sources in the smoke test'); });
    runtime.apps = apps;
    const workspaceId = db.prepare('SELECT id FROM workspaces LIMIT 1').get().id;
    const manifest = JSON.parse(readFileSync(new URL('apps/marketing-operations/app.json', root)));
    const installed = await apps.command({ action: 'install', workspaceId, manifest });
    assert.equal(installed.schedulesCreated, 0);
    assert.equal(installed.agentIds.length, 2);
    assert.equal(starts, 0, 'installation must not start work');
    assert.deepEqual(db.prepare('SELECT name, driver FROM stages WHERE process_id=? ORDER BY position').all(installed.processId)
      .map((stage) => [stage.name, stage.driver]), [['Work', 'agent'], ['Review', 'review'], ['Done', 'terminal']]);
    assert.equal(db.prepare('SELECT COUNT(*) AS count FROM stage_routes WHERE stage_id IN (SELECT id FROM stages WHERE process_id=?)').get(installed.processId).count, 2);
    const command = (action, input = {}) => apps.command({ action, workspaceId, installationId: installed.id, ...input });
    await assert.rejects(command('run'), /product/i);
    const config = { product: 'Fictional offline fixture; no real product claims.', goal: 'Verify one local record round-trip.', readiness: 'Unknown; no public invitation.' };
    await command('configure', { config });
    const work = await command('run');
    const context = apps.context(work.id);
    assert.deepEqual(context.config, { ...config, audience: '', 'approved-campaigns': '', queries: '', sender: '' });
    assert.equal(db.prepare('SELECT process_id FROM work_items WHERE id=?').get(work.id).process_id, installed.processId);
    const record = { key: 'fixture-campaign', kind: 'campaign', title: 'Fictional offline test', body: 'Synthetic smoke-test record; not a real campaign.',
      data: { status: 'proposed', category: 'acquisition', objective: 'Verify local record plumbing', audience: 'Fictional fixture audience',
        channel: 'offline-test', 'source-plan': 'No sources; fixture only', qualification: 'No prospects included',
        'success-metric': 'One record round-trip', 'stop-rule': 'Stop after this dry test' } };
    apps.record(context, work.id, record);
    const page = apps.queryRecords(context, { kind: 'campaign', key: record.key });
    assert.equal(page.total, 1);
    assert.deepEqual(page.records[0].data, record.data);
    assert.equal(page.records[0].provenance, 'agent');
    const preview = await command('preview_import', { records: [record] });
    assert.equal(preview.updates, 1);
    assert.equal(preview.approvalsImported, 0);
    await command('import_records', { records: [record], previewDigest: preview.digest });
    assert.equal(apps.queryRecords(context).total, 1);
    assert.equal(apps.queryRecords(context).records[0].provenance, 'user-import');
    const view = apps.snapshot(workspaceId);
    assert.equal(view.sendingEnabled, false);
    assert.deepEqual(view.actions, []);
    assert.equal(db.prepare('SELECT COUNT(*) AS count FROM recurring_work').get().count, 0);
    assert.equal(sourceRequests, 0);
  } finally { db.close(); rmSync(workspace, { recursive: true }); }
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
      for (const key of ['id', 'version', 'schemaVersion', 'permissions', 'sources']) assert.deepEqual(entry[key], manifest[key]);
      assert.deepEqual(entry.recordTypes, manifest.recordTypes);
    }
    assert.deepEqual(readdirSync(output).sort(), ['catalog.json', 'packages']);
  } finally { rmSync(output, { recursive: true }); }
});

test('marketing package declares practical records without seeding private campaign data', () => {
  const app = JSON.parse(readFileSync(new URL('apps/marketing-operations/app.json', root)));
  assert.equal(app.schemaVersion, 2);
  assert.deepEqual(app.permissions, ['public-sources', 'draft-actions']);
  assert.deepEqual(app.recordTypes.map((type) => type.key), ['campaign', 'opportunity', 'idea', 'content', 'action-reference', 'outcome', 'research-summary']);
  const idea = app.recordTypes.find((type) => type.key === 'idea');
  for (const key of ['eli5', 'source-plan', 'manual-steps', 'bees-prompt', 'automation-mode', 'score-rationale', 'success-metric']) {
    assert.equal(idea.fields.find((field) => field.key === key)?.required, true);
  }
  for (const key of ['speed-score', 'cost-score', 'value-score', 'confidence', 'priority-score']) {
    const field = idea.fields.find((field) => field.key === key);
    assert.equal(field.type, 'number');
    assert.notEqual(field.required, true, 'unknown scores must remain absent, not fabricated');
  }
  assert.equal(app.inputs.find((input) => input.key === 'sender')?.required, false);
  assert.equal(app.inputs.some((input) => /csv|password|token|credential|lead-list/.test(input.key)), false);
  assert.equal(app.sources.length, 8);
  assert.deepEqual(app.sources.find((source) => source.key === 'n8n-search'), {
    key: 'n8n-search', label: 'Public n8n Community discussion search',
    url: 'https://community.n8n.io/search.json', queryParam: 'q',
  });
  for (const [key, prefix] of [['n8n-topics', '/t/'], ['n8n-guidelines', '/guidelines'], ['n8n-workflows', '/workflows/']]) {
    assert.equal(app.sources.find((source) => source.key === key)?.pathPrefix, prefix);
  }
  assert.deepEqual(readdirSync(new URL('apps/marketing-operations/', root)), ['app.json']);
  assert.equal(app.records, undefined);
  assert.equal(app.schedules, undefined);
  assert.match(app.task, /generated HN comments as sendable action drafts/);
  assert.match(app.review, /Approval is not delivery/);
});
