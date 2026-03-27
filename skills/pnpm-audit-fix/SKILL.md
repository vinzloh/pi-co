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
- If the vulnerable package is a direct dependency in `package.json`, run `pnpm up <pkg>^` to update only minor/patch versions (NEVER major version updates)
- If the vulnerable package is a transitive dependency (most common), add override to `package.json` under `pnpm.overrides` using the vulnerable version range:

  ```json
  "pnpm": {
    "overrides": {
      "<pkg>@<vulnerable-range>": "^<patched-version>"
    }
  }
  ```

  Examples:
  - `"picomatch@<2.3.2": "^2.3.2"` - patches picomatch versions below 2.3.2
  - `"yaml@>=1.0.0 <1.10.3": "^1.10.3"` - patches yaml versions in the vulnerable range

- Run `pnpm install` to apply overrides and verify with `pnpm audit`
- If still vulnerable, try `pnpm audit --fix` as a last resort
- Verify codebase with `pnpm lint`, `pnpm typecheck` (if present in `package.json`)
- Uncomment `minimumReleaseAge` in `pnpm-workspace.yaml`
- Make a commit

## Important Notes

- Some vulnerabilities may have multiple parent packages - check `pnpm why` output carefully
- Use `^` for override versions (not `>=`) to allow patches/minors while protecting against breaking major version changes

## Relevant files

- package.json
- pnpm-workspace.yaml
- pnpm-lock.yaml

## Commands

- `pnpm audit` - Check for vulnerabilities
- `pnpm audit --fix` - Auto-fix when available
- `pnpm why <pkg>` - Find dependency tree
- `pnpm up <pkg>@latest` - Update package
