/**
 * Utility functions for exporting data to RFC 4180 compliant CSV files with UTF-8 BOM
 * for offline reporting and spreadsheet compatibility (Excel, Sheets, Numbers).
 */

export function escapeCSVCell(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  const str = String(value);
  // If the cell contains quotes, commas, newlines, or carriage returns, wrap in quotes and escape internal quotes
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function generateCSVContent(
  headers: string[],
  rows: (string | number | boolean | null | undefined)[][]
): string {
  const headerLine = headers.map(escapeCSVCell).join(",");
  const dataLines = rows.map((row) => row.map(escapeCSVCell).join(","));
  return [headerLine, ...dataLines].join("\r\n");
}

export function downloadCSV(
  filename: string,
  headers: string[],
  rows: (string | number | boolean | null | undefined)[][]
): boolean {
  try {
    const csvString = generateCSVContent(headers, rows);
    // Include UTF-8 BOM (\uFEFF) so Excel properly detects UTF-8 encoding
    const blob = new Blob(["\uFEFF" + csvString], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error("Failed to generate or download CSV file:", error);
    return false;
  }
}
