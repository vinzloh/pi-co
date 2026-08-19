# Cohesion

Things that must change together live together and *do* change together.

Source: https://frontend-fundamentals.com/code-quality/en/code/

**vs readability:** abstracting for cohesion can hurt scan-ability. If a missed joint edit can break the product → cohesion wins. If risk is low → duplicate and stay readable.

---

## Colocate files that change together

https://frontend-fundamentals.com/code-quality/en/code/examples/code-directory.html

Type buckets hide deps. Delete a feature, leftovers stay. One dir per change-set: deps are visible; delete the folder, feature gone.

**Smell:**

```
src/
  components/
  constants/
  containers/
  contexts/
  remotes/
  hooks/
  utils/
```

**Fix:** project-wide stays at root; feature-only lives under the domain.

```
src/
  components/          # truly global
  containers/
  hooks/
  utils/
  domains/
    Domain1/
      components/
      containers/
      hooks/
      utils/
    Domain2/
      components/
      ...
```

`import { useFoo } from "../../../Domain2/hooks/useFoo"` is a visible smell.

---

## Eliminate magic numbers

https://frontend-fundamentals.com/code-quality/en/code/examples/magic-number-cohesion.html

Bare `300` is not tied to the animation it waits for. Animation duration changes, delay doesn't → silent break. That's a cohesion miss (also a readability miss).

```ts
async function onLikeClick() {
  await postLike(url);
  await delay(300);
  await refetchPostLike();
}
```

```ts
const ANIMATION_DELAY_MS = 300;

async function onLikeClick() {
  await postLike(url);
  await delay(ANIMATION_DELAY_MS);
  await refetchPostLike();
}
```

If the duration lives in CSS/theme, the constant should sit next to that source of truth — or be derived from it.

Also see [readability](readability.md#name-magic-numbers).

---

## Form cohesion: pick the change unit

https://frontend-fundamentals.com/code-quality/en/code/examples/form-fields.html

Don't mix field-level and form-level for the same form without a reason. Choose by what actually changes together.

### Field-level

Each field owns its validate. Independent, reusable, smaller blast radius. Use for async/unique checks (email format, username availability, promo code).

```tsx
import { useForm } from "react-hook-form";

export function Form() {
  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm({
    defaultValues: { name: "", email: "" }
  });

  const onSubmit = handleSubmit((formData) => {
    console.log("Form submitted:", formData);
  });

  return (
    <form onSubmit={onSubmit}>
      <div>
        <input
          {...register("name", {
            validate: (value) =>
              isEmptyStringOrNil(value) ? "Please enter your name." : ""
          })}
          placeholder="Name"
        />
        {errors.name && <p>{errors.name.message}</p>}
      </div>

      <div>
        <input
          {...register("email", {
            validate: (value) => {
              if (isEmptyStringOrNil(value)) {
                return "Please enter your email.";
              }
              if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                return "Please enter a valid email address.";
              }
              return "";
            }
          })}
          placeholder="Email"
        />
        {errors.email && <p>{errors.email.message}</p>}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}

function isNil(value: unknown): value is null | undefined {
  return value == null;
}

type NullableString = string | null | undefined;

function isEmptyStringOrNil(value: NullableString): boolean {
  return isNil(value) || value.trim() === "";
}
```

### Form-level

One schema, one business action. Fields interdependent (password confirm, totals) or wizard steps that feed the next.

```tsx
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(1, "Please enter your name."),
  email: z
    .string()
    .min(1, "Please enter your email.")
    .email("Please enter a valid email address.")
});

export function Form() {
  const {
    register,
    formState: { errors },
    handleSubmit
  } = useForm({
    defaultValues: { name: "", email: "" },
    resolver: zodResolver(schema)
  });

  const onSubmit = handleSubmit((formData) => {
    console.log("Form submitted:", formData);
  });

  return (
    <form onSubmit={onSubmit}>
      <div>
        <input {...register("name")} placeholder="Name" />
        {errors.name && <p>{errors.name.message}</p>}
      </div>
      <div>
        <input {...register("email")} placeholder="Email" />
        {errors.email && <p>{errors.email.message}</p>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}
```

| Choose | When |
|--------|------|
| Field-level | Independent / async / reusable fields |
| Form-level | One business action; wizard; fields depend on each other |

Form-level raises coupling between fields. That's the trade.
