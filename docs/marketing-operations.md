# Marketing Operations

One app owns the marketing portfolio inside a Bees workspace. Its reusable job
is to research, qualify, organize, draft and review a small batch. Campaigns are
records in that app, not separate bots, databases or schedulers. Portfolio Review
can independently recommend what to continue with its explicit read grant.

This is a preview, not an activated campaign. Building or installing the package
does not start work, connect an account, create schedules, publish anything or
authorize a message. A real external channel still needs the user's selection,
connection and tested delivery path. No production channel is connected by this
package, and no private prospect records are shipped with it.

## What you see in Bees

| Collection | What it means | Useful next step |
|---|---|---|
| Ideas and priorities | Simple explanations, sourcing plans, manual instructions, Ask Bees prompts and estimated rankings | Clarify an assumption or choose a bounded experiment |
| Campaigns | A target audience, source plan, qualification rule and success/stop measures | Approve the experiment's research scope |
| Opportunities | Actual source evidence and its limitations; not automatically buyers | Inspect evidence and decide whether a conversation is appropriate |
| Content and conversation drafts | Exact proposed content and manual steps | Complete checks before creating an approval request |
| Native action references | Links from campaign records to immutable host-owned action drafts | Review the exact action in the native queue |
| Observed outcomes | Events with supporting evidence and verification status | Measure useful adoption, not invented conversion |
| Run summaries and blockers | What actually happened, including zero findings | Supply the smallest missing fact or capability |

Record references are stable string keys or native action IDs. Record text and
status are app output, not access control or authority. Only the host's exact
action, independent review and human decision can qualify an action for
execution. The app cannot mark itself approved or sent.

## First setup and run

1. Install the package through the reviewed directory in a disposable or intended
   Bees workspace. It requires the matching v2-capable desktop and, for connected
   workspaces, the compatible server. Check permissions and declared sources.
2. Describe the product as it works **today**, the useful outcome and whether a
   stranger can actually try it. Unknown readiness is a valid answer; it blocks
   installation invitations, not research. No user/lead CSV is required.
3. Supply an initial audience hypothesis or say starting from scratch. Leave
   `approved-campaigns` blank to get proposals and research without activating an
   experiment. The app may suggest at most two acquisition experiments and one
   activation experiment; selecting research scope is not message approval.
4. Leave `sender` blank until an existing account has been selected. A name in
   this input is neither a connection nor permission to contact anyone. Never
   put a password, cookie or API key in app inputs.
5. Run once. Check the original source receipts, duplicates, scores, practical
   instructions and the independent reviewer result. An honest empty result can
   pass. One successful run is required before considering recurrence.
6. When satisfied, set recurrence through Bees' native work schedule controls.
   Start with one shared sourcing/maintenance job, not one job per idea. Choose a
   cadence and model allowance explicitly. Pause when the approval backlog or
   stop rule is reached. Keep the execution machine/runtime available.
7. Select and connect a supported external channel separately. Test denial and
   one approved harmless delivery before using it for outreach. Each message,
   follow-up, submission, post or commitment needs its own exact approval.

The package has no automatic recurring run or cloud worker. Existing host limits
apply in addition to the app's smaller batch: at most three search phrases, five
new source-backed opportunities, three changed/new ideas and two proposed action
drafts. These prompt-level batch targets do not replace host-enforced quotas.
New external spend stays at $0. Model usage can still incur provider costs and
is not assumed to be measured or capped by that policy.

## Initial sourcing, honestly scoped

The eight included source grants permit Hacker News search, original discussion
pages and guidelines; n8n Community search, original topics and guidelines; n8n
workflow-description pages; and the Bees pricing page. The app chooses sources
that fit the actual product/audience, searches for specific problems, opens the
original discussion and distinguishes firsthand pain from vendor promotion.
It records fewer than five prospects or none when that is what the evidence supports.

For a relevant automation/practitioner hypothesis, the public n8n search endpoint
is `https://community.n8n.io/search.json` with the `q` query parameter. A
credential-free GET with a sample problem query returned HTTP 200 and JSON
`posts`/`topics` during development on 9 September 2026. This verifies that route
was reachable, not that a Bees runtime run or future request will succeed. The
app joins the returned post/topic IDs, reads the original `/t/` page and checks
the [community guidelines](https://community.n8n.io/guidelines). Replies must add
relevant substance without spam, cross-posting, signatures or hijacking the
topic. Check applicable category rules too; incomplete checks keep a draft held.

The [workflow directory](https://n8n.io/workflows/) and observed pages under
`/workflows/` can identify an attributed practitioner's work. They are not proof
of buyer intent, customer results or a permission to contact the author. The app
does not purchase or execute templates, guess masked contacts or follow links
beyond its declared scopes. A source error or access challenge is reported as a
blocker, not bypassed. n8n is an audience hypothesis, not a universal fit for all
products or permission for generic product promotion.

Hacker News currently prohibits generated and AI-edited comments. This app uses
HN for research, not automated replies or copy-paste outreach. A human who
participates must write their own contribution and follow the site's rules;
human approval does not make generated comments acceptable. Recheck the
[official guidelines](https://news.ycombinator.com/newsguidelines.html) before any
participation; this policy was checked on 9 September 2026.

YouTube creators, Reddit participation, LinkedIn publishing, email, directories,
website analytics, press submissions and ads are possible campaign **ideas**, not
integrations this package secretly possesses. The app saves a specific manual
plan and missing capability rather than pretending to access them. Add a new
source or channel only after reviewing access, platform rules, data destinations
and the generic host capability. Never use broad shell/browser access to bypass
an unavailable source or forbidden action.

## Ranking ideas

Scores are estimates that guide a small test, not promises. Higher is better.

| Score | Interpretation |
|---|---|
| Speed, 1–5 | Time to a useful signal: over a month → within two days |
| Affordability, 1–5 | Combined new external cost and initial human effort; the worse band wins |
| Value, 1–5 | Weak/vanity signal → direct qualified conversation or activation about an observed need |
| Confidence, 0–1 | How much the evidence supports those estimates |

`priority = round(100 × (0.30 × speed + 0.20 × affordability + 0.50 × value) ÷ 5 × confidence)`

Affordability bands: 5 = $0 and at most one initial human hour; 4 = $0 and at most
three hours; 3 = at most $50 or one working day; 2 = at most $250 or three days;
1 = more. Apply the worse time/cost band. A quoted cost does not authorize spend.

Each idea must include an ELI5 explanation, where the next real prospect comes
from, numbered manual steps, what to say or ask, a bounded Bees prompt, available
automation, missing dependencies and a success measure. Material unknowns go to
`needs-clarification`; unknown scores are absent rather than zero. Optional
open-source alternatives are candidates for evaluation, not unverified claims
about licenses, pricing or installation readiness.

## Importing the existing research

The original research register and three message drafts are private workspace
data. Use the host's authenticated record-import flow for a user-reviewed copy;
never add them to this package, catalog, test fixture or public repository. Map
them to the declared collections, retain canonical source URLs and original
dates, and mark the evidence as user-supplied until rechecked. Importing must be
idempotent and must not replace a conflicting record without a visible decision.

An imported approval, digest, sender field or status must never become a native
approval or delivery receipt. Recreate a native draft only after its account,
destination, content and rules are checked, then obtain independent review and
fresh human approval. The earlier eight candidates are not eight verified
buyers; the earlier drafts were unsent. If an original source is outside current
permissions, retain that limitation instead of manufacturing a fresh receipt.

## Acceptance before production use

- Start with no leads; obtain source-backed opportunities or an honest empty run.
- Rerun the same evidence; duplicates are not counted as new leads and campaign
  references survive. Check older records with the paginated query tool.
- Test inaccessible sources, unknown rules and unverified readiness; drafts stay
  held and the next missing step is specific.
- Check scores and missing-score behavior against the published formula.
- Inspect action-level reviewer decisions; a stage pass is not human approval.
- Import a small user-approved sample twice; provenance remains user-supplied,
  conflicts are visible and no imported field grants approval.
- With a separately selected channel, test rejection, changed content, expiry,
  suppression, wrong account, duplicate execution and ambiguous delivery. None
  may silently send or retry. Verify an actual receipt for a permitted test.
- Distinguish approvals, deliveries, replies, qualified conversations, activated
  users and paying customers. Count only events supported by actual evidence.
  Provider acceptance alone is not proof of recipient delivery.
- Verify schedules and stop rules in a disposable workspace. A retired app
  process must not resume after update/reinstall.

Catalog/contract checks are necessary but not proof of model quality, a successful
workflow run or a working external channel. Record those separate results before
describing the system as operational.

With `BEES_DESKTOP_DIR` set, the catalog suite also runs the actual marketing
manifest through `AppPlatform`, `BeesProduct` and an in-memory database. It checks
native Work/Review/Done creation, required setup, a configured work item, one
fictional typed-record round-trip and preview/import provenance. Model execution
is stubbed, public reads throw if attempted, and no recurrence or action is
created. This dry check is not a model-driven campaign run or an external send.
