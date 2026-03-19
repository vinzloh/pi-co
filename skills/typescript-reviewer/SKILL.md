---
name: typescript-reviewer
description: Use this skill for TypeScript files including read, edit, refactor, write.
---

## Core Principles

- **Never compromise type safety**: No `any`, no non-null assertions (`!`), no unsafe type casts
- **Check `node_modules`** for external API type definitions instead of guessing
- **Post-edit verification**: Run `pnpm --silent lint` then `pnpm --silent typecheck`

---

## Import Patterns

| Pattern | Use When |
|---------|----------|
| `import * as Namespace` | File already uses namespace imports (e.g., `React.useMemo`). **Do not convert** to named imports unless: namespace no longer used, full file rewrite, or user explicitly requests it |
| Named imports (`import { x }`) | Adding new APIs to files without established namespace patterns |

> Common namespace examples: `import * as React from 'react'`, `import * as RadixDialog from '@radix-ui/react-dialog'`

---

## React Patterns

### Hooks: Keep Inline
- **Do not extract** inline hooks (`React.useMemo`, `React.useCallback`) for stylistic preference
- Keep them inline in object literals, JSX props, or hook configurations
- Only extract if required for behavior correctness (bug fixes, dependency changes)

```typescript
// ✅ Keep as-is
useForm({ values: { data: React.useMemo(() => compute(), [dep]) } })

// ❌ Don't extract for style alone
const defaultValues = React.useMemo(() => compute(), [dep])
useForm({ defaultValues })
```

### Forms: Preserve Patterns
- When a form uses `values` (controlled), maintain it. Don't convert to `defaultValues` for style.

---

## Control Flow (ts-pattern)

Use `match` from `ts-pattern` when you have:
- 2+ conditional branches
- Complex conditions with multiple variables  
- Pattern matching on object properties
- Need exhaustive checks

**Rules:**
1. **Replace nested ternaries and if/else chains**
2. **Match on source values**, not derived booleans

```typescript
// ❌ Avoid - nested ternary
condition1 ? value1 : condition2 ? value2 : defaultValue

// ❌ Avoid - derived boolean props
match({ isV6Plan: planVersion === 6 }).with({ isV6Plan: true }, ...)

// ✅ Use - match on sources
match({ planVersion, i18nLabel })
  .with({ planVersion: 6, i18nLabel: 'back_in_stock_alert' }, ...)
  .otherwise(...)
```

---

## Type Patterns

### Literal Array Membership
Use `arrayOf` utility (search current folder/subfolders) instead of `.includes()` on literal arrays:

```typescript
// ❌ Avoid
['update', 'import'].includes(key)

// ✅ Use
arrayOf(key).includes(['update', 'import'])
```

Add `as const` for precise literal inference:
```typescript
// ❌ Widened to string[]
const FIELDS = ['id', 'created_at']

// ✅ Narrowed to readonly ['id', 'created_at']
const FIELDS = ['id', 'created_at'] as const
```

### Complex Types
Extract complex inline types into dedicated `type` or `interface` declarations

---

## Code Quality

| Don't | Do Instead |
|-------|-----------|
| `/* eslint-disable */` comments | Fix the underlying issue |
| `_unused` prefix for unused vars | Remove from destructuring entirely |

```typescript
// ❌ Underscore doesn't suppress oxlint
function Component({ unusedProp: _unused, ...props }: Props) {}

// ✅ Remove unused from destructuring
function Component(props: Props) {}
```
