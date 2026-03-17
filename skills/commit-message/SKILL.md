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

## Important requirements for commit message

- Do not use quotes, instead use backtick "`"
- **Always wrap file paths in backticks** - e.g. \`pi-protected-path\`, \`src/utils.ts\`, \`package.json\`
- Escape backticks with backslash when needed: \`pi-protected-paths\`
- If `.git/COMMIT_EDITMSG` was used, clean it up after use.
