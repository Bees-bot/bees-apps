# Bees app contract v1

Status: declarative preview for local and connected workspaces. A package is one UTF-8 JSON file, at most 64 KB. The host
validates the entire package again at installation. Unknown fields are rejected.
The desktop validator and runtime, not the package's instructions, enforce access.

## Package fields

| Field | Contract |
|---|---|
| `schemaVersion` | Exactly `1` |
| `id` | Stable lowercase identifier, 2–64 letters/digits/hyphens; starts with a letter |
| `version` | `major.minor.patch`; changing installed content requires explicit removal/upgrade |
| `name`, `description`, `author`, `license` | Nonempty display/ownership metadata; plain text |
| `permissions` | Unique subset of `public-sources`, `draft-actions`, `portfolio-read` |
| `inputs` | At most 12 `{key,label,help?,required}` definitions. Values are strings, at most 4000 characters |
| `sources` | At most 12 `{key,label,url,queryParam}` public HTTPS GET endpoints. No credentials, ports, fragments, redirects, headers or executable templates |
| `task` | Worker instructions, at most 16,000 characters |
| `review` | Independent reviewer instructions, at most 4000 characters |

The source tool changes only the declared query parameter, URL-encoding its
value. Every other part of the approved endpoint stays fixed. DNS is resolved
to public IPv4 addresses and pinned for the TLS request. Responses are limited
to 512 KB and requests have a timeout. Endpoints must genuinely be read-only;
GET by itself does not prove a service has no side effects. Installing a manifest
is a human trust decision about its sources, not a security certification.

## Runtime contract

The host creates two agent assignments and a native Work → Review → Done
process. No work starts during installation. App installation IDs, workspace
IDs and package IDs are different identities. Package code never gets the
desktop loopback token or reads the host database directly.

Available worker tools:

- `bees_app_read`: own configuration, records and source receipts. With the
  explicit `portfolio-read` grant, includes other app records/actions in this workspace.
- `bees_app_source`: query a declared source and receive a host-generated receipt ID.
- `bees_app_record`: upsert an app-owned result using a stable `key`, `kind`,
  `title`, `body` and `evidenceIds`. App claims are not independently verified facts.
- `bees_app_draft`: propose immutable `destination`, `account`, `content`,
  `rationale` and integer USD `costCents`. Requires `draft-actions`.
- Existing Bees stage-result, work-review and missing-information tools.

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

Only the authenticated user interface can decide drafts or edit portfolio
limits. Apps cannot submit an `approved: true` field. Decisions must match the
stored action digest and pending state, are attributed to the current user,
and expire after 48 hours. An active destination cannot have competing draft
actions in the same workspace. Suppression cancels its pending/approved drafts.

Budget reservations and approval transitions share one SQLite transaction in
local workspaces. In connected workspaces, a server-authoritative revision/CAS
commit serializes decisions, run admissions, source-request reservations and
configuration. Work is attributed to the selected account. App execution and
schedule occurrence claims are shared across team members and devices. An
available signed-in desktop worker is still required; this is not cloud hosting.
This ledger does not control model-provider invoices or remote ads, and there
is deliberately no external executor yet. Never interpret `approved` as `sent`.

## Deliberately not implemented

Executable third-party plugins, arbitrary app UIs,
automatic in-place upgrades, marketplace billing, publisher payouts, hosted
workers, CRM synchronization and paid/sending connectors. These need separately
tested contracts rather than unchecked manifest flags.
