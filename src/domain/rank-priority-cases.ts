import type { Employee } from "../data/employee-schema";

export type PriorityAction =
  | "respond_to_rfe"
  | "review_denial"
  | "submit_application";

export type RankedCase = Employee & {
  priority: 1 | 2 | 3;
  action: PriorityAction;
};

export const PRIORITY_ACTION_LABELS: Record<PriorityAction, string> = {
  respond_to_rfe: "Respond to RFE",
  review_denial: "Review denial",
  submit_application: "Submit application",
};

function classify(employee: Employee): RankedCase | null {
  if (employee.case_status === "RFE Issued") {
    return { ...employee, priority: 1, action: "respond_to_rfe" };
  }
  if (employee.case_status === "Denied") {
    return { ...employee, priority: 2, action: "review_denial" };
  }
  if (
    employee.profile_status === "In Progress" &&
    employee.case_status === "Not Filed" &&
    (employee.profile_completion_pct ?? 0) >= 80
  ) {
    return { ...employee, priority: 3, action: "submit_application" };
  }
  return null;
}

function filedAtTime(employee: Employee): number {
  return employee.filed_at?.getTime() ?? Number.POSITIVE_INFINITY;
}

/** Advisor priority queue: RFE → Denied → near-complete Not Filed. */
export function rankPriorityCases(employees: Employee[]): RankedCase[] {
  const ranked = employees
    .map(classify)
    .filter((row): row is RankedCase => row !== null);

  return ranked.sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    if (a.priority === 3) {
      const aPct = a.profile_completion_pct ?? 0;
      const bPct = b.profile_completion_pct ?? 0;
      return bPct - aPct;
    }
    return filedAtTime(a) - filedAtTime(b);
  });
}
