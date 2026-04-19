---
name: commit-message
description: Use this skill before running git commit.
metadata:
  sources: 
    https://github.com/0xDarkMatter/claude-mods/blob/main/rules/commit-style.md
---

# Git Commit Skill

Commit message format to use when using git commit

## **CRITICAL** Forbidden Git Operations **CRITICAL**

These commands can destroy other agents' work:

- `git commit --no-verify` - bypasses required checks and is never allowed

## Format

```
<type>(<scope>): <description>

[optional body]
```

## Types

| Type | When to Use | Example |
|------|-------------|---------|
| `feat` | New feature or functionality | `feat: Add docker-expert agent` |
| `fix` | Bug fixes, dependency issues, broken functionality | `fix: Correct skill routing in python-expert` |
| `docs` | Documentation changes| `docs: Update ARCHITECTURE.md` |
| `refactor` | Code change (neither fix nor feat) | `refactor: Streamline agent frontmatter` |
| `chore` | Maintenance, config | `chore: Bump plugin version to 1.3.0` |
| `style` | Formatting, whitespace (no logic) | `style: Fix markdown table alignment` |
| `test` | Adding or updating tests | `test: Add skill functional tests` |
| `perf` | Performance improvement | `perf: Optimize skill loading` |

## Rules

- **Subject line**: Max 72 characters, imperative mood ("Add" not "Added")
- **No period** at end of subject line
- **Scope is optional** but recommended for component-specific changes
- **Body**: Wrap at 72 characters, explain "what" and "why"
- **File paths must use backticks** - e.g. `pi-protected-path`, `src/utils.ts`, `package.json`
- **Do not use double quotes** in commit messages; use single quotes or backticks instead

## Examples

### Simple Feature

```
feat(agents): Add docker-expert agent
```

### Bug Fix with Context

```
fix(skills): Correct dependency resolution in python-async-patterns

The depends-on field was not being parsed correctly when multiple
dependencies were specified. Now handles arrays properly.
```

### Documentation Update

```
docs: Add authority levels to `ARCHITECTURE.md`
```

### Multi-component Change

```
feat: Add Go/Rust agents, enhance setperms with AI CLIs

- Add go-expert and rust-expert agents
- Add AI CLI tools (gemini, claude, codex) to setperms
- Add git safety rules to cli-tools
```

## Anti-patterns

```
BAD:  "Updated stuff"           - Vague, no type
BAD:  "feat: added new agent."  - Past tense, trailing period
BAD:  "FEAT: Add agent"         - Uppercase type
BAD:  "feat(agents): Add the new docker expert agent for containerization"
      - Too long (> 72 chars)

GOOD: "feat(agents): Add docker-expert agent"
```

## Procedural Checklist

Before committing:

- [ ] Verify `git status` shows only the files you intended to change
- [ ] Keep commits atomic - include only files related to a single logical change

After committing (if `.git/COMMIT_EDITMSG` was used):

- [ ] Clean up the temporary file
