import type { Employee } from "../data/employee-schema";
import { formatDdMmYyyy } from "../data/parse-csv-date";
import { Card } from "./card";

type EmployeesTableProps = {
  employees: Employee[];
};

export function EmployeesTable({ employees }: EmployeesTableProps) {
  const sorted = [...employees].sort((a, b) => {
    const aTime = a.expires_at?.getTime() ?? Number.POSITIVE_INFINITY;
    const bTime = b.expires_at?.getTime() ?? Number.POSITIVE_INFINITY;
    return aTime - bTime;
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
                    background: row.expires_at ? "#2e7d32" : "#9e9e9e",
                  }}
                >
                  {row.expires_at ? "Active" : "No expiry"}
                </span>
              </td>
              <td>{row.employee_id}</td>
              <td>{row.full_name}</td>
              <td>{row.case_status ?? "—"}</td>
              <td>{row.expires_at ? formatDdMmYyyy(row.expires_at) : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
