# Concord eng-exercise — notes

## What this slice does

Advisor **priority queue** over the Zod-parsed `Employee` model (`3a6cef5`). Only cases that match the rubric appear; each row gets a typed `action`.

| Priority | Match | Action |
|---|---|---|
| 1 | `case_status = RFE Issued` (oldest `filed_at` first) | `respond_to_rfe` |
| 2 | `case_status = Denied` | `review_denial` |
| 3 | `In Progress` profile + `Not Filed` + completion ≥ 80 | `submit_application` |

Expected queue today: EMP-1016 → EMP-1003 → EMP-1013 → EMP-1022.

## Assumptions

- “In Progress” in the rubric means **profile** status with **Not Filed**, not a case status (none exist in the export).
- Null `profile_completion_pct` counts as 0 for the ≥80 threshold.
- Ranking is product policy (`src/domain/rank-priority-cases.ts`); parsing/trust stays in `employee-schema` + `parse-csv-date`.
- Date locale for ambiguous day/month stays the existing heuristic (DD/MM default; MM/DD when middle segment > 12).

## Questions deferred

- Should Denied outrank a ready-to-file case in all product contexts, or only this advisor slice?
- Who owns RFE response vs denial review (advisor vs client)?
- Treat Wei Chen’s two rows as two cases or a data-quality flag?

## Trade-offs / left out

- Expiry / passport risk ranking
- Showing non-matching employees at the bottom of the same table
- Pixel UI / design-system expansion
- Identity dedupe
