# Bees Apps

Keep apps separate from the Bees host. Packages contain declarative data only in
v1; never add credentials, customer records, executable install hooks or a scheduler.
Use the documented host contract rather than importing Bees internals.
Read sibling AGENTS.md before host changes. Keep matching branch names for
cross-repository work. Run npm run check here and in every changed sibling.
Do not commit, push, publish, send communications or enable paid execution without
explicit authorization. Preserve the human approval requirement for every message.
