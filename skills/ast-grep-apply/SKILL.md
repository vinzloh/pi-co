---
name: ast-grep-apply
description: ast-grep rules to perform structural code search and updates. 
---

# ast-grep Rules

This directory contains [ast-grep](https://ast-grep.github.io/) rules for structural code search and transformation.

## Available Rules

Rules are in `rules/` sub folder of this directory

| Rule | Description |
|------|-------------|
| `literal-array-includes.yml` | Transforms `['a', 'b'].includes(value)` → `arrayOf(value).includes(['a', 'b'])` |

## Usage

### Scan for matches

```bash
ast-grep scan --rule rules/RULE_NAME.yml <glob-pattern>
```

### Apply transformation

```bash
ast-grep scan --rule rules/RULE_NAME.yml --update-all <glob-pattern>
```

See [ast-grep documentation](https://github.com/ast-grep/ast-grep) for installation and usage.
