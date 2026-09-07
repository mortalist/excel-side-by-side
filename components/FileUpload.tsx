"use client";

import { useRef, useState } from "react";
import { parseSpreadsheetFile, type ParsedSheet } from "@/lib/spreadsheet";

interface FileUploadProps {
  onParsed: (sheet: ParsedSheet) => void;
}

export default function FileUpload({ onParsed }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setLoading(true);
    try {
      const parsed = await parseSpreadsheetFile(file);
      onParsed(parsed);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "파일을 읽는 중 오류가 발생했습니다. xlsx, xls, csv 파일인지 확인해주세요."
      );
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-neutral-300 p-12 text-center dark:border-neutral-700">
      <div className="text-lg font-medium">엑셀 / CSV 파일 업로드</div>
      <p className="max-w-md text-sm text-neutral-500">
        xlsx, xls, csv 파일을 업로드하면 두 개의 열을 골라 나란히 비교하며
        편집할 수 있습니다. 파일은 브라우저에서만 처리되며 서버로 전송되지
        않습니다.
      </p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "불러오는 중..." : "파일 선택"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv,.tsv,.ods"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {error && (
        <p className="max-w-md text-sm font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
