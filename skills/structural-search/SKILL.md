---
name: structural-search
description: "Search code by AST structure using ast-grep. Find semantic patterns like function calls, imports, class definitions instead of text patterns. Triggers on: find all calls to X, search for pattern, refactor usages, find where function is used, structural search, ast-grep."
compatibility: "Requires ast-grep CLI tool. Install: brew install ast-grep."
allowed-tools: "Bash"
metadata:
  author: https://github.com/0xDarkMatter/claude-mods/tree/main/skills/structural-search
---

# Structural Search

Search code by its abstract syntax tree (AST) structure. Finds semantic patterns that regex cannot match reliably.

## Tools

| Tool | Command | Use For |
|------|---------|---------|
| ast-grep | `ast-grep -p 'pattern'` | AST-aware code search |

## Pattern Syntax

| Pattern | Matches | Example |
|---------|---------|---------|
| `$NAME` | Named identifier | `function $NAME() {}` |
| `$_` | Any single node | `console.log($_)` |
| `$$$` | Zero or more nodes | `function $_($$$) {}` |

## Top 10 Essential Patterns

```bash
# 1. Find console.log calls
ast-grep -p 'console.log($_)'

# 2. Find React hooks
ast-grep -p 'const [$_, $_] = useState($_)'
ast-grep -p 'useEffect($_, [$$$])'

# 3. Find function definitions
ast-grep -p 'function $NAME($$$) { $$$ }'
ast-grep -p 'def $NAME($$$): $$$' --lang python

# 4. Find imports
ast-grep -p 'import $_ from "$_"'
ast-grep -p 'from $_ import $_' --lang python

# 5. Find async patterns
ast-grep -p 'await $_'
ast-grep -p 'async function $NAME($$$) { $$$ }'

# 6. Find error handling
ast-grep -p 'try { $$$ } catch ($_) { $$$ }'
ast-grep -p 'if err != nil { $$$ }' --lang go

# 7. Find potential issues
ast-grep -p '$_ == $_'           # == instead of ===
ast-grep -p 'eval($_)'           # Security risk
ast-grep -p '$_.innerHTML = $_'  # XSS vector

# 8. Preview refactoring
ast-grep -p 'console.log($_)' -r 'logger.info($_)'

# 9. Apply refactoring
ast-grep -p 'var $NAME = $_' -r 'const $NAME = $_' --rewrite

# 10. Search specific language
ast-grep -p 'pattern' --lang typescript
```

## Quick Reference

| Task | Command |
|------|---------|
| Find pattern | `ast-grep -p 'pattern'` |
| Specific language | `ast-grep -p 'pattern' --lang python` |
| Replace (preview) | `ast-grep -p 'old' -r 'new'` |
| Replace (apply) | `ast-grep -p 'old' -r 'new' --rewrite` |
| Show context | `ast-grep -p 'pattern' -A 3` |
| JSON output | `ast-grep -p 'pattern' --json` |
| File list only | `ast-grep -p 'pattern' -l` |
| Count matches | `ast-grep -p 'pattern' --count` |
| Run YAML rules | `ast-grep scan` |

## When to Use

- Finding all usages of a function/method
- Locating specific code patterns (hooks, API calls)
- Preparing for large-scale refactoring
- When regex would match false positives
- Detecting anti-patterns and security issues
- Creating custom linting rules

## Additional Resources

For complete patterns, load:

- `./references/js-ts-patterns.md` - JavaScript/TypeScript patterns
- `./assets/rule-template.yaml` - Starter template for custom rules
