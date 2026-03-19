---
description: Grok PR and suggests refactors 
---

## Prerequisites

- Require GitHub CLI `gh`. Check `gh --version`. If missing, ask the user to install `gh` and stop.
- Require authenticated `gh` session. Run `gh auth status`. If not authenticated, ask the user to run `gh auth login` (and re-run `gh auth status`) before continuing.

## Naming conventions

- Branch: `refactor/{description}` when starting from main/master.
- Commit: `{description}` (terse).
- PR title: `refactor: {description}` summarizing the full diff.

## Workflow

- If on main/master, create a branch: `git checkout -b "refactor/{description}"`
- Otherwise stay on the current branch.
- Read typescript-boss skill
- Read typescript-reviewer skill
- Read only typescript-related diffs from $@
- Suggest improvements in a bulleted list to interview user to proceed
