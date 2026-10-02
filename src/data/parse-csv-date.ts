/** Parse CSV date strings; default DD/MM/YYYY, MM/DD when middle segment > 12. */
export function parseCsvDate(value: string): Date | null {
  const trimmed = value.trim();
  if (trimmed === "") {
    return null;
  }

  const parts = trimmed.split("/");
  if (parts.length !== 3) {
    throw new Error(`Invalid date: ${value}`);
  }

  const a = Number(parts[0]);
  const b = Number(parts[1]);
  const year = Number(parts[2]);

  if (
    !(Number.isInteger(a) && Number.isInteger(b) && Number.isInteger(year)) ||
    year < 1000
  ) {
    throw new Error(`Invalid date: ${value}`);
  }

  let day: number;
  let month: number;
  if (b > 12) {
    month = a;
    day = b;
  } else {
    day = a;
    month = b;
  }

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    throw new Error(`Invalid date: ${value}`);
  }

  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error(`Invalid date: ${value}`);
  }

  return date;
}

export function formatDdMmYyyy(date: Date): string {
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
}
