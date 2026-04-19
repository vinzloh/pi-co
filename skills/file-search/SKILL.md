---
name: file-search
description: "Modern file and content search using fd, ripgrep (rg). Triggers on: fd, ripgrep, rg, find files, search code, fuzzy find, search codebase."
license: MIT
compatibility: "Requires fd, ripgrep (rg). Install: brew install fd ripgrep"
allowed-tools: "Bash"
metadata:
  source: https://github.com/0xDarkMatter/claude-mods/blob/main/skills/file-search
---

# File Search

Modern file and content search.

## fd - Find Files

```bash
# Find by name
fd config                    # Files containing "config"
fd -e py                     # Python files

# By type
fd -t f config               # Files only
fd -t d src                  # Directories only

# Exclude
fd -E node_modules           # Exclude directory
fd -E "*.min.js"             # Exclude pattern

# Execute command
fd -e py -x wc -l            # Line count per file
```

## rg - Search Content

```bash
# Simple search
rg "TODO"                    # Find TODO
rg -i "error"                # Case-insensitive

# By file type
rg -t py "import"            # Python files only
rg -t js -t ts "async"       # JS and TS

# Context
rg -C 3 "function"           # 3 lines before/after

# Output modes
rg -l "TODO"                 # File names only
rg -c "TODO"                 # Count per file
```

## Combined Patterns

```bash
# Find files, search content
fd -e py -x rg "async def" {}
```

## Quick Reference

| Task | Command |
|------|---------|
| Find TS files | `fd -e ts` |
| Find in src | `fd -e ts src/` |
| Search pattern | `rg "pattern"` |
| Search in type | `rg -t py "import"` |
| Files with match | `rg -l "pattern"` |
| Count matches | `rg -c "pattern"` |

## Performance Tips

| Tip | Why |
|-----|-----|
| Both respect `.gitignore` | Auto-skip node_modules, dist |
| Use `-t` over `-g` | Type flags are faster |
| Narrow the path | `rg pattern src/` faster |
| Use `-F` for literals | Avoids regex overhead |

## Additional Resources

For detailed patterns, load:

- `./references/advanced-workflows.md` - Git integration, shell functions, power workflows
