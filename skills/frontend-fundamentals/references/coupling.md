# Coupling

Blast radius of an edit. Easy-to-change code keeps it small.

Source: https://frontend-fundamentals.com/code-quality/en/code/

**vs cohesion:** extracting shared code raises cohesion *and* coupling. Duplicate when futures will diverge.

---

## One responsibility per hook

https://frontend-fundamentals.com/code-quality/en/code/examples/use-page-state-coupling.html

A hook whose job is "all query params for this page" becomes a magnet. Every consumer depends on it; any field change re-renders everyone.

**Smell:**

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

**Fix:**

```ts
export function useCardIdQueryParam() {
  const [cardId, _setCardId] = useQueryParam("cardId", NumberParam);

  const setCardId = useCallback((cardId: number) => {
    _setCardId({ cardId }, "replaceIn");
  }, []);

  return [cardId ?? undefined, setCardId] as const;
}
```

Also a readability win. See [readability](readability.md#split-functions-combined-by-logic-type).

---

## Allow duplicate code

https://frontend-fundamentals.com/code-quality/en/code/examples/use-bottom-sheet.html

Lookalike pages ≠ one hook. Shared code that later diverges grows flags; every edit retests every page.

**Smell:** `useOpenMaintenanceBottomSheet` extracted because several pages opened a sheet, logged, then `closeView()`.

```ts
export const useOpenMaintenanceBottomSheet = () => {
  const maintenanceBottomSheet = useMaintenanceBottomSheet();
  const logger = useLogger();

  return async (maintainingInfo: TelecomMaintenanceInfo) => {
    logger.log("Maintenance bottom sheet opened");
    const result = await maintenanceBottomSheet.open(maintainingInfo);
    if (result) {
      logger.log("Maintenance bottom sheet notification clicked");
    }
    closeView();
  };
};
```

Ask before extracting:

- Will log events stay identical per page?
- Will every page still `closeView()` after dismiss?
- Will copy/images stay the same?

If yes and unlikely to change → extract (cohesion). If any page will differ → **duplicate**. A hook with 6 boolean flags is the failure mode.

---

## Eliminate props drilling

https://frontend-fundamentals.com/code-quality/en/code/examples/item-edit-modal.html

Passthrough props couple the whole tree. Drop `recommendedItems` → every middleman changes.

**Smell:** `ItemEditBody` forwards `keyword`, `items`, `recommendedItems`, `onConfirm`, `onClose` without owning them.

```tsx
function ItemEditModal({ open, items, recommendedItems, onConfirm, onClose }) {
  const [keyword, setKeyword] = useState("");

  return (
    <Modal open={open} onClose={onClose}>
      <ItemEditBody
        items={items}
        keyword={keyword}
        onKeywordChange={setKeyword}
        recommendedItems={recommendedItems}
        onConfirm={onConfirm}
        onClose={onClose}
      />
    </Modal>
  );
}

function ItemEditBody({
  keyword,
  onKeywordChange,
  items,
  recommendedItems,
  onConfirm,
  onClose
}) {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Input value={keyword} onChange={(e) => onKeywordChange(e.target.value)} />
        <Button onClick={onClose}>Close</Button>
      </div>
      <ItemEditList
        keyword={keyword}
        items={items}
        recommendedItems={recommendedItems}
        onConfirm={onConfirm}
      />
    </>
  );
}
```

**Fix:** compose in the parent; delete the passthrough layer.

```tsx
function ItemEditModal({ open, items, recommendedItems, onConfirm, onClose }) {
  const [keyword, setKeyword] = useState("");

  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        <Button onClick={onClose}>Close</Button>
      </div>
      <ItemEditList
        keyword={keyword}
        items={items}
        recommendedItems={recommendedItems}
        onConfirm={onConfirm}
      />
    </Modal>
  );
}
```
