import { useEffect, useState } from "react";
import { EmployeesTable } from "./components/employees-table";
import { NeedsAttentionSection } from "./components/needs-attention-section";
import type { Employee } from "./data/employee-schema";
import { loadEmployees } from "./data/load-employees";
import {
  type RankedCase,
  rankPriorityCases,
} from "./domain/rank-priority-cases";

function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [queue, setQueue] = useState<RankedCase[]>([]);

  useEffect(() => {
    loadEmployees().then(({ employees: loaded, parseErrors }) => {
      if (parseErrors.length > 0) {
        console.warn("Employee parse errors", parseErrors);
      }
      setEmployees(loaded);
      setQueue(rankPriorityCases(loaded));
    });
  }, []);

  return (
    <div className="page">
      <h1>Visa Tracking</h1>
      <p className="subtitle">Kowhai Robotics — HR dashboard (scaffold)</p>

      <NeedsAttentionSection cases={queue} />
      <EmployeesTable employees={employees} />
    </div>
  );
}

export default App;
