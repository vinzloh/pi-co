---
name: commit-message
description: Use this skill before running git commit.
---

# Git Commit Tool / Skill

Commit message format to use when using git commit

## **CRITICAL** Forbidden Git Operations **CRITICAL**

These commands can destroy other agents' work:

- `git commit --no-verify` - bypasses required checks and is never allowed

## Commit Message Format

Subject line format: `<type>(<scope>): <short description>`

Type options (choose one):

- `fix`: Bug fixes, dependency issues, broken functionality
- `feat`: New features or functionality
- `docs`: Documentation changes
- `refactor`: Code restructuring without behavior changes
- `test`: Test additions or modifications
- `chore`: Maintenance tasks, config updates

Body requirements (MUST include):

- Add a blank line after the subject
- Use bullet points (-) to describe exactly:
     1. What was identified/found
     2. What action was taken
     3. Verification step (tests pass, typecheck succeeds, etc.)

## Commit Message Requirements

### Formatting Rules

- **File paths must use backticks** - e.g. `pi-protected-path`, `src/utils.ts`, `package.json`
- **Do not use double quotes** in commit messages; use single quotes or backticks instead

### Procedural Checklist

Before committing:

- [ ] Verify `git status` shows only the files you intended to change
- [ ] Keep commits atomic - include only files related to a single logical change

After committing (if `.git/COMMIT_EDITMSG` was used):

- [ ] Clean up the temporary file
