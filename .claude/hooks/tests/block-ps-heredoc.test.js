/* ============================================================
   SetFit — block-ps-heredoc hook test
   (node .claude/hooks/tests/block-ps-heredoc.test.js)

   Blocks the PowerShell here-string form (@'...'@ / @"..."@) in
   Bash-tool commands: an opening @' / @" at end-of-line, or a
   closing '@ / "@ at start-of-line. The Bash tool is POSIX sh
   (Git Bash), where that form is not a heredoc and leaks a stray
   @ into the command. The hook only regex-matches the command
   string — it never runs it — so these cases are safe.
   ============================================================ */

'use strict';

const path = require('path');
const { spawnSync } = require('child_process');

const HOOK = path.join(__dirname, '..', 'block-ps-heredoc.js');

let passed = 0,
  failed = 0;
function ok(cond, msg) {
  if (cond) passed++;
  else {
    failed++;
    console.error(`  FAIL: ${msg}`);
  }
}

// 2 = blocked, 0 = allowed
function bash(command) {
  const payload = { tool_name: 'Bash', tool_input: { command } };
  return spawnSync(process.execPath, [HOOK], { input: JSON.stringify(payload), encoding: 'utf8' }).status;
}

// Blocked — the classic PowerShell here-string mistake in a Bash command.
ok(bash("git commit -m @'\nfeat: add thing\n\nbody line\n'@") === 2, "git commit -m @'...'@ is blocked");
ok(bash('git commit -m @"\nfeat: add thing\n"@') === 2, 'git commit -m @"..."@ is blocked');
ok(bash("cat @'") === 2, "opening @' at end-of-line is blocked");
ok(bash('cat @"') === 2, 'opening @" at end-of-line is blocked');
ok(bash("some cmd @'  \nmore") === 2, "opening @' with trailing spaces is blocked");
ok(bash("line one\n'@") === 2, "closing '@ at start-of-line is blocked");
ok(bash('line one\n"@') === 2, 'closing "@ at start-of-line is blocked');
ok(bash("line one\n  '@") === 2, "indented closing '@ is blocked");

// Allowed — legitimate POSIX / ordinary usage.
ok(bash('') === 0, 'empty command is allowed');
ok(bash("git commit -F - <<'EOF'\nfeat: add thing\nEOF") === 0, 'POSIX heredoc is allowed');
ok(bash('git commit -m "feat: add thing"') === 0, 'ordinary git commit is allowed');
ok(bash('npm install @setfit/mobile-core') === 0, 'scoped npm package (@ mid-command) is allowed');
ok(bash('echo user@example.com') === 0, 'email address is allowed');
ok(bash("echo '@daily backup'") === 0, "quoted @ mid-line is allowed");
ok(bash('git log --format=%H') === 0, 'plain git log is allowed');

console.log(`\nblock-ps-heredoc: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
