"use client";

import { useCallback, useMemo, useState } from "react";
import FileUpload from "@/components/FileUpload";
import ColumnPicker from "@/components/ColumnPicker";
import CompareView from "@/components/CompareView";
import { downloadSpreadsheet, type Grid, type ParsedSheet } from "@/lib/spreadsheet";

export default function Home() {
  const [sheet, setSheet] = useState<ParsedSheet | null>(null);
  const [rows, setRows] = useState<Grid>([]);
  const [leftCol, setLeftCol] = useState(0);
  const [rightCol, setRightCol] = useState(1);

  const handleParsed = useCallback((parsed: ParsedSheet) => {
    setSheet(parsed);
    setRows(parsed.rows);
    setLeftCol(0);
    setRightCol(parsed.headers.length > 1 ? 1 : 0);
  }, []);

  const handleReset = useCallback(() => {
    setSheet(null);
    setRows([]);
  }, []);

  const handleColumnChange = useCallback((left: number, right: number) => {
    setLeftCol(left);
    setRightCol(right);
  }, []);

  const handleEdit = useCallback((rowIndex: number, col: number, value: string) => {
    setRows((prev) => {
      const next = prev.slice();
      const row = next[rowIndex].slice();
      row[col] = value;
      next[rowIndex] = row;
      return next;
    });
  }, []);

  const handleDownload = useCallback(() => {
    if (!sheet) return;
    downloadSpreadsheet(sheet.headers, rows, sheet.fileName);
  }, [sheet, rows]);

  const rowCountLabel = useMemo(
    () => (rows.length > 0 ? `${rows.length.toLocaleString()}행` : ""),
    [rows.length]
  );

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
        <div>
          <h1 className="text-lg font-bold">Excel Side by Side</h1>
          <p className="text-xs text-neutral-500">
            두 열을 나란히 비교하며 번역/텍스트를 검토하는 도구
          </p>
        </div>
        {sheet && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-neutral-500">{rowCountLabel}</span>
            <button
              type="button"
              onClick={handleDownload}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
            >
              다운로드
            </button>
          </div>
        )}
      </header>

      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {!sheet ? (
          <div className="flex flex-1 items-center justify-center p-6">
            <div className="w-full max-w-xl">
              <FileUpload onParsed={handleParsed} />
            </div>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-6 py-4">
            <ColumnPicker
              headers={sheet.headers}
              leftCol={leftCol}
              rightCol={rightCol}
              onChange={handleColumnChange}
              onReset={handleReset}
            />
            <CompareView
              headers={sheet.headers}
              rows={rows}
              leftCol={leftCol}
              rightCol={rightCol}
              onEdit={handleEdit}
            />
          </div>
        )}
      </main>
    </div>
  );
}
