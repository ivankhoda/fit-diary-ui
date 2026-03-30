---
applyTo: "src/**/*.{ts,tsx}"
---

# ESLint — How to Write Compliant Code

Write code that passes ESLint without disable comments. Follow the patterns below.

## no-explicit-any

Always declare proper types instead of `any`.

```tsx
// ✗
const handle = (data: any) => { ... };

// ✓
const handle = (data: UserProfile) => { ... };
```

## no-console

Use error boundaries or pass errors to state instead of logging.

```tsx
// ✗
console.log("clicked");
console.error(e);

// ✓
onErrors([t("something_went_wrong")]);
```

## max-lines-per-function / max-statements

Split large component functions by extracting logic into custom hooks or helper functions.

```tsx
// ✗ — one giant component with all logic inline

// ✓ — extract filter/sort logic
function useExerciseFilters(exercises: Exercise[]) {
  const [searchName, setSearchName] = useState("");
  // ...
  return { filtered, searchName, setSearchName };
}

const ExerciseList = () => {
  const { filtered, searchName, setSearchName } = useExerciseFilters(exercises);
  // ...
};
```

## no-magic-numbers

Name every numeric constant.

```tsx
// ✗
const current = items.slice(page * 20, (page + 1) * 20);

// ✓
const ITEMS_PER_PAGE = 20;
const current = items.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);
```

## react/jsx-no-bind

Wrap handlers in `useCallback` instead of writing inline arrows in JSX.

```tsx
// ✗
<tr onClick={() => handleClick(item)}>

// ✓
const handleClick = useCallback((item: Item) => {
    navigate(`/admin/items/${item.id}`);
}, [navigate]);

<tr onClick={() => handleClick(item)}>
```

For simple input handlers use `useCallback` at the component level:

```tsx
const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  setSearchName(e.target.value);
  setCurrentPage(0);
}, []);

<input onChange={handleSearch} />;
```

## @typescript-eslint/no-non-null-assertion

Type injected MobX store props as required inside the component by destructuring with a fallback or asserting once at the top.

```tsx
// ✗ — scattered ! throughout the component
const { exercises } = adminExercisesStore!;

// ✓ — assert once, use the typed variable everywhere
const ExerciseList: React.FC<Props> = observer(
  ({ adminExercisesStore, adminExercisesController }) => {
    if (!adminExercisesStore || !adminExercisesController) {
      return null;
    }
    const { exercises } = adminExercisesStore;
    // ...
  },
);
```

## sort-keys

Keep object keys in alphabetical order, or use arrays for ordered options.

```tsx
// ✗
const map = { hard: 3, easy: 1, medium: 2 };

// ✓
const map = { easy: 1, hard: 3, medium: 2 };

// ✓ for ordered display — use an array instead of an object
const difficultyMap = ["easy", "medium", "hard"];
```

## complexity

Break complex filter conditions into named predicates.

```tsx
// ✗
.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) &&
    (filterCategory ? e.category === filterCategory : true) &&
    (filterDifficulty ? e.difficulty === filterDifficulty : true) &&
    (filterMuscle ? e.muscle_groups.includes(filterMuscle) : true)
)

// ✓
const matchesSearch = (e: Exercise) => e.name.toLowerCase().includes(search.toLowerCase());
const matchesCategory = (e: Exercise) => !filterCategory || e.category === filterCategory;
const matchesDifficulty = (e: Exercise) => !filterDifficulty || e.difficulty === filterDifficulty;
const matchesMuscle = (e: Exercise) => !filterMuscle || e.muscle_groups.includes(filterMuscle);

.filter(e => matchesSearch(e) && matchesCategory(e) && matchesDifficulty(e) && matchesMuscle(e))
```
