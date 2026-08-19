---
description: Convert a webpage to clean Markdown via defuddle.md
argument-hint: "<url>"
---

Fetch $1 as Markdown via defuddle.md.

Strip `http://` or `https://` from the URL, then:

```bash
curl -sS "https://defuddle.md/<host/path>"
```

Return the Markdown as-is. Summarize only if asked.
On HTTP error or empty body, report status and stop.
Do not invent content. Public pages only.
