---
name: typescript-debt-collector
description: Use this skill for TypeScript files including read, edit, refactor, write.
---

## Coding Practices

- Check `node_modules` for external API type definitions instead of guessing

### Import Patterns

- **Namespace imports**: When a file uses `import * as React from 'react'`, maintain this pattern. Do not change to named imports unless:
  - The namespace is no longer used (e.g., no `React.*` references remain after other refactors)
  - The file is being fully rewritten
  - The user explicitly requests the change

- **Named imports**: Use when adding new React APIs to a file that doesn't already have the React namespace imported

### React Hook Patterns

- **Do not move or extract inline hooks for stylistic preference**: If `React.useMemo` or `React.useCallback` appears inline (e.g., inside an object literal, JSX
 prop, or hook configuration), keep it inline. Only extract if required for behavior correctness (e.g., adding dependencies, fixing a bug).
- **Keep existing react-hook-form patterns**: When a form uses `values` property (controlled form), maintain this pattern. Do not extract to `defaultValues` for
 stylistic preference alone.

    ```typescript
    // ✅ Keep as-is when already inline
    useForm({ values: { data: React.useMemo(() => compute(), [dep]) } })

    // ❌ Do not extract for style alone
    const defaultValues = React.useMemo(() => compute(), [dep])
    useForm({ defaultValues })


### Pattern Matching with ts-pattern

- **Use `match` from `ts-pattern`** when you have:
  - Multiple conditional branches (2+ conditions)
  - Complex conditions involving multiple variables
  - Pattern matching on object properties
  - Exhaustive checks needed

- **Prefer `match` over nested ternaries or if/else chains**:

     ```typescript
     // ❌ Avoid - nested ternary
     condition1 ? value1 : condition2 ? value2 : defaultValue

     // ❌ Avoid - if/else chain
     if (a && b) return x;
     if (c) return y;
     return z;

     // ✅ Use - match with patterns
     match({ a, b, c })
       .with({ a: true, b: true }, () => x)
       .with({ c: true }, () => y)
       .otherwise(() => z);

### TypeScript

- **Avoid complex inline types**: Extract complex types into dedicated `type` or `interface` declarations
- **Literal array `.includes()` pattern** - When checking if a variable exists in a hardcoded array (e.g., `['a', 'b', 'c'].includes(variable)`), use `arrayOf` (search in current folder and subfolders).

  **Pattern:**

  ```typescript
  // ❌ Avoid - literal array with includes
  ['update', 'import'].includes(key)

  // ✅ Use - arrayOf with flipped arguments
  arrayOf(key).includes(['update', 'import'])
  ```

- **No ESLint disable comments**: Never use `/* eslint-disable */`, `/* eslint-disable-next-line */`, or similar comments to suppress linting rules. Fix the underlying issue instead.
- **Never rely on underscore prefix to suppress unused variable warnings** - Some linters (e.g., oxlint) do not respect the `_variable` convention. Remove the variable from destructuring instead.

  ```typescript
  // ❌ Avoid - underscore prefix doesn't suppress the error
  function Component({ unusedProp: _unused, ...props }: Props) {
    // oxlint still reports: Parameter '_unused' is declared but never used
  }

  // ✅ Do - remove from destructuring if not needed
  function Component(props: Props) {
    // unusedProp stays in props
  }
  ```

- After edits, run in order 1. `pnpm --silent lint` then 2. `pnpm --silent typecheck` to verify
