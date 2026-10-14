// Neutralize formula prefixes before writing user-controlled text to a spreadsheet.
export function csvCell(value: string | number) {
  let text = String(value);
  if (/^[\s]*[=+@-]/.test(text) && typeof value === 'string') text = "'" + text;
  return `"${text.replaceAll('"', '""')}"`;
}
export function downloadCsv(filename: string, rows: (string | number)[][]) {
  const blob = new Blob(['\uFEFF' + rows.map(row => row.map(csvCell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = filename; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
