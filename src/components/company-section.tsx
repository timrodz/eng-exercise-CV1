import type { Employee } from "../data/employee-schema";
import { rankPriorityCases } from "../domain/rank-priority-cases";
import { Card } from "./card";
import { EmployeesTable } from "./employees-table";
import { NeedsAttentionSection } from "./needs-attention-section";

type CompanySectionProps = {
  companyName: string;
  employees: Employee[];
};

export function CompanySection({
  companyName,
  employees,
}: CompanySectionProps) {
  return (
    <section className="company-section">
      <h2 className="section-title">{companyName}</h2>
      <div className="company-count">
        <Card label="Employees" value={employees.length} />
      </div>
      <NeedsAttentionSection cases={rankPriorityCases(employees)} />
      <EmployeesTable employees={employees} />
    </section>
  );
}
