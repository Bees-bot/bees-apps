# Bees Apps

Installable, outcome-focused apps for Bees. This repository owns app definitions
and the community contribution contract. Bees owns execution, scheduling, app
storage, permissions and human decisions. No app imports the desktop's internals.

## First apps

| App | Result | Scope |
|---|---|---|
| [Opportunity Scout](apps/opportunity-scout/app.json) | Source-backed public demand signals and appropriate next steps | Hacker News search initially; never requires an uploaded lead CSV |
| [Portfolio Review](apps/portfolio-review/app.json) | Recommendations using the shared goal, results and approval backlog | Read access to other app results in the same workspace; no automatic reallocations |

These are research/draft-only previews, not a working email sender, paid ad
manager, autonomous sales department or a claim of paying customers. No
campaigns, schedules, public messages or paid services are activated by installing.

## Use inside Bees

Requires the desktop app-platform implementation accompanying this repository.
It is not yet in a published Bees release. A source checkout of Bees Desktop with
the changes can build the client and run the app using its normal development steps.

1. Open a **local** team in Bees and choose **Apps**.
2. Choose an `app.json`. Inspect the publisher, version, requested permissions and
   exact public-source endpoints before installing. Only install trusted sources.
3. Enter the short product/audience brief and install. This creates native Bees
   agents, a Work → Review → Done process, and private installation records.
4. Click **Run once**. Inspect progress in the existing work screen and results in
   Apps. Model access must already work in Bees; model costs are not included or capped.
5. After a successful manual run, use Bees' existing schedule controls on the
   work item. The machine and runtime must be available. Installation creates no schedules.

**Your approval queue lives in Apps.** Every draft includes destination, sender,
exact content, rationale and proposed commitment. Approving records a 48-hour
decision, not delivery. This release intentionally has no sending or payment
connector. A future executor must verify the approval digest, expiry, scope,
suppression and budget again before any external action.

The portfolio starts at $0 external commitments, five new app work items per
UTC day and at most five waiting drafts. One work item has at most 20 public
source requests, including failed requests. These are operational bounds, not a
hard cap on tokens, runtime duration or model-provider invoices. Source reads
are credential-free HTTPS GETs; no redirects or private-network destinations.

## Boundaries and current limitations

- v1 is declarative JSON: no JavaScript hooks, shell access, arbitrary MCP tools,
  signed-in browsers, private team-folder access or automatic tool installation.
- Results and source receipts persist across runs. Record keys deduplicate within
  an installation. Active action destinations and suppressions are checked across
  the workspace. Identity resolution across different URLs/emails is not inferred.
- Portfolio review is recommendations only. It does not start other apps or change budgets.
- The USD commitment ledger reserves approved draft amounts atomically. There is
  no provider charge reconciliation, delivery history or payment collection yet.
- App state is device-local, stored in generic host-owned SQLite tables outside
  this repository. Connected/synced workspaces are rejected in this preview.
  Back up Bees' database using a SQLite-aware backup before relying on it.
- Removing an app requires paused schedules and finished/cancelled work. It
  archives its process, cancels pending action drafts and preserves records.
  Old processes cannot resume after reinstall/upgrade. No database downgrade is offered.
- Apps may read only their own records unless `portfolio-read` is explicitly
  granted at installation. That grant covers the selected workspace, not other customers.
- Hacker News results are source evidence, not verified buyers or permission to
  contact people. This source cannot verify every community's posting rules;
  unresolved cases remain research briefs, not ready-to-send drafts.

## Development and contributions

No npm dependencies are needed for the catalog checks:

```sh
npm run check
BEES_DESKTOP_DIR=/absolute/path/to/bees-desktop npm run check
```

The second command additionally checks packages against the actual desktop
validator. See [the app contract](docs/app-contract.md) and
[contribution guide](CONTRIBUTING.md). No separate marketplace server is needed.

Licensing is intentionally pending the owner's choice; `UNLICENSED` is not an
open-source license. Do not publish these packages as open source until the
selected license and notices are added. These packages remain a preview, not a
production-ready release.
