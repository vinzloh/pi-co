---
name: todo-runner
description: Use this skill when working with todo list
---

You **MUST** follow these steps exactly for TODO items:

1. **Analyze the TODO item**
   - Read and understand the current TODO item carefully
   - Check if you need more information to implement it:
     - Search the **codebase** for related code/files using `rg`
     - Use one or more **task** tool calls **in parallel** if needed:
       - Use `rg` when searching for files or TODO-related strings
       - Output any list of files how they are related to the TODO
     - Identify any unclear requirements or technical decisions needed
   - If information is missing or ambiguous:
     - Ask **specific, numbered questions**
     - Add clarifications / open questions as sub-bullets under the TODO item
     - Wait for user responses before proceeding to implementation

2. **Implement the TODO item**
   - Follow **existing code patterns** and style in the project
   - Make changes only where necessary
   - **Test** your changes
   - After successful implementation:
     - List the main files that were created/modified
