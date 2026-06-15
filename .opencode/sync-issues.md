# Sync Issues (Unresolved Only)

## SYNC-1
- Severity: HIGH
- Files: all framer-motion usage in MissionsPage.tsx, ProfilePage.tsx
- Problem: framer-motion v12 strict `ease` type - `ease: string` not assignable to `Easing | Easing[] | undefined` (multiple TS2322 errors)
- Fix: Replace `ease: 'easeOut'` and similar string literals with typed easing values or use as const (`ease: 'easeOut' as const`). Affects `animate` transition objects throughout.
- Status: pending

## SYNC-2
- Severity: HIGH
- Files: src/components/achievements/AchievementsPage.tsx (line 5)
- Problem: Unused import `Trophy` from lucide-react causes build error TS6133
- Fix: Remove `Trophy` from the import on line 5
- Status: pending

## SYNC-3
- Severity: HIGH
- Files: src/components/quests/QuestsPage.tsx (line 6)
- Problem: Unused import `ScrollText` from lucide-react causes build error TS6133
- Fix: Remove `ScrollText` from the import on line 6
- Status: pending

## SYNC-4
- Severity: HIGH
- Files: src/components/coach/CoachPage.tsx (line 5)
- Problem: Unused import `TrendingUp` from lucide-react causes build error TS6133
- Fix: Remove `TrendingUp` from the import on line 5
- Status: pending

## SYNC-5
- Severity: HIGH
- Files: src/components/strength/StrengthPage.tsx (line 5)
- Problem: Unused imports `Dumbbell` and `Star` from lucide-react cause build error TS6133
- Fix: Remove `Dumbbell` and `Star` from the import on line 5
- Status: pending

## SYNC-6
- Severity: HIGH
- Files: src/components/workout/WorkoutPage.tsx (line 9)
- Problem: Unused import `X` from lucide-react causes build error TS6133
- Fix: Remove `X` from the import on line 9
- Status: pending

## SYNC-7
- Severity: HIGH
- Files: src/stores/workoutStore.ts (line 3)
- Problem: Unused type import `ExerciseEntry` causes build error TS6196
- Fix: Remove `ExerciseEntry` from the import on line 3
- Status: pending

## SYNC-8
- Severity: MEDIUM
- Files: src/components/missions/MissionsPage.tsx (line 77)
- Problem: `Element` type (from react-icons/emojis) not assignable to `string` type in icon field
- Fix: Change the GlassHeader `icon` prop type to accept `ReactNode` instead of `string`, or convert to string
- Status: pending

## SYNC-9
- Severity: MEDIUM
- Files: src/App.tsx
- Problem: App.tsx still uses default Vite template. No routing integration. None of the created pages are accessible.
- Fix: Wire up `App.tsx` with `BrowserRouter`, `Routes`, `Route` and route to the created page components (ProfilePage, MissionsPage, WorkoutPage, StrengthPage, DashboardPage, etc.)
- Status: pending

## SYNC-10
- Severity: MEDIUM
- Files: src/components/quests/, src/components/achievements/, src/components/analytics/
- Problem: No barrel export (index.ts) files for quests, achievements, analytics modules, making them harder to import externally
- Fix: Add `index.ts` barrel exports for each module
- Status: pending
