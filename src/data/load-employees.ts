import type { ZodError } from "zod";
import {
  EMPLOYEE_CSV_COLUMNS,
  type Employee,
  employeeSchema,
  type RawEmployeeRow,
  resetGeneratedEmployeeIds,
  seedEmployeeIds,
} from "./employee-schema";

function splitLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          current += '"'; // escaped quote
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      fields.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

const NEWLINE = /\r?\n/;

export type EmployeeParseError = {
  rowIndex: number;
  raw: RawEmployeeRow;
  error: ZodError;
};

export type LoadEmployeesResult = {
  employees: Employee[];
  parseErrors: EmployeeParseError[];
};

function lineToRawRow(line: string): RawEmployeeRow {
  const fields = splitLine(line);
  const row = {} as RawEmployeeRow;
  for (const [i, key] of EMPLOYEE_CSV_COLUMNS.entries()) {
    row[key] = fields[i] ?? "";
  }
  return row;
}

export async function loadRawEmployeeRows(): Promise<RawEmployeeRow[]> {
  const res = await fetch("/concord_employees.csv");
  const text = await res.text();

  const lines = text.split(NEWLINE).filter((line) => line.length > 0);
  const rows = lines.slice(1);
  return rows.map(lineToRawRow);
}

export function parseEmployeeRows(
  rawRows: RawEmployeeRow[]
): LoadEmployeesResult {
  resetGeneratedEmployeeIds();
  seedEmployeeIds(rawRows.map((row) => row.employee_id));

  const employees: Employee[] = [];
  const parseErrors: EmployeeParseError[] = [];

  for (const [rowIndex, raw] of rawRows.entries()) {
    const result = employeeSchema.safeParse(raw);
    if (result.success) {
      employees.push(result.data);
    } else {
      parseErrors.push({ rowIndex, raw, error: result.error });
    }
  }

  return { employees, parseErrors };
}

export async function loadEmployees(): Promise<LoadEmployeesResult> {
  const rawRows = await loadRawEmployeeRows();
  return parseEmployeeRows(rawRows);
}
