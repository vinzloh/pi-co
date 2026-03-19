---
description: git checkout new branch, auto name 
---

Checkout a new branch if starting from main/master, else stop here.

- identify changes:

```bash
DEFAULT_BRANCH=$(git symbolic-ref refs/remotes/origin/HEAD | sed 's@^refs/remotes/origin/@@')
git diff --name-only $DEFAULT_BRANCH...HEAD
```

- if there are no git diff changes, summarize session instead
- summarize changes into a terse 1-liner `<description>`
- read commit-message skill, and based on `<description>` pick suitable `<type>`
- remember `<branch_name>` as `<type>/<description>` when starting from main/master.
- create a branch: `git checkout -b "<branch_name>"`
