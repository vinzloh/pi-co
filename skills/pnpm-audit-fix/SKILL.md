---
name: pnpm-audit-fix
description: Use this skill when `pnpm audit` is executed.
---

# Fix issues from running `pnpm audit`

This skill attempts to fix dependency vulnerabilities from `pnpm audit`.

## Requirements

- `pnpm` should be installed, if not available, stop here.
- run `pnpm audit` if required. if there are no vulnerabilities, stop here.
- In `pnpm-workspace.yaml`, comment out `minimumReleaseAge` line (if present)
- Identify vulnerable dependency with `pnpm why <dependency>`
- For top parent dependency from `pnpm why`, run `pnpm up <parent>@latest` and verify with `pnpm audit`
- If not fixed, try `pnpm audit --fix` first (automatic resolution when available) and verify with `pnpm audit`
- If still vulnerable, add override to `package.json` under `pnpm.overrides`:

  ```json
  "pnpm": {
    "overrides": {
      "<dependency>": ">=<patched-version>"
    }
  }
  ```

- Run `pnpm install` to apply overrides and verify with `pnpm audit`
- Verify codebase with `pnpm lint`, `pnpm typecheck` (if present in `package.json`)
- Uncomment `minimumReleaseAge` in `pnpm-workspace.yaml`
- Make a commit

## Important Notes

- Some vulnerabilities may have multiple parent packages - check `pnpm why` output carefully

## Relevant files

- package.json
- pnpm-workspace.yaml
- pnpm-lock.yaml

## Commands

- `pnpm audit` - Check for vulnerabilities
- `pnpm audit --fix` - Auto-fix when available
- `pnpm why <pkg>` - Find dependency tree
- `pnpm up <pkg>@latest` - Update package
