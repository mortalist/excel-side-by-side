"use client";

import { List, type RowComponentProps } from "react-window";
import type { Grid } from "@/lib/spreadsheet";

const ROW_HEIGHT = 220;

interface RowProps {
  rows: Grid;
  leftCol: number;
  rightCol: number;
  onEdit: (rowIndex: number, col: number, value: string) => void;
}

function Row({
  index,
  style,
  rows,
  leftCol,
  rightCol,
  onEdit,
}: RowComponentProps<RowProps>) {
  const row = rows[index];
  return (
    <div
      style={style}
      className="flex gap-3 border-b border-neutral-200 px-3 py-2 dark:border-neutral-800"
    >
      <div className="w-10 shrink-0 pt-2 text-right text-xs text-neutral-400">
        {index + 1}
      </div>
      <textarea
        className="h-full w-1/2 resize-none rounded-md border border-neutral-300 bg-white p-2 text-sm leading-relaxed focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900"
        value={row[leftCol] ?? ""}
        onChange={(e) => onEdit(index, leftCol, e.target.value)}
      />
      <textarea
        className="h-full w-1/2 resize-none rounded-md border border-neutral-300 bg-white p-2 text-sm leading-relaxed focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900"
        value={row[rightCol] ?? ""}
        onChange={(e) => onEdit(index, rightCol, e.target.value)}
      />
    </div>
  );
}

interface CompareViewProps {
  headers: string[];
  rows: Grid;
  leftCol: number;
  rightCol: number;
  onEdit: (rowIndex: number, col: number, value: string) => void;
}

export default function CompareView({
  headers,
  rows,
  leftCol,
  rightCol,
  onEdit,
}: CompareViewProps) {
  const rowProps = { rows, leftCol, rightCol, onEdit };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex gap-3 border-b border-neutral-300 bg-neutral-50 px-3 py-2 text-sm font-semibold dark:border-neutral-700 dark:bg-neutral-900">
        <div className="w-10 shrink-0" />
        <div className="w-1/2">{headers[leftCol]}</div>
        <div className="w-1/2">{headers[rightCol]}</div>
      </div>
      <div className="min-h-0 flex-1">
        <List
          rowComponent={Row}
          rowCount={rows.length}
          rowHeight={ROW_HEIGHT}
          rowProps={rowProps}
          style={{ height: "100%", width: "100%" }}
        />
      </div>
    </div>
  );
}
