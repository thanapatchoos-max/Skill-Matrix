export function formatDate(value: string) {
  return new Date(value).toLocaleString('th-TH', { timeZone: 'Asia/Bangkok', dateStyle: 'medium', timeStyle: 'short' });
}
export function skillLabel(key: string) {
  const index = key.lastIndexOf('_');
  return `${key.slice(0, index)} · Type ${key.slice(index + 1)}`;
}
