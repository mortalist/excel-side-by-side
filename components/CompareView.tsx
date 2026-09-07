"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { List, useDynamicRowHeight, type RowComponentProps } from "react-window";
import type { Grid } from "@/lib/spreadsheet";

const DEFAULT_ROW_HEIGHT = 96;
const ROW_VERTICAL_PADDING = 24; // py-3 (12px) top + bottom, plus border
const MIN_TEXTAREA_HEIGHT = 44;

interface RowProps {
  rows: Grid;
  leftCol: number;
  rightCol: number;
  onEdit: (rowIndex: number, col: number, value: string) => void;
  dynamicRowHeight: ReturnType<typeof useDynamicRowHeight>;
}

function Row({
  index,
  style,
  rows,
  leftCol,
  rightCol,
  onEdit,
  dynamicRowHeight,
}: RowComponentProps<RowProps>) {
  const row = rows[index];
  const leftValue = row[leftCol] ?? "";
  const rightValue = row[rightCol] ?? "";
  const leftRef = useRef<HTMLTextAreaElement>(null);
  const rightRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const left = leftRef.current;
    const right = rightRef.current;
    if (!left || !right) return;

    left.style.height = "auto";
    right.style.height = "auto";
    const contentHeight = Math.max(
      left.scrollHeight,
      right.scrollHeight,
      MIN_TEXTAREA_HEIGHT
    );
    left.style.height = `${contentHeight}px`;
    right.style.height = `${contentHeight}px`;

    dynamicRowHeight.setRowHeight(index, contentHeight + ROW_VERTICAL_PADDING);
  }, [leftValue, rightValue, index, dynamicRowHeight]);

  return (
    <div
      style={style}
      className="flex gap-3 border-b border-neutral-200 px-3 py-3 dark:border-neutral-800"
    >
      <div className="w-10 shrink-0 pt-2 text-right text-xs text-neutral-400">
        {index + 1}
      </div>
      <textarea
        ref={leftRef}
        className="w-1/2 resize-none overflow-hidden rounded-md border border-neutral-300 bg-white p-2 text-sm leading-relaxed focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900"
        value={leftValue}
        onChange={(e) => onEdit(index, leftCol, e.target.value)}
      />
      <textarea
        ref={rightRef}
        className="w-1/2 resize-none overflow-hidden rounded-md border border-neutral-300 bg-white p-2 text-sm leading-relaxed focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900"
        value={rightValue}
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
  const dynamicRowHeight = useDynamicRowHeight({
    defaultRowHeight: DEFAULT_ROW_HEIGHT,
    key: `${leftCol}:${rightCol}`,
  });

  const rowProps = useMemo(
    () => ({ rows, leftCol, rightCol, onEdit, dynamicRowHeight }),
    [rows, leftCol, rightCol, onEdit, dynamicRowHeight]
  );

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
          rowHeight={dynamicRowHeight}
          rowProps={rowProps}
          style={{ height: "100%", width: "100%" }}
        />
      </div>
    </div>
  );
}
