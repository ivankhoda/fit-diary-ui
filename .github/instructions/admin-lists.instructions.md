---
applyTo: "src/components/Admin/**/*.tsx"
---

# Admin List Components

Every list component in the Admin panel **must** support filtering, sorting, and pagination.

## Required State

```tsx
const [currentPage, setCurrentPage] = useState<number>(0);
const [searchName, setSearchName] = useState<string>("");
// add one state per filterable field, e.g.:
const [filterCategory, setFilterCategory] = useState<string>("");
const [sortKey, setSortKey] = useState<string>("");
const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

const ITEMS_PER_PAGE = 20;
```

## Required Handlers

```tsx
const handleSort = (key: string) => {
  if (sortKey === key) {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  } else {
    setSortKey(key);
    setSortDirection("asc");
  }
};

const clearFilters = useCallback(() => {
  setSearchName("");
  // reset all filter states
  setSortKey("");
  setSortDirection("asc");
  setCurrentPage(0);
}, []);

const handlePageChange = (data: { selected: number }) => {
  setCurrentPage(data.selected);
};
```

## Data Pipeline

Always apply filter → sort → paginate in this order:

```tsx
const filteredItems = items
  .filter(
    (item) =>
      item.name.toLowerCase().includes(searchName.toLowerCase()) &&
      (filterCategory ? item.category === filterCategory : true),
    // ... other filters
  )
  .sort((a, b) => {
    if (!sortKey) {
      return 0;
    }
    if (sortDirection === "asc") {
      return a[sortKey as keyof T] > b[sortKey as keyof T] ? 1 : -1;
    }
    return a[sortKey as keyof T] < b[sortKey as keyof T] ? 1 : -1;
  });

const currentItems = filteredItems.slice(
  currentPage * ITEMS_PER_PAGE,
  (currentPage + 1) * ITEMS_PER_PAGE,
);
const pageCount = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
```

## Required JSX Structure

```tsx
<AdminPanel>
  <div className="<entity>-management">
    <h2>{i18n.t("<entityListTitle>")}</h2>

    {/* Create button */}
    <div className="create-<entity>-button">
      <button onClick={handleCreate}>{i18n.t("create<Entity>")}</button>
    </div>

    {/* Search */}
    <div className="search-bar">
      <input
        type="text"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
        placeholder={i18n.t("searchByName")}
      />
    </div>

    {/* Filters — one <select> per enum field */}
    <div className="filters">
      <select
        value={filterCategory}
        onChange={(e) => setFilterCategory(e.target.value)}
      >
        {categoryMap.map((cat) => (
          <option key={cat} value={cat}>
            {i18n.t(cat)}
          </option>
        ))}
      </select>
      <button onClick={clearFilters}>{i18n.t("clearFilters")}</button>
    </div>

    {/* Sortable table — every column header calls handleSort */}
    <table className="<entity>-table">
      <thead>
        <tr>
          <th onClick={() => handleSort("id")}>{i18n.t("id")}</th>
          <th onClick={() => handleSort("name")}>{i18n.t("name")}</th>
          {/* ... other sortable columns */}
        </tr>
      </thead>
      <tbody>
        {currentItems.map((item) => (
          <tr
            key={item.id}
            onClick={() => handleItemClick(item)}
            style={{ cursor: "pointer" }}
          >
            <td>{item.id}</td>
            <td>{item.name}</td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Pagination via ReactPaginate */}
    <ReactPaginate
      previousLabel={`${i18n.t("previous")}`}
      nextLabel={`${i18n.t("next")}`}
      breakLabel={"..."}
      breakClassName={"break-me"}
      pageCount={pageCount}
      marginPagesDisplayed={2}
      pageRangeDisplayed={5}
      onPageChange={handlePageChange}
      containerClassName={"pagination"}
      activeClassName={"active"}
    />
  </div>
</AdminPanel>
```

## Rules

- **Every list must have**: text search by name, at least one enum filter as `<select>`, a "Clear filters" button, sortable column headers, `ReactPaginate` pagination.
- Reset `currentPage` to `0` whenever any filter or sort changes.
- Use `i18n.t()` for all user-visible strings — no hardcoded text.
- Wrap the component with `inject(...)(observer(...))` at the bottom of the file.
- Place filter option maps (e.g. `categoryMap`, `difficultyMap`) in a sibling `maps.ts` file.

## ESLint

Follow `eslint.instructions.md` for all rules. Key patterns specific to list components:

- Extract filter/sort state into a custom hook (e.g. `useExerciseFilters`) to stay within `max-lines-per-function` and `max-statements` limits.
- Declare `const ITEMS_PER_PAGE = 20` — never use the number literal directly (`no-magic-numbers`).
- Wrap all click/change handlers with `useCallback` — no inline arrows in JSX (`react/jsx-no-bind`).
- Guard injected stores at the top with an early `if (!store) return null` — no `!` assertions scattered in the body (`@typescript-eslint/no-non-null-assertion`).
- Extract each filter condition into a named predicate function — no long `.filter()` chains (`complexity`).
