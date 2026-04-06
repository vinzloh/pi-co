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

Some rules depend on others and must run **sequentially in order**:

| Sequence | Rules | Description |
|----------|-------|-------------|
| Array includes | `literal-array-includes.yml` → `add-arrayof-import.yml` | First transforms array includes to `arrayOf()`, then adds the import |

Sequential rules must use `&&` or run separately in order:

```bash
# Run sequence in order
ast-grep scan --rule rules/literal-array-includes.yml --update-all <glob-pattern> && \
ast-grep scan --rule rules/add-arrayof-import.yml --update-all <glob-pattern>
```

**Independent rules** (e.g., `react-hooks-direct-import.yml`) can be run standalone or in parallel:

```bash
# Run independently
ast-grep scan --rule rules/react-hooks-direct-import.yml --update-all <glob-pattern>
```
