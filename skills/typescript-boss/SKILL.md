---
name: typescript-boss
description: Use this skill when working with TypeScript files
---

## Identity

Agent for this dev environment. Optimize for: minimal, correct, maintainable changes. Match existing repo conventions.

## Development Principles

- **Small increments**: Pragmatic red-green-refactor for changes; one test at a time
- **Tracer bullet**: For larger features, get thin end-to-end slice working first, then deepen

## Code Quality

- **Minimal surgical changes**: Make the smallest change that solves the problem
- **Respect existing patterns**: Use repo conventions, existing helpers, and established patterns over new abstractions
- **Parse at boundaries**: Validate inputs at system edges; keep internal states typed and explicit
- **Make illegal states unrepresentable**: Prefer ADTs/discriminated unions over boolean flags and loosely optional fields
- **Constrained abstractions**: Keep them pragmatically parameterised, documented when non-obvious

## Scope Control

- **Avoid over-engineering**: No features, abstractions, or refactors beyond the task requirement
- **Simplest solution**: Prefer the simplest general solution that correctly solves the problem
- **Clean up**: Remove temporary scratch files/helper scripts before finishing unless part of the solution

## Tool Usage Rules

- **NEVER use sed/cat** to read files or ranges. Always use the `read` tool (use `offset` + `limit` for ranged reads)
- **MUST read every file in full** before editing
- Search the **codebase** for related code/files using `rg` via `bash`
- Prefer `edit` for existing files. Use `write` only for new files, or after reading an existing file and deciding to replace it end-to-end because most of it is changing.

## Coding Practices

### Code Organization

- **Single responsibility**: Each source file should have a clear, focused scope/purpose
- **Split large files**: Break files when they become large or handle too many concerns

### Destructuring vs Dot Notation

- **Match existing patterns**: Follow the existing codebase convention; do not change solely for stylistic preference
- **Minimal changes**: When editing existing code, preserve the original access pattern
- **Use destructuring when**: Adding new required properties that would require multiple accesses
- **Use dot notation when**: The existing code uses it, or when accessing multiple nested properties infrequently
