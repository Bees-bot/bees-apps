# Contribute a Bees app

Start from a complete customer job, not an agent title or a single marketing tactic.

1. Copy an example to `apps/<stable-id>/app.json`; use a distinct package ID.
2. Keep inputs short. Declare every source and permission. Never include secrets,
   actual customers, private conversations, install hooks or executable code.
3. Specify what a useful result looks like, how it is checked, when to stop, and
   how to report zero findings or unavailable sources honestly.
   For v2, declare primitive `recordTypes` and narrow public page-source scopes;
   keep domain-specific field names in the package, not the host. A record status
   must never stand in for an authoritative approval, connection or receipt.
4. Add the package to `catalog.json` with status `community-unreviewed`.
5. Run `npm run check`, install in a fresh local Bees workspace, and run once.
   Test a second installation, denied external actions, source failure and removal.
6. Open a pull request with screenshots, the tested Bees version, source terms,
   model/cost observations, data destinations, limitations and a support owner.

The repository license decision is pending. Do not submit or redistribute code
under assumed terms; specify your proposed license and wait for the published
contribution policy before acceptance.

## Maintainer review

- Review the actual package and every declared endpoint, not just the demo.
- Check license/provenance, input privacy, truthful outputs and minimum permissions.
- No fabricated identities, automatic social profiles, bulk unsolicited messages,
  paid commitments or ways around approval and provider rules.
- Run positive and negative tests in a disposable workspace. Keep production
  credentials out of contributor CI and never execute code from PR descriptions.
- Review every changed release. Publish a pinned version/digest; never silently
  substitute changed content under the same version.
- Check current platform rules. Human approval is not permission to publish
  generated content where the destination prohibits it. Test action-level
  reviewer decisions, suppression and expired/changed approvals separately from
  normal work-stage review. Only a separately selected, tested host connector can
  execute an approved action; a package must not smuggle in a connector or credentials.
- Distinguish `first-party-preview`, `community-unreviewed` and
  `community-reviewed`. A review label is not a security guarantee.
- Keep reporting/removal instructions in the PR and release notes. Deprecate
  abandoned or unsafe apps without deleting customer data.

The initial catalog is a file plus pull-request review, not a marketplace with
accounts, ratings or financial payouts. Those are not required to build and
share the first useful apps.
