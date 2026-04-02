// src/lib/csv/parseCsv.ts

import Papa from "papaparse";

export interface RawCsvRow {
  [key: string]: string;
}

export function parseCsv(csvString: string): RawCsvRow[] {
  const result = Papa.parse(csvString, {
    header: true,
    skipEmptyLines: true,
  });
  
  if (result.errors.length > 0) {
    console.error("CSV Parsing Errors:", result.errors);
  }
  
  return result.data as RawCsvRow[];
}
