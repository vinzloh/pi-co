---
name: typescript
description: Use this skill for TypeScript files including read, edit, refactor, write.
---

## Coding Practices

- Check `node_modules` for external API type definitions instead of guessing

### TypeScript

- **NEVER use inline imports** - no `await import("./foo.js")`, no `import("pkg").Type` in type positions, no dynamic imports for types.
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

- After edits, run `pnpm --silent lint` and `pnpm --silent typecheck` to verify
