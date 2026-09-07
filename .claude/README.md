# The `.claude/` harness — map

Lightweight guardrails ported from the SetFit `setfit-user-app` harness, trimmed down for a
solo portfolio project (no team PR/issue flow, no protected branches, no RN stack yet).

| Layer | What it is | Where it lives | Runs |
|---|---|---|---|
| **Guardrails** | Hard rules (no secrets, no unsafe shell commands) | `hooks/`, `settings.json` | Automatically, on every matching tool call |
| **Skills** | `ui-ux-pro-max` design-intelligence skill | `skills/ui-ux-pro-max/` | Loaded on demand |

## Hooks

- `block-secrets.js` — refuses to write real-looking credentials (AWS keys, GitHub tokens,
  private key blocks, JWTs, generic `secret = "..."` assignments) into any file. Placeholders
  and `.env.example`/`.env.sample` files are exempt.
- `block-unsafe-bash.js` — refuses destructive/unsafe shell commands: `rm -rf` against a
  root/home/glob target, pipe-curl-to-shell, `git push --force` (not `--force-with-lease`),
  `git commit --no-verify`, `chmod 777`, disabling TLS verification, piping secrets to the
  network, `git filter-branch`.
- `block-ps-heredoc.js` — refuses PowerShell here-string syntax (`@'...'@` / `@"..."@`) inside
  Bash-tool commands, since the Bash tool here is POSIX sh (Git Bash), not PowerShell, and that
  form leaks a stray `@` into the command instead of acting as a heredoc.
- `_util.js` — shared stdin/JSON payload helpers used by all three hooks above.

Not ported (not applicable yet): `protect-branches.js` (no protected-branch policy for a
solo repo), `stack-lint.js` (React Native specific), the whole `review/` PR-review CI
machinery and `skills/{triage,start,create}-issue`, `raise-pr`, `pr-review*` (no GitHub
issue/PR workflow set up for this project). Revisit if/when this repo gets a GitHub remote,
collaborators, or a CI pipeline.

`hooks/tests/` holds a cross-platform test suite for every guardrail hook; run them all with:

```
node .claude/hooks/tests/run-all.js
```

`.claude/package.json` pins `"type": "commonjs"` so these hooks work even though the project
root `package.json` is `"type": "module"` (Vite's default for React projects).
