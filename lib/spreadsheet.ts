import * as XLSX from "xlsx";

export type Grid = string[][];

export interface ParsedSheet {
  fileName: string;
  headers: string[];
  /** Data rows only (header row excluded), each cell as a string. */
  rows: Grid;
}

/**
 * Parses an uploaded spreadsheet file (xlsx/xls/csv/...) into a header row
 * plus a rectangular grid of string cells. All parsing happens client-side.
 */
const TEXT_EXTENSIONS = [".csv", ".tsv", ".txt"];

export async function parseSpreadsheetFile(file: File): Promise<ParsedSheet> {
  const isTextFormat = TEXT_EXTENSIONS.some((ext) =>
    file.name.toLowerCase().endsWith(ext)
  );

  // Text formats (csv/tsv) are read as UTF-8 text explicitly — reading them
  // as a raw ArrayBuffer skips UTF-8 decoding and mangles non-ASCII text
  // (e.g. Korean) into mojibake.
  const workbook = isTextFormat
    ? XLSX.read(await file.text(), { type: "string" })
    : XLSX.read(await file.arrayBuffer(), { type: "array" });

  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    throw new Error("파일에서 시트를 찾을 수 없습니다.");
  }
  const worksheet = workbook.Sheets[firstSheetName];
  const raw = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
    header: 1,
    defval: "",
    blankrows: true,
  });

  if (raw.length === 0) {
    throw new Error("파일에 데이터가 없습니다.");
  }

  const colCount = raw.reduce((max, row) => Math.max(max, row.length), 0);
  const normalize = (row: unknown[]): string[] => {
    const out: string[] = new Array(colCount).fill("");
    for (let i = 0; i < colCount; i++) {
      const cell = row[i];
      out[i] = cell === undefined || cell === null ? "" : String(cell);
    }
    return out;
  };

  const [headerRow, ...dataRows] = raw;
  const headers = normalize(headerRow ?? []).map((h, i) => h || `열 ${i + 1}`);
  const rows = dataRows.map(normalize);

  return { fileName: file.name, headers, rows };
}

/**
 * Rebuilds a workbook from headers + edited data rows and triggers a
 * browser download. Always emits .xlsx regardless of the source format.
 */
export function downloadSpreadsheet(
  headers: string[],
  rows: Grid,
  originalFileName: string
) {
  const aoa: Grid = [headers, ...rows];
  const worksheet = XLSX.utils.aoa_to_sheet(aoa);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const baseName = originalFileName.replace(/\.[^./\\]+$/, "");
  XLSX.writeFile(workbook, `${baseName}_edited.xlsx`);
}
