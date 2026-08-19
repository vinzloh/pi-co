# Predictability

Name + params + return tell the whole story. Same kind of function → same contract.

Source: https://frontend-fundamentals.com/code-quality/en/code/

---

## Manage unique names (don't shadow libraries)

https://frontend-fundamentals.com/code-quality/en/code/examples/http.html

Same name → same behavior. A wrapper that adds auth is not `http.get`.

**Smell:** service module re-exports as `http`; callers think it's the library.

```ts
import { http as httpLibrary } from "@some-library/http";

export const http = {
  async get(url: string) {
    const token = await fetchToken();
    return httpLibrary.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};
```

```ts
import { http } from "./http";

export async function fetchUser() {
  return http.get("...");
}
```

**Fix:** distinct module + method name that states the extra work.

```ts
import { http as httpLibrary } from "@some-library/http";

export const httpService = {
  async getWithAuth(url: string) {
    const token = await fetchToken();
    return httpLibrary.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};
```

```ts
import { httpService } from "./httpService";

export async function fetchUser() {
  return await httpService.getWithAuth("...");
}
```

---

## Unify return types for similar functions

https://frontend-fundamentals.com/code-quality/en/code/examples/use-user.html

Same *kind* of hook/function → same return shape. Otherwise every call site is a lookup.

### Query hooks

**Smell:** `useUser` returns the Query; `useServerTime` returns `query.data`.

```ts
function useUser() {
  const query = useQuery({ queryKey: ["user"], queryFn: fetchUser });
  return query;
}

function useServerTime() {
  const query = useQuery({ queryKey: ["serverTime"], queryFn: fetchServerTime });
  return query.data;
}
```

**Fix:** all API hooks return the Query object (or all return data — pick one and keep it).

```ts
function useUser() {
  return useQuery({ queryKey: ["user"], queryFn: fetchUser });
}

function useServerTime() {
  return useQuery({ queryKey: ["serverTime"], queryFn: fetchServerTime });
}
```

### Validators

**Smell:** `checkIsNameValid` → `boolean`; `checkIsAgeValid` → `{ ok, reason? }`. Truthy object always passes `if`.

```ts
function checkIsNameValid(name: string) {
  const isValid = name.length > 0 && name.length < 20;
  return isValid;
}

function checkIsAgeValid(age: number) {
  if (!Number.isInteger(age)) {
    return { ok: false, reason: "Age must be an integer." };
  }
  if (age < 18) {
    return { ok: false, reason: "Age must be 18 or older." };
  }
  if (age > 99) {
    return { ok: false, reason: "Age must be 99 or younger." };
  }
  return { ok: true };
}

if (checkIsNameValid(name)) { /* ok */ }
if (checkIsAgeValid(age)) { /* always runs — object is truthy */ }
```

**Fix:** every validator returns the same discriminated union.

```ts
type ValidationCheckReturnType = { ok: true } | { ok: false; reason: string };

function checkIsNameValid(name: string): ValidationCheckReturnType {
  if (name.length === 0) {
    return { ok: false, reason: "Name cannot be empty." };
  }
  if (name.length >= 20) {
    return { ok: false, reason: "Name cannot be longer than 20 characters" };
  }
  return { ok: true };
}

function checkIsAgeValid(age: number): ValidationCheckReturnType {
  if (!Number.isInteger(age)) {
    return { ok: false, reason: "Age must be an integer." };
  }
  if (age < 18) {
    return { ok: false, reason: "Age must be 18 or older." };
  }
  if (age > 99) {
    return { ok: false, reason: "Age must be 99 or younger." };
  }
  return { ok: true };
}
```

`ok: true` has no `reason` — compiler blocks `isAgeValid.reason` until you narrow.

---

## Reveal hidden logic

https://frontend-fundamentals.com/code-quality/en/code/examples/hidden-logic.html

If it isn't in the name, params, or return, don't do it inside.

**Smell:** `fetchBalance(): Promise<number>` also logs `balance_fetched`. Callers can't opt out; a logging throw breaks the fetch.

```ts
async function fetchBalance(): Promise<number> {
  const balance = await http.get<number>("...");
  logging.log("balance_fetched");
  return balance;
}
```

**Fix:** fetch fetches. Log at the call site (or a function whose name says it logs).

```ts
async function fetchBalance(): Promise<number> {
  return await http.get<number>("...");
}
```

```tsx
<Button
  onClick={async () => {
    const balance = await fetchBalance();
    logging.log("balance_fetched");
    await syncBalance(balance);
  }}
>
  Update Account Balance
</Button>
```
