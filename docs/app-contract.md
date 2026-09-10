# Bees app contract v1 and v2

Status: declarative preview for local and connected workspaces. A package is one UTF-8 JSON file, at most 64 KB. The host
validates the entire package again at installation. Unknown fields are rejected.
The desktop validator and runtime, not the package's instructions, enforce access.

## Package fields

| Field | Contract |
|---|---|
| `schemaVersion` | `1` or `2`; v1 packages retain their existing shape |
| `id` | Stable lowercase identifier, 2–64 letters/digits/hyphens; starts with a letter |
| `version` | `major.minor.patch`; changing installed content requires explicit removal/upgrade |
| `name`, `description`, `author`, `license` | Nonempty display/ownership metadata; plain text |
| `permissions` | Unique subset of `public-sources`, `draft-actions`, `portfolio-read` |
| `inputs` | At most 12 `{key,label,help?,required}` definitions. Values are strings, at most 4000 characters |
| `sources` | At most 12 fixed-query public HTTPS GET sources; v2 also supports declared-origin page sources described below. No credentials, ports, fragments, redirects, headers or executable templates |
| `recordTypes` | Optional in v2 only: at most 12 `{key,label,fields}` definitions with at most 24 primitive fields per type |
| `task` | Worker instructions, at most 16,000 characters |
| `review` | Independent reviewer instructions, at most 4000 characters |

The source tool changes only the declared query parameter, URL-encoding its
value. Every other part of the approved endpoint stays fixed. DNS is resolved
to public IPv4 addresses and pinned for the TLS request. Responses are limited
to 512 KB and requests have a timeout. Endpoints must genuinely be read-only;
GET by itself does not prove a service has no side effects. Installing a manifest
is a human trust decision about its sources, not a security certification.

A fixed-query source keeps the v1 shape `{key,label,url,queryParam}`. A v2 page
source is `{key,label,url,type:"page",pathPrefix}`: `url` declares the HTTPS origin
and `pathPrefix` narrows the permitted normalized path. A prefix ending in `/`
allows that directory subtree; otherwise it matches only the exact pathname,
such as `/item` or `/newsguidelines.html`. Its source-tool `query`
is a full HTTPS URL on that exact origin within that path scope, not a query to
append to a search endpoint. Encoded traversal, credentials, redirects and
private-network destinations must remain denied by the host. Reading a page
does not grant access to links outside its declared sources.

Each v2 record field is `{key,label,type,required?}`, where `type` is `text`,
`number` or `boolean`. Type and field keys match `[a-z][a-z0-9-]{1,63}`. Text is at
most 4000 characters; numbers must be finite with absolute value at most `1e15`;
record `data` is at most 16,000 JSON characters. Unknown fields and mismatched
types are rejected. References are ordinary stable record keys/IDs stored in
text fields, not a graph engine or a new permission boundary. The narrative
`body` remains required and at most 8000 characters. Packages provide no private
seed data; generic host import retains user-supplied provenance.

## Runtime contract

The host creates two agent assignments and a native Work → Review → Done
process. No work starts during installation. App installation IDs, workspace
IDs and package IDs are different identities. Package code never gets the
desktop loopback token or reads the host database directly.

Available worker tools:

- `bees_app_read`: own configuration, records and source receipts. With the
  explicit `portfolio-read` grant, includes other app records/actions in this workspace.
- `bees_app_query`: query relevant own records by optional `kind`, `key` or `query`,
  using `offset` and `limit`; returns records, total, offset, limit and nextOffset.
- `bees_app_receipt`: retrieve one allowed source receipt by its actual `id`.
- `bees_app_source`: query a declared source and receive a host-generated receipt ID.
- `bees_app_record`: upsert an app-owned result using a stable `key`, `kind`,
  `title`, `body` and `evidenceIds`, plus v2 `data` matching the declared record type.
  App claims are not independently verified facts; imported notes are not fresh receipts.
- `bees_app_draft`: propose immutable `destination`, `account`, `content`,
  `rationale` and integer USD `costCents`. Requires `draft-actions`. Optional
  `connectorId` must come from host-listed configured connector metadata for the
  actual account; it cannot be guessed or supplied by an untrusted source. Omit
  it if unavailable, leaving the draft non-executable. The package does not
  contain account credentials or connect a provider.
- Existing Bees stage-result, work-review and missing-information tools.

Reviewers additionally use `bees_app_review_action` with actual `actionId`, current
`digest` and `decision: "pass" | "revise"` for each exact action in their work
item. Passing the work stage is not a substitute for that action-level decision.
Reviewers cannot write records or prepare actions. Both roles are denied shell,
code execution, MCP, signed-in browsers, delegation, private-file publication,
app setup, budget edits and all sending paths. The DSH monotonic tool guard is
the execution boundary; tool visibility and prompt instructions are not relied on.
App workflows use direct/native tool calls, not the code-execution transport.

Configuration is snapshotted on first admission of a work item. Edits apply to
future work. All stages/retries of an admitted item use its snapshot. Records
remain app-scoped; receipt IDs from a different installation are rejected.

## Installation lifecycle

Browse directory → inspect → install → configure → run once → optionally schedule.

The host records package digest, exact manifest, configuration, agent IDs and
process ID. Reinstalling identical active content reuses the installation.
Partial installs expose a repair action. Content cannot silently change under
an installed version. Updates require an explicit approval, showing added access;
work must be settled and schedules paused. Records survive updates and removal.
Older process versions remain denied; new versions start with schedules off.
Copying app-owned processes is blocked so a copy cannot lose its app restrictions.
Generic runtime storage is private and not part of the public package.

## Human oversight and budget

Only the authenticated, designated human decision path can approve drafts or edit
portfolio limits. Apps cannot submit an `approved: true` field. Approval requires
an independent pass for that exact action and must match the stored action digest
and pending state. Decisions are attributed to the current user,
and expire after 48 hours. An active destination cannot have competing draft
actions in the same workspace. Suppression cancels its pending/approved drafts.

Budget reservations and approval transitions share one SQLite transaction in
local workspaces. In connected workspaces, a server-authoritative revision/CAS
commit serializes decisions, run admissions, source-request reservations and
configuration. Work is attributed to the selected account. App execution and
schedule occurrence claims are shared across team members and devices. An
available signed-in desktop worker is still required; this is not cloud hosting.
This ledger does not control model-provider invoices or remote ads. The generic
host claim/dispatch/receipt lifecycle requires a separately selected and connected
adapter; no production channel/account is installed by a package. Dispatch
rechecks the current approval, reviewer decision, digest, expiry, scope,
suppression and budget. An unavailable connector blocks execution rather than
falling back to browser/shell access. An ambiguous provider response requires
reconciliation, not a blind retry. Provider acceptance is not confirmed recipient
delivery; neither is a reply or a customer. Never interpret `approved` as `sent`.

## Deliberately not implemented

Executable third-party plugins, arbitrary app UIs,
automatic in-place upgrades, marketplace billing, publisher payouts, hosted
workers, CRM synchronization and bundled production paid/sending connectors. These need separately
tested contracts rather than unchecked manifest flags.
