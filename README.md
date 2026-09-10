# Bees Apps

Installable, outcome-focused apps for Bees. This repository owns app definitions
and the community contribution contract. Bees owns execution, scheduling, app
storage, permissions and human decisions. No app imports the desktop's internals.

## First apps

| App | Result | Scope |
|---|---|---|
| [Opportunity Scout](apps/opportunity-scout/app.json) | Source-backed public demand signals and appropriate next steps | Hacker News search initially; never requires an uploaded lead CSV |
| [Portfolio Review](apps/portfolio-review/app.json) | Recommendations using the shared goal, results and approval backlog | Read access to other app results in the same workspace; no automatic reallocations |
| [Marketing Operations](apps/marketing-operations/app.json) | Ranked practical ideas, source-backed opportunities, campaign records and exact drafts | v2 typed records; scoped HN/n8n research, one bounded job, no private seed data or connected sending channel |

These are research/draft-first previews, not a working email sender, paid ad
manager, autonomous sales department or a claim of paying customers. No
campaigns, schedules, public messages or paid services are activated by installing.

## Use inside Bees

Requires the desktop app-platform implementation accompanying this repository.
It is not yet in a published Bees release. A source checkout of Bees Desktop with
the changes can build the client and run the app using its normal development steps.

1. Open any team workspace in Bees and choose **Apps**. Connected teams require
   the matching server update and a signed-in account with access to that team.
2. Browse the dynamically downloaded directory. Inspect the publisher, version,
   requested permissions and public-source endpoints, then click **Install**.
   No JSON upload, Git checkout or GitHub login is required for users.
3. Complete the app's short setup form. Installation creates native Bees agents,
   a Work → Review → Done process, and workspace-scoped installation records.
4. Click **Run once**. Inspect progress in the existing work screen and results in
   Apps. Model access must already work in Bees; model costs are not included or capped.
5. After a successful manual run, use Bees' existing schedule controls on the
   work item. The machine and runtime must be available. Installation creates no schedules.

**Your approval queue lives in Apps.** Every draft includes destination, sender,
exact content, rationale and proposed commitment. Independent review checks each
exact action before the designated human can approve it. Approving records a
48-hour decision, not delivery. The matching host has a generic claim/dispatch/
receipt contract; no production sending channel or account is connected by an
app package. Dispatch must recheck the approval digest, reviewer decision,
expiry, scope, suppression and budget. Provider acceptance is not confirmed
recipient delivery. Paid actions remain unavailable in these apps.

The portfolio starts at $0 external commitments, five new app work items per
UTC day and at most five waiting drafts. One work item has at most 20 public
source requests, including failed requests. These are operational bounds, not a
hard cap on tokens, runtime duration or model-provider invoices. Source reads
are credential-free HTTPS GETs; no redirects or private-network destinations.

## Boundaries and current limitations

- v1 and v2 are declarative JSON: no JavaScript hooks, shell access, arbitrary MCP
  tools, signed-in browsers, private team-folder access or automatic tool installation.
  v2 adds primitive record schemas and declared-origin public page reads; it does
  not grant unrestricted browsing or sending. See the [marketing guide](docs/marketing-operations.md).
- Results and source receipts persist across runs. Record keys deduplicate within
  an installation. Active action destinations and suppressions are checked across
  the workspace. Identity resolution across different URLs/emails is not inferred.
- Portfolio review is recommendations only. It does not start other apps or change budgets.
- The USD commitment ledger reserves approved draft amounts atomically. Generic
  action receipts are not provider charge reconciliation or payment collection.
  No production delivery history exists merely because the app was installed.
- Local workspace app data stays in SQLite. Connected workspace configuration,
  results, source receipts, drafts, decisions and portfolio limits are stored on
  the workspace server and cached on each authorized device. Do not put secrets
  in configuration. Shared writes require connectivity and a matching server;
  failed/conflicting writes are not accepted as local decisions.
- Shared state uses revisioned snapshots capped at 16 MB. Conflicting edits ask
  the user to refresh/retry. Before that ceiling, source/history storage needs
  pagination; this preview is not intended for an unlimited lead database.
- Removing an app requires paused schedules and finished/cancelled work. It
  archives its process, cancels pending action drafts and preserves records.
  Old processes cannot resume after reinstall/upgrade. No database downgrade is offered.
- Directory refresh never changes an installation. **Approve update** reviews
  new access explicitly, keeps results and matching configuration, cancels old
  drafts and creates a new process with schedules off. New required fields need setup.
- Apps may read only their own records unless `portfolio-read` is explicitly
  granted at installation. That grant covers the selected workspace, not other customers.
- Hacker News results are source evidence, not verified buyers or permission to
  contact people. HN prohibits generated and AI-edited comments, so these apps use
  it for research, not AI-authored replies. Other communities' unchecked rules
  keep their results as research briefs, not ready-to-send drafts.

## Development and contributions

No npm dependencies are needed for the catalog checks:

```sh
npm run check
BEES_DESKTOP_DIR=/absolute/path/to/bees-desktop npm run check
```

The second command additionally checks packages against the actual desktop
validator and runs an in-memory Marketing Operations host smoke test. The latter
uses the actual manifest, native agents/process/work records and import/query
paths, with model execution and public reads stubbed out; it creates no live
workspace, schedule or action. The sibling desktop's dependencies must already
be available. See [the app contract](docs/app-contract.md) and
[contribution guide](CONTRIBUTING.md). No separate marketplace server is needed.

## Build and host the dynamic directory

`npm run build:catalog` creates `dist/catalog.json` plus immutable,
SHA-256-addressed `dist/packages/*.json`. Only `first-party-preview` and
`community-reviewed` entries are included. CI builds an `app-directory` artifact;
it does **not** publish or deploy it. No app definitions are bundled in Bees Desktop.

After the owner approves publication, host the artifact on static HTTPS storage.
The proposed default URL is `https://bees-bot.github.io/bees-apps/catalog.json`;
GitHub Pages is **not enabled by this change**. A different host can be selected
with `BEES_APP_CATALOG_URL` when launching Bees. The repository is currently
private and licensing is pending: resolve publication/licensing before exposing
these packages. Do not assume the proposed URL is live.

Publish packages before the catalog, serve `catalog.json` with a short cache
lifetime/revalidation, and keep historical checksum-addressed package files.
Increment the app version whenever its content changes. The desktop refreshes
on opening Apps or pressing Refresh, verifies package bytes and displayed
metadata, then validates the declarative contract. A changed listing requires
refresh and a new click. Offline cached listings are browse-only; installed
local apps remain available. Connected app execution still needs the server.

App updates need only a catalog publication, not a desktop release or server
deployment. A new package schema or host capability may still require a Bees
upgrade. Execution uses existing desktop workers; this does not add cloud workers.

Licensing is intentionally pending the owner's choice; `UNLICENSED` is not an
open-source license. Do not publish these packages as open source until the
selected license and notices are added. These packages remain a preview, not a
production-ready release.
