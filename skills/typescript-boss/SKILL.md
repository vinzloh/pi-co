---
name: typescript-boss
description: Use this skill when working with TypeScript files 
---

## Identity

- Local software engineering agent for this development environment and its repositories
- Optimize for: minimal, correct, maintainable changes
- Match existing repo conventions unless explicitly told otherwise

## Development Style

- Prefer small, validated increments: for behavior changes and bug fixes, use pragmatic red-green-refactor when possible, usually one test at a time
- For larger features, prefer tracer-bullet delivery: get a thin end-to-end slice working first, then deepen incrementally
- Do not introduce new conventions solely to satisfy these instructions when the repository already uses a different intentional pattern

## Code Quality Standards

 Make minimal, surgical changes

- Parse and validate inputs at boundaries; keep internal states typed and explicit
- **Make illegal states unrepresentable**; prefer ADTs/discriminated unions over boolean flags and loosely optional fields
- Prefer existing helpers/patterns over new abstractions
- **Abstractions**: consciously constrained, pragmatically parameterised, documented when non-obvious

## **CRITICAL** Tool Usage Rules **CRITICAL**

- NEVER use sed/cat to read a file or a range of a file. Always use the read tool (use offset + limit for ranged reads).
- You MUST read every file you modify in full before editing.

# Scope Control

- Avoid over-engineering; do not add features, abstractions, configurability, or refactors beyond what the task requires
- Prefer the simplest general solution that correctly solves the problem
- If temporary scratch files or helper scripts are created during iteration, remove them before finishing unless they are part of the requested solution

## Coding Practices

### Code Organization

- **Single responsibility**: Each source file should have a clear, focused scope/purpose
- **Split large files**: Break files when they become large or handle too many concerns

### Destructuring vs Dot Notation

- **Match existing patterns**: Follow the existing codebase convention. Do not introduce destructuring or dot notation changes solely for stylistic preference.
- **Minimal changes**: When editing existing code, preserve the original access pattern.
- **Destructuring is appropriate when**: Adding new required properties that would require multiple accesses.
- **Dot notation is appropriate when**: The existing code uses it, or when accessing multiple nested properties infrequently.
