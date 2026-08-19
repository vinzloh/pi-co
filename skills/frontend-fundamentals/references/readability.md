# Readability

Fewer simultaneous contexts. Read top to bottom.

Source: https://frontend-fundamentals.com/code-quality/en/code/

---

## Separate code that doesn't execute together

https://frontend-fundamentals.com/code-quality/en/code/examples/submit-button.html

If mutually exclusive paths live in one function/component, the reader holds both at once.

**Smell:** `<SubmitButton />` mixes viewer (disabled, no animation) and admin (enabled + animation).

```tsx
function SubmitButton() {
  const isViewer = useRole() === "viewer";

  useEffect(() => {
    if (isViewer) {
      return;
    }
    showButtonAnimation();
  }, [isViewer]);

  return isViewer ? (
    <TextButton disabled>Submit</TextButton>
  ) : (
    <Button type="submit">Submit</Button>
  );
}
```

**Fix:** merge the branch at the top; each child owns one path.

```tsx
function SubmitButton() {
  const isViewer = useRole() === "viewer";
  return isViewer ? <ViewerSubmitButton /> : <AdminSubmitButton />;
}

function ViewerSubmitButton() {
  return <TextButton disabled>Submit</TextButton>;
}

function AdminSubmitButton() {
  useEffect(() => {
    showButtonAnimation();
  }, []);

  return <Button type="submit">Submit</Button>;
}
```

---

## Abstract implementation details

https://frontend-fundamentals.com/code-quality/en/code/examples/login-start-page.html

A reader can hold ~6–7 contexts. Hide guts that aren't the component's job.

### LoginStartPage

**Smell:** page exposes `useCheckLogin` / `onChecked` / `"LOGGED_IN"` plus login UI.

```tsx
function LoginStartPage() {
  useCheckLogin({
    onChecked: (status) => {
      if (status === "LOGGED_IN") {
        location.href = "/home";
      }
    }
  });

  /* ... login related logic ... */
  return <>{/* ... login related components ... */}</>;
}
```

**Fix A — wrapper:**

```tsx
function App() {
  return (
    <AuthGuard>
      <LoginStartPage />
    </AuthGuard>
  );
}

function AuthGuard({ children }) {
  const status = useCheckLoginStatus();

  useEffect(() => {
    if (status === "LOGGED_IN") {
      location.href = "/home";
    }
  }, [status]);

  return status !== "LOGGED_IN" ? children : null;
}

function LoginStartPage() {
  /* ... login related logic ... */
  return <>{/* ... login related components ... */}</>;
}
```

**Fix B — HOC:**

```tsx
function LoginStartPage() {
  /* ... login related logic ... */
  return <>{/* ... login related components ... */}</>;
}

export default withAuthGuard(LoginStartPage);

function withAuthGuard(WrappedComponent) {
  return function AuthGuard(props) {
    const status = useCheckLoginStatus();

    useEffect(() => {
      if (status === "LOGGED_IN") {
        location.href = "/home";
      }
    }, [status]);

    return status !== "LOGGED_IN" ? <WrappedComponent {...props} /> : null;
  };
}
```

Separated units must not reach into each other.

### FriendInvitation (handler next to the button)

**Smell:** consent overlay lives in the page; button that fires it is far away (cohesion hit too).

```tsx
function FriendInvitation() {
  const { data } = useQuery(/* ... */);

  const handleClick = async () => {
    const canInvite = await overlay.openAsync(({ isOpen, close }) => (
      <ConfirmDialog
        title={`Share with ${data.name}`}
        cancelButton={
          <ConfirmDialog.CancelButton onClick={() => close(false)}>
            Close
          </ConfirmDialog.CancelButton>
        }
        confirmButton={
          <ConfirmDialog.ConfirmButton onClick={() => close(true)}>
            Confirm
          </ConfirmDialog.ConfirmButton>
        }
      />
    ));

    if (canInvite) {
      await sendPush();
    }
  };

  return (
    <>
      <Button onClick={handleClick}>Invite</Button>
      {/* JSX ... */}
    </>
  );
}
```

**Fix:** `<InviteButton />` owns consent + send. Page stays a page.

```tsx
export function FriendInvitation() {
  const { data } = useQuery(/* ... */);

  return (
    <>
      <InviteButton name={data.name} />
      {/* JSX ... */}
    </>
  );
}

function InviteButton({ name }) {
  return (
    <Button
      onClick={async () => {
        const canInvite = await overlay.openAsync(({ isOpen, close }) => (
          <ConfirmDialog
            title={`Share with ${name}`}
            cancelButton={
              <ConfirmDialog.CancelButton onClick={() => close(false)}>
                Close
              </ConfirmDialog.CancelButton>
            }
            confirmButton={
              <ConfirmDialog.ConfirmButton onClick={() => close(true)}>
                Confirm
              </ConfirmDialog.ConfirmButton>
            }
          />
        ));

        if (canInvite) {
          await sendPush();
        }
      }}
    >
      Invite
    </Button>
  );
}
```

---

## Split functions combined by logic type

https://frontend-fundamentals.com/code-quality/en/code/examples/use-page-state-readability.html

Don't bucket by *kind* (all query params, all handlers). Scope grows forever; every consumer re-renders on any field.

**Smell:** `usePageState()` owns the whole page query string.

```ts
export function usePageState() {
  const [query, setQuery] = useQueryParams({
    cardId: NumberParam,
    statementId: NumberParam,
    dateFrom: DateParam,
    dateTo: DateParam,
    statusList: ArrayParam
  });

  return useMemo(
    () => ({
      values: {
        cardId: query.cardId ?? undefined,
        statementId: query.statementId ?? undefined,
        dateFrom: query.dateFrom == null ? defaultDateFrom : moment(query.dateFrom),
        dateTo: query.dateTo == null ? defaultDateTo : moment(query.dateTo),
        statusList: query.statusList as StatementStatusType[] | undefined
      },
      controls: {
        setCardId: (cardId: number) => setQuery({ cardId }, "replaceIn"),
        setStatementId: (statementId: number) => setQuery({ statementId }, "replaceIn"),
        setDateFrom: (date?: Moment) => setQuery({ dateFrom: date?.toDate() }, "replaceIn"),
        setDateTo: (date?: Moment) => setQuery({ dateTo: date?.toDate() }, "replaceIn"),
        setStatusList: (statusList?: StatementStatusType[]) =>
          setQuery({ statusList }, "replaceIn")
      }
    }),
    [query, setQuery]
  );
}
```

**Fix:** one hook per param. Clearer name, smaller blast radius (also a coupling win).

```ts
export function useCardIdQueryParam() {
  const [cardId, _setCardId] = useQueryParam("cardId", NumberParam);

  const setCardId = useCallback((cardId: number) => {
    _setCardId({ cardId }, "replaceIn");
  }, []);

  return [cardId ?? undefined, setCardId] as const;
}
```

Also see [coupling](coupling.md#one-responsibility-per-hook).

---

## Name complex conditions

https://frontend-fundamentals.com/code-quality/en/code/examples/condition-name.html

**Smell:** nested `filter` / `some` / `&&` with no names.

```ts
const result = products.filter((product) =>
  product.categories.some(
    (category) =>
      category.id === targetCategory.id &&
      product.prices.some((price) => price >= minPrice && price <= maxPrice)
  )
);
```

**Fix:**

```ts
const matchedProducts = products.filter((product) => {
  return product.categories.some((category) => {
    const isSameCategory = category.id === targetCategory.id;
    const isPriceInRange = product.prices.some(
      (price) => price >= minPrice && price <= maxPrice
    );
    return isSameCategory && isPriceInRange;
  });
});
```

**Name when:** complex, reused, or needs a unit test.

**Don't name:** `arr.map(x => x * 2)`, or one-shot simple logic.

---

## Name magic numbers

https://frontend-fundamentals.com/code-quality/en/code/examples/magic-number-readability.html

**Smell:** `delay(300)` — animation? network settle? leftover test?

```ts
async function onLikeClick() {
  await postLike(url);
  await delay(300);
  await refetchPostLike();
}
```

**Fix:**

```ts
const ANIMATION_DELAY_MS = 300;

async function onLikeClick() {
  await postLike(url);
  await delay(ANIMATION_DELAY_MS);
  await refetchPostLike();
}
```

Same number that must stay in sync with another site → named constant is also cohesion. See [cohesion](cohesion.md#eliminate-magic-numbers).

---

## Reduce context switching (eye movement)

https://frontend-fundamentals.com/code-quality/en/code/examples/user-policy.html

**Smell:** to know why Invite is disabled: `policy.canInvite` → `getPolicyByRole` → `POLICY_SET`. Three hops for a 2-role table.

```tsx
function Page() {
  const user = useUser();
  const policy = getPolicyByRole(user.role);

  return (
    <div>
      <Button disabled={!policy.canInvite}>Invite</Button>
      <Button disabled={!policy.canView}>View</Button>
    </div>
  );
}

function getPolicyByRole(role) {
  const policy = POLICY_SET[role];
  return {
    canInvite: policy.includes("invite"),
    canView: policy.includes("view")
  };
}

const POLICY_SET = {
  admin: ["invite", "view"],
  viewer: ["view"]
};
```

**Fix A — expose conditions (switch):**

```tsx
function Page() {
  const user = useUser();

  switch (user.role) {
    case "admin":
      return (
        <div>
          <Button disabled={false}>Invite</Button>
          <Button disabled={false}>View</Button>
        </div>
      );
    case "viewer":
      return (
        <div>
          <Button disabled={true}>Invite</Button>
          <Button disabled={false}>View</Button>
        </div>
      );
    default:
      return null;
  }
}
```

**Fix B — map next to JSX:**

```tsx
function Page() {
  const user = useUser();
  const policy = {
    admin: { canInvite: true, canView: true },
    viewer: { canInvite: false, canView: true }
  }[user.role];

  return (
    <div>
      <Button disabled={!policy.canInvite}>Invite</Button>
      <Button disabled={!policy.canView}>View</Button>
    </div>
  );
}
```

A policy module is fine when the matrix is actually complex.

---

## Simplify ternary operators

https://frontend-fundamentals.com/code-quality/en/code/examples/ternary-operator.html

**Smell:**

```ts
const status =
  ACondition && BCondition
    ? "BOTH"
    : ACondition || BCondition
      ? ACondition
        ? "A"
        : "B"
      : "NONE";
```

**Fix:**

```ts
const status = (() => {
  if (ACondition && BCondition) return "BOTH";
  if (ACondition) return "A";
  if (BCondition) return "B";
  return "NONE";
})();
```
