import type { Employee, ProfileStatus } from "../data/employee-schema";
import { formatDdMmYyyy } from "../data/parse-csv-date";
import { Card } from "./card";

type EmployeesTableProps = {
  employees: Employee[];
};

const PROFILE_STATUS_COLOR: Record<ProfileStatus, string> = {
  Completed: "#2e7d32",
  "In Progress": "#ed6c02",
  "Not Started": "#9e9e9e",
};

/** Completed+RFE → Completed+Denied → In Progress → Not Started → Completed+In Review → rest */
function rowRank(row: Employee): number {
  if (row.profile_status === "Completed" && row.case_status === "RFE Issued") {
    return 1;
  }
  if (row.profile_status === "Completed" && row.case_status === "Denied") {
    return 2;
  }
  if (row.profile_status === "In Progress") {
    return 3;
  }
  if (row.profile_status === "Not Started") {
    return 4;
  }
  if (row.profile_status === "Completed" && row.case_status === "In Review") {
    return 5;
  }
  return 6;
}

function formatCaseStatus(row: Employee): string {
  if (row.case_status == null) {
    return "—";
  }
  if (
    row.profile_status === "In Progress" &&
    row.case_status === "Not Filed" &&
    row.profile_completion_pct != null
  ) {
    return `${row.case_status} (${row.profile_completion_pct}%)`;
  }
  return row.case_status;
}

export function EmployeesTable({ employees }: EmployeesTableProps) {
  const sorted = [...employees].sort((a, b) => {
    const rankDiff = rowRank(a) - rowRank(b);
    if (rankDiff !== 0) {
      return rankDiff;
    }
    if (a.profile_status === "In Progress") {
      const aPct = a.profile_completion_pct ?? 0;
      const bPct = b.profile_completion_pct ?? 0;
      return bPct - aPct;
    }
    const aFiled = a.filed_at?.getTime() ?? Number.POSITIVE_INFINITY;
    const bFiled = b.filed_at?.getTime() ?? Number.POSITIVE_INFINITY;
    return aFiled - bFiled;
  });

  return (
    <section className="employees-table">
      <Card label="Employees" value={employees.length} />

      <table>
        <thead>
          <tr>
            <th>Status</th>
            <th>ID</th>
            <th>Name</th>
            <th>Case status</th>
            <th>Expires</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr key={row.employee_id}>
              <td>
                <span
                  className="badge"
                  style={{
                    background: PROFILE_STATUS_COLOR[row.profile_status],
                  }}
                >
                  {row.profile_status}
                </span>
              </td>
              <td>{row.employee_id}</td>
              <td>{row.full_name}</td>
              <td>{formatCaseStatus(row)}</td>
              <td>{row.expires_at ? formatDdMmYyyy(row.expires_at) : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
