"use client";

interface ColumnPickerProps {
  headers: string[];
  leftCol: number;
  rightCol: number;
  onChange: (leftCol: number, rightCol: number) => void;
  onReset: () => void;
}

export default function ColumnPicker({
  headers,
  leftCol,
  rightCol,
  onChange,
  onReset,
}: ColumnPickerProps) {
  return (
    <div className="flex flex-wrap items-end gap-4 border-b border-neutral-200 pb-4 dark:border-neutral-800">
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-neutral-600 dark:text-neutral-300">
          왼쪽 열
        </span>
        <select
          className="rounded-md border border-neutral-300 bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
          value={leftCol}
          onChange={(e) => onChange(Number(e.target.value), rightCol)}
        >
          {headers.map((h, i) => (
            <option key={i} value={i}>
              {h}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-neutral-600 dark:text-neutral-300">
          오른쪽 열
        </span>
        <select
          className="rounded-md border border-neutral-300 bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900"
          value={rightCol}
          onChange={(e) => onChange(leftCol, Number(e.target.value))}
        >
          {headers.map((h, i) => (
            <option key={i} value={i}>
              {h}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        onClick={onReset}
        className="ml-auto rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
      >
        다른 파일 업로드
      </button>
    </div>
  );
}
