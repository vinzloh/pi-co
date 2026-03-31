---
name: ast-grep-apply
description: ast-grep rules to perform structural code search and updates. 
---

# ast-grep Rules

This directory contains [ast-grep](https://ast-grep.github.io/) rules for structural code search and transformation.

## Prerequisites

- require `ast-grep`. Check `ast-grep --version`. If missing, ask the user to install [ast-grep](https://github.com/ast-grep/ast-grep) and stop here.

## Available Rules

Rules are in `rules/` sub folder of this directory

| Rule | Description |
|------|-------------|
| `literal-array-includes.yml` | Transforms `['a', 'b'].includes(value)` → `arrayOf(value).includes(['a', 'b'])` |
| `add-arrayof-import.yml` | Adds missing `import { arrayOf } from '@/shared/arrayOf'` when `arrayOf()` is used |

## Usage

### Scan for matches

```bash
ast-grep scan --rule rules/RULE_NAME.yml <glob-pattern>
```

### Apply transformation

```bash
ast-grep scan --rule rules/RULE_NAME.yml --update-all <glob-pattern>
```
