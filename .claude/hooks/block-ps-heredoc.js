#!/usr/bin/env node
'use strict';

// PreToolUse/Bash guard: block the PowerShell single/double-quoted here-string form
// (@'...'@ / @"..."@) in Bash-tool commands. The Bash tool runs POSIX sh (Git Bash on
// Windows), where that form is NOT a heredoc — the leading/trailing @ leaks into the
// command (the classic failure: `git commit -m @'...'@` lands a commit whose subject is a
// bare @, with the real title pushed to line 2). The PowerShell tool is unaffected.

const { readPayload, block, allow } = require('./_util');

// Opening `@'`/`@"` at end-of-line, or closing `'@`/`"@` at start-of-line.
const PS_HEREDOC = /@['"][ \t\r]*$|^[ \t]*['"]@/m;

(async () => {
  const payload = await readPayload();
  const cmd = String((payload.tool_input && payload.tool_input.command) || '');
  if (!cmd.trim()) return allow();

  if (PS_HEREDOC.test(cmd)) {
    return block(
      "PowerShell here-string syntax (@'...'@ / @\"...\"@) detected in a Bash-tool command. " +
        'The Bash tool is POSIX sh (Git Bash), not PowerShell — this form is not a heredoc there ' +
        'and leaks a stray @ into the command. Pass multi-line text with git commit -F <file> ' +
        "(or -F - from stdin), or use a real POSIX heredoc, e.g.  git commit -F - <<'EOF'  ... " +
        "your message ...  EOF  — the @'...'@ form is only valid in the PowerShell tool."
    );
  }
  return allow();
})();
