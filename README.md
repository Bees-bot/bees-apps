<p align="center">
  <img src="https://raw.githubusercontent.com/Bees-bot/bees-desktop/main/src-tauri/icons/icon.png" width="96" alt="Bees">
</p>

<h1 align="center">Bees Apps</h1>

<p align="center">
  Ready-made apps for the Apps screen in Bees, plus the rules for building your own.
</p>

<p align="center">
  <a href="https://bees.bot">Bees</a> ·
  <a href="https://bees.bot/download/">Download</a> ·
  <a href="https://github.com/Bees-bot/bees-desktop">Desktop repo</a>
</p>

An app here is one JSON file. It describes a job, the inputs it needs, the public sources it may read and what a good result looks like. Bees does the rest: it runs the work, stores the results, handles permissions and asks a person before anything leaves the workspace. Apps never touch the desktop's internals.

## Apps in this repo

| App | What you get | Limits |
|---|---|---|
| [Opportunity Scout](apps/opportunity-scout/app.json) | Public demand signals with sources, and sensible next steps | Searches Hacker News. Never asks for a lead CSV. |
| [Portfolio Review](apps/portfolio-review/app.json) | Recommendations based on your shared goal, results and approval queue | Reads other apps' results in the same workspace. Never moves budgets on its own. |
| [Marketing Operations](apps/marketing-operations/app.json) | Ranked ideas, sourced opportunities, campaign records and exact drafts | Scoped Hacker News and n8n research, one bounded job. No private seed data and no sending channel. |

The live directory is published by hand, so it can list different apps than `main`.

These apps research and draft. They are not an email sender, an ad manager or a sales team. Installing one starts no campaigns, schedules, public messages or paid services.

## Use inside Bees

The Apps screen is hidden in Bees 0.2.0 while it gets finished, so these steps are for when it comes back. Model access must already work in Bees.

1. Open a team workspace and go to **Apps**. For a connected team, you need to be signed in with access to that team.
2. Pick an app. Check its publisher, version, access and sources, then click **Install**. You don't need GitHub or any files.
3. Click **Finish setup** (or **Open** if the app needs no setup), fill in the short form and click **Save settings**. Installing creates Bees agents and a Work, Review, Done process for the app.
4. Click **Run once**. Follow progress on the work screen. Results show up in Apps.
5. To repeat it, add a schedule to the work item after a good run. Installing never creates schedules, and scheduled runs need your computer on.

Model costs are not included and not capped by the app.

## Approvals

Your approval queue lives in Apps. Every draft shows the destination, the sender, the exact content, the reason and any money it commits.

- A separate reviewer checks each action before the named person can approve it.
- Approving records a decision that lasts 48 hours. It does not send anything.
- No app package connects a sending channel or account. Only a separately tested connector in Bees can carry out an approved action.
- Before sending, Bees checks the approval again: content, reviewer decision, expiry, scope, suppression list and budget.
- A provider accepting a message does not prove it was delivered.
- Paid actions are not available in these apps.

## Limits

- Apps start with $0 of outside commitments.
- All apps together get 5 new work items per day (UTC), and at most 5 drafts waiting for approval.
- One work item can make at most 20 source requests, failed ones included.
- These limits do not cap tokens, run time or your model bill.
- Sources are read with plain HTTPS GET requests. No logins, no redirects, no private network addresses.

## What apps can't do

- Apps are plain JSON. No JavaScript, shell access, arbitrary tools, signed-in browsers, private team folders or automatic installs.
- Version 2 packages can define simple record types and read public pages from the sites they declare. That is still not open browsing or sending. See the [marketing guide](docs/marketing-operations.md).
- An app reads only its own records, unless you grant `portfolio-read` when installing. That grant covers the one workspace.
- Portfolio Review only recommends. It doesn't start other apps or change budgets.
- Hacker News results are evidence, not verified buyers or permission to contact anyone. Hacker News bans AI-written comments, so these apps never draft replies there. Results from other communities stay research notes, not ready-to-send drafts.

## Data

- Results and source records stay across runs. Record keys stop duplicates within one install. Destinations and suppressions are checked across the whole workspace. Bees doesn't guess that two different URLs or emails are the same person.
- Local workspaces keep app data in SQLite. Connected workspaces keep it on the workspace server, cached on each signed-in device.
- Don't put secrets in app settings.
- Shared changes need a connection and a server that supports apps. If two edits clash, Bees asks you to refresh and try again.
- Shared state is capped at 16 MB, so this is not a place for a huge lead database.
- The spending ledger reserves approved amounts. Its receipts are not billing records.

## Updates and removal

- Refreshing the directory never changes an installed app.
- **Approve update** shows any new access first. It keeps your results and matching settings, cancels old drafts and creates a new process with schedules off. New required fields need setup again.
- **Remove app; keep data** works once schedules are paused and work is finished or cancelled. It archives the process, cancels pending drafts and keeps records.
- Old processes can't resume after a reinstall or upgrade, and there is no database downgrade.

## Develop and contribute

The checks need no npm packages:

```sh
npm run check
BEES_DESKTOP_DIR=/absolute/path/to/bees-desktop npm run check
```

The second line also checks packages against the real desktop validator and runs a Marketing Operations smoke test in memory. Model calls and source reads are stubbed, and nothing live is created. The desktop checkout needs its dependencies installed.

Read [the app contract](docs/app-contract.md) and the [contribution guide](CONTRIBUTING.md) before opening a pull request.

## How the directory is published

Bees reads the directory from `https://bees-bot.github.io/bees-apps/catalog.json`. GitHub Pages serves it from the `codex/catalog-pages` branch. That branch is updated by hand, so it can differ from `main`. To point Bees at another directory, set `BEES_APP_CATALOG_URL` when you launch it.

`npm run build:catalog` writes `dist/catalog.json` and one `dist/packages/*.json` file per app, named by its SHA-256 hash. Only `first-party-preview` and `community-reviewed` apps go in. CI builds this as an `app-directory` artifact but never deploys it.

When publishing:

- Upload package files before the catalog, and keep old package files.
- Serve `catalog.json` with a short cache time.
- Bump an app's version whenever its content changes.

Bees fetches the directory when you open Apps or click **Refresh**. It checks each package's bytes and details, then validates it. Offline, the last directory can be browsed but not installed from. Installed local apps keep working. Connected apps still need the server.

Shipping an app update only needs a new catalog. A new package format or host feature may need a newer Bees. Runs use your desktop, not cloud workers.

## License

Bees apps are licensed under either the [MIT](LICENSE-MIT) or the [Apache 2.0](LICENSE-APACHE) license, at your option. An app's own `license` field still reads `UNLICENSED` until that app's next version ships. The apps are a preview, not production ready.
