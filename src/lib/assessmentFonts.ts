import regular from '../../public/fonts/Sarabun-Regular.ttf?inline';
import bold from '../../public/fonts/Sarabun-Bold.ttf?inline';

// Vite embeds these assets in the application. Exporting never fetches a font URL.
function fontData(url: string): string {
  const separator = url.indexOf(',');
  if (!url.startsWith('data:') || !url.slice(0, separator).endsWith(';base64')) {
    throw new Error('ฟอนต์สำหรับรายงานไม่สมบูรณ์ กรุณาโหลดแอปใหม่');
  }
  return url.slice(separator + 1);
}

export const assessmentFonts = {
  'Sarabun-Regular.ttf': fontData(regular),
  'Sarabun-Bold.ttf': fontData(bold),
};
