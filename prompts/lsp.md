---
description: use `jq` to query `tmp/symbols.json` -  /lsp your prompt
---
## Prerequisites

- Require `lsp-cli`. Check `lsp-cli --version`. If missing, ask the user to install `lsp-cli` from `https://github.com/badlogic/lsp-cli` and stop.
- Require `jq`. Check `jq --version`. If missing, ask the user to install `jq` and stop.
- Remember SYMBOL_FILE = `tmp/symbols.json`
- **ONLY use jq. DO NOT use bash, read, cat**

## Workflow

If `<SYMBOL_FILE>` does not exist, run command below to generate `<SYMBOL_FILE>`:

```bash
lsp-cli . typescript `<SYMBOL_FILE>`
```

- `<SYMBOL_FILE>` is a single JSON object with a symbols array generated from the TypeScript Language Server Protocol (LSP).
- **ONLY search relevant parts** of `<SYMBOL_FILE>` with `jq` and do: $@
