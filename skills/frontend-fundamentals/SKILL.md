---
name: frontend-fundamentals
description: Apply Toss Frontend Fundamentals — write easily-modifiable frontend code via readability, predictability, cohesion, and low coupling. Use when writing, reviewing, or refactoring React/frontend components, hooks, or forms.
metadata:
  sources:
    https://frontend-fundamentals.com/code-quality/en/code/
---

# Frontend Fundamentals

Good frontend code is **easily modifiable**. Judge changes on four axes. They conflict — pick for the situation, don't max all four.

| Axis | Question |
|------|----------|
| Readability | Can I understand this top-to-bottom without extra context? |
| Predictability | Does name + params + return tell the whole story? |
| Cohesion | Will things that must change together actually change together? |
| Coupling | How wide is the blast radius of this edit? |

**Conflict rule:** if skipping a joint change can break things → cohesion wins (abstract). If risk is low → readability wins (duplicate). Don't unify lookalike code that will diverge.

---

## 1. Readability

Fewer simultaneous contexts. Read top to bottom.

### Separate code that never runs together

One component/function, two mutually exclusive paths → split. Merge branches at the top.

```tsx
// ❌ viewer + admin intermixed
function SubmitButton() {
  const isViewer = useRole() === "viewer";
  useEffect(() => {
    if (isViewer) return;
    showButtonAnimation();
  }, [isViewer]);
  return isViewer ? <TextButton disabled>Submit</TextButton> : <Button type="submit">Submit</Button>;
}

// ✅ one branch each
function SubmitButton() {
  const isViewer = useRole() === "viewer";
  return isViewer ? <ViewerSubmitButton /> : <AdminSubmitButton />;
}
```

### Abstract implementation details

Page/feature components should not expose guard/consent/IO guts. Wrapper, HOC, or child that owns the handler.

```tsx
// ❌ login page also does auth redirect
function LoginStartPage() {
  useCheckLogin({ onChecked: (status) => { if (status === "LOGGED_IN") location.href = "/home"; } });
  return <>{/* login UI */}</>;
}

// ✅ guard owns redirect; page owns login
<AuthGuard><LoginStartPage /></AuthGuard>
```

Keep click handler next to the button that fires it (`InviteButton` owns overlay + `sendPush`).

### Don't bucket by logic type

Don't make `usePageState` / "all queries" / "all handlers" bags. Split by *what changes together* (`useCardIdQueryParam`), not by *kind* (state vs query vs API).

### Name complex conditions

Name when nested, reused, or testable. Leave `arr.map(x => x * 2)` alone.

```ts
// ❌
products.filter((p) => p.categories.some((c) => c.id === target.id && p.prices.some((n) => n >= min && n <= max)))

// ✅
const isSameCategory = category.id === targetCategory.id;
const isPriceInRange = product.prices.some((price) => price >= minPrice && price <= maxPrice);
return isSameCategory && isPriceInRange;
```

### Name magic numbers

`delay(300)` — animation? debounce leftover? Name it: `ANIMATION_DELAY_MS`. Same number in two places that must stay in sync → one named constant (cohesion).

### Reduce eye movement

Don't hop `policy.canInvite` → `getPolicyByRole` → `POLICY_SET` for a 2-role table. Inline, or keep the map next to the JSX.

```tsx
const policy = {
  admin: { canInvite: true, canView: true },
  viewer: { canInvite: false, canView: true },
}[user.role];
```

Use a policy module only when the matrix is actually complex.

### Flatten nested ternaries

```ts
// ❌
A && B ? "BOTH" : A || B ? (A ? "A" : "B") : "NONE"

// ✅
if (A && B) return "BOTH";
if (A) return "A";
if (B) return "B";
return "NONE";
```

---

## 2. Predictability

Same name → same behavior. Same *kind* of function → same return shape. No hidden work.

### Don't shadow library names

Wrapper that fetches a token is not `http.get`. Call it `httpService.getWithAuth`.

### Unify return types for similar functions

All query hooks return the query object, or all return `data` — pick one. All validators return `boolean`, or all return `{ ok, reason? }` — pick one.

Mismatched validators are bugs waiting:

```ts
if (checkIsNameValid(name)) { /* boolean — ok */ }
if (checkIsAgeValid(age)) { /* always truthy object — always runs */ }
```

Prefer `{ ok: true } | { ok: false; reason: string }`.

### Expose hidden logic

`fetchBalance()` must not also `logging.log(...)`. Name/params/return are the contract. Side effects belong at the call site (or in a function whose name says so).

---

## 3. Cohesion

Code that must change together lives together.

### Colocate by change, not by type

```
❌ src/{components,hooks,utils,constants}/   # type buckets; orphans on delete
✅ src/domains/Domain1/{components,hooks,...}  # delete the folder, feature gone
```

Cross-domain `import { useFoo } from "../../../Domain2/hooks/useFoo"` is a smell.

Shared root `components/` / `hooks/` only for truly project-wide code.

### Forms: pick the change unit

| Choose | When |
|--------|------|
| Field-level (`register` + per-field `validate`) | Independent / async / reusable fields (email check, promo code) |
| Form-level (zod/schema on the whole form) | One business action; wizard steps; fields depend on each other (password confirm, totals) |

Don't mix both for the same form without a reason.

---

## 4. Coupling

Small blast radius.

### One responsibility per hook/component

`usePageState` that owns every query param: any field change re-renders everyone, and every page hook depends on the bag. Split per param.

### Allow duplication

Don't extract `useOpenMaintenanceBottomSheet` just because two pages look alike. Extract only if behavior, copy, logging, and close-semantics will stay the same.

If pages will diverge (different logs, skip `closeView`, different copy) → duplicate. Shared hook with 6 flags is the failure mode.

### Kill props drilling

Passthrough props (`keyword`, `items`, `recommendedItems`, `onConfirm` through `ItemEditBody` that doesn't use them) couple the whole tree. Compose: parent renders the pieces that need the data; delete the middleman.

```tsx
// ✅ parent composes; no ItemEditBody passthrough
<Modal>
  <Input value={keyword} onChange={...} />
  <ItemEditList keyword={keyword} items={items} recommendedItems={recommendedItems} onConfirm={onConfirm} />
</Modal>
```

---

## Review checklist

- [ ] Exclusive branches split, not interwoven
- [ ] Implementation details not leaking into page-level components
- [ ] No god hooks/components bagged by "type of logic"
- [ ] Nested conditions / magic numbers named
- [ ] Readable top-to-bottom; no policy treasure hunts
- [ ] Similar functions share return shape; names don't lie; no hidden side effects
- [ ] Feature files colocated; dead feature = delete one dir
- [ ] Form cohesion matches the real change unit
- [ ] Duplication kept when futures diverge
- [ ] No passthrough props / unnecessary middle components
