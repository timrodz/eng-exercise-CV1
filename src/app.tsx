import { useEffect, useMemo, useState } from "react";
import { CompanySection } from "./components/company-section";
import type { Company, Employee } from "./data/employee-schema";
import { loadEmployees } from "./data/load-employees";

function groupByCompany(employees: Employee[]): [Company, Employee[]][] {
  const groups = new Map<Company, Employee[]>();
  for (const employee of employees) {
    const list = groups.get(employee.company);
    if (list) {
      list.push(employee);
    } else {
      groups.set(employee.company, [employee]);
    }
  }
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
}

function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    loadEmployees().then(({ employees: loaded, parseErrors }) => {
      if (parseErrors.length > 0) {
        console.warn("Employee parse errors", parseErrors);
      }
      setEmployees(loaded);
    });
  }, []);

  const groups = useMemo(() => groupByCompany(employees), [employees]);

  return (
    <div className="page">
      <h1>Visa Tracking</h1>
      <p className="subtitle">HR dashboard (scaffold)</p>

      {groups.map(([company, companyEmployees]) => (
        <CompanySection
          companyName={company}
          employees={companyEmployees}
          key={company}
        />
      ))}
    </div>
  );
}

export default App;
