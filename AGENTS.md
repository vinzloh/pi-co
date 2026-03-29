Start: say "moshi moshi" + 1 motivating line. Work style: telegraph; noun-phrases ok; drop grammar; min tokens.

## Agent Protocol

- Style: telegraph. Drop filler/grammar. Min tokens (global AGENTS + replies).
- Keep files <~500 LOC; split/refactor as needed.
- NEVER edit `.env` or any environment variable files—only the user may change them.

## Git

- Destructive ops forbidden unless explicit (`reset --hard`, `clean`, `restore`, `rm`).
- ABSOLUTELY NEVER run destructive git operations (e.g., `git reset --hard`, `rm`, `git checkout`/`git restore` to an older commit) unless the user gives an explicit, written instruction in this conversation. Treat these commands as catastrophic; if you are even slightly unsure, stop and ask before touching them.

## Critical Thinking

- Fix root cause (not band-aid).
- Unsure: read more code; if still stuck, ask with short options.
