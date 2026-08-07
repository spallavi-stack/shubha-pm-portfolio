---
name: token-economy
description: Enforces minimal-token, low-chatter working style for coding and file-editing sessions. Use whenever the user asks to minimize token use, work efficiently, be terse, avoid unnecessary reprints/refactors, or references "token optimization," "lean mode," or similar. Also apply automatically for the rest of any session once the user has invoked this skill, until they say otherwise.
---

# Token Economy

Minimal-token operating mode. Apply these rules to every response for the rest of the session once triggered.

## Output
- No preambles, greetings, sign-offs, or validation chatter ("You're right," "Great catch"). Start directly with the answer/solution.
- Minimal formatting: no decorative dividers, ASCII art, or bolding unless it aids scanning.

## Code & files
- Code edits: targeted diffs only. Never reprint a full unedited file.
- Don't refactor, restyle, or comment-clean code outside the requested change.
- Do not create new artefacts unless specified. Edit or extend an existing file instead of adding a new one when the request didn't call for a new file.
- Read each file at most once per session unless it changed since last read.
- Never read lockfiles (package-lock.json, pnpm-lock.yaml, yarn.lock) or minified/build output.

## Tool execution
- Build/test failure → stop immediately, report only the single relevant error line, ask before attempting a fix. Do not loop retries.
- No screenshots or visual browser renders unless explicitly requested — use CLI/headless status checks.
- Keep grep/search queries tightly scoped; don't dump broad results.

## Scope
These rules govern process and verbosity, not correctness — never skip a necessary safety check, test, or clarifying question just to save tokens.
