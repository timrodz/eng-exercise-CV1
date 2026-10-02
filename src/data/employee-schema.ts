import { z } from "zod";
import { parseCsvDate } from "./parse-csv-date";

const COMPANIES = [
  "Kowhai Robotics",
  "Tasman BioHealth",
  "Vantage Cloud",
  "Southern Cross Logistics",
] as const;

const PROFILE_STATUSES = ["Completed", "In Progress", "Not Started"] as const;

const CASE_STATUSES = [
  "Approved",
  "Not Filed",
  "RFE Issued",
  "Filed",
  "Denied",
  "Withdrawn",
  "In Review",
] as const;

const VISA_ALIASES: Record<string, string> = {
  O1A: "O-1A",
};

function trimString(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

function emptyToNull(value: string): string | null {
  return value === "" ? null : value;
}

function normalizeProfileStatus(
  raw: string
): (typeof PROFILE_STATUSES)[number] {
  const key = raw.trim().toLowerCase().replace(/\s+/g, " ");
  const map: Record<string, (typeof PROFILE_STATUSES)[number]> = {
    completed: "Completed",
    "in progress": "In Progress",
    "not started": "Not Started",
  };
  const status = map[key];
  if (!status) {
    throw new Error(`Unknown profile_status: ${raw}`);
  }
  return status;
}

function normalizeVisaType(raw: string): string {
  const trimmed = raw.trim();
  return VISA_ALIASES[trimmed] ?? trimmed;
}

function optionalDateFromString(value: unknown): Date | null {
  const s = trimString(value);
  if (s === "") {
    return null;
  }
  return parseCsvDate(s);
}

function optionalPct(value: unknown): number | null {
  const s = trimString(value);
  if (s === "") {
    return null;
  }
  const n = Number(s);
  if (!(Number.isFinite(n) && Number.isInteger(n))) {
    throw new Error(`Invalid profile_completion_pct: ${s}`);
  }
  return n;
}

const usedGeneratedIds = new Set<string>();

export function generateEmployeeId(): string {
  for (let attempt = 0; attempt < 100; attempt++) {
    const n = 2000 + Math.floor(Math.random() * 1000);
    const id = `EMP-${n}`;
    if (!usedGeneratedIds.has(id)) {
      usedGeneratedIds.add(id);
      return id;
    }
  }
  throw new Error("Could not generate unique employee_id");
}

export function resetGeneratedEmployeeIds(): void {
  usedGeneratedIds.clear();
}

export function seedEmployeeIds(ids: Iterable<string>): void {
  for (const id of ids) {
    const trimmed = id.trim();
    if (trimmed !== "") {
      usedGeneratedIds.add(trimmed);
    }
  }
}

function employeeIdFromString(value: unknown): string {
  const s = trimString(value);
  if (s !== "") {
    return s;
  }
  return generateEmployeeId();
}

const optionalEmail = z.preprocess(
  (value) => emptyToNull(trimString(value)),
  z.union([z.email(), z.null()])
);

const optionalAdvisor = z.preprocess(
  (value) => emptyToNull(trimString(value)),
  z.union([z.string().min(1), z.null()])
);

const optionalCaseStatus = z.preprocess(
  (value) => emptyToNull(trimString(value)),
  z.union([z.enum(CASE_STATUSES), z.null()])
);

const optionalDate = z.preprocess(optionalDateFromString, z.date().nullable());

const profileCompletionPct = z.preprocess(
  optionalPct,
  z.union([z.number().int().min(0).max(100), z.null()])
);

export const employeeSchema = z.object({
  employee_id: z.preprocess(employeeIdFromString, z.string().min(1)),
  full_name: z.preprocess(trimString, z.string().min(1)),
  email: optionalEmail,
  company: z.preprocess(trimString, z.enum(COMPANIES)),
  department: z.preprocess(trimString, z.string().min(1)),
  job_title: z.preprocess(trimString, z.string().min(1)),
  nationality: z.preprocess(trimString, z.string().min(1)),
  work_location: z.preprocess(trimString, z.string().min(1)),
  visa_type: z.preprocess(
    (value) => normalizeVisaType(trimString(value)),
    z.string().min(1)
  ),
  profile_status: z.preprocess(
    (value) => normalizeProfileStatus(trimString(value)),
    z.enum(PROFILE_STATUSES)
  ),
  case_status: optionalCaseStatus,
  profile_completion_pct: profileCompletionPct,
  filed_at: optionalDate,
  granted_at: optionalDate,
  expires_at: optionalDate,
  passport_expiry: optionalDate,
  assigned_advisor: optionalAdvisor,
  last_updated: optionalDate,
});

export type Employee = z.infer<typeof employeeSchema>;
export type Company = (typeof COMPANIES)[number];
export type ProfileStatus = (typeof PROFILE_STATUSES)[number];
export type CaseStatus = (typeof CASE_STATUSES)[number];

export const EMPLOYEE_CSV_COLUMNS = [
  "employee_id",
  "full_name",
  "email",
  "company",
  "department",
  "job_title",
  "nationality",
  "work_location",
  "visa_type",
  "profile_status",
  "case_status",
  "profile_completion_pct",
  "filed_at",
  "granted_at",
  "expires_at",
  "passport_expiry",
  "assigned_advisor",
  "last_updated",
] as const;

export type RawEmployeeRow = Record<
  (typeof EMPLOYEE_CSV_COLUMNS)[number],
  string
>;
