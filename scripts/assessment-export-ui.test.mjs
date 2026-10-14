import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'node:http';

const root = path.resolve('dist');
const server = createServer(async (request, response) => {
  let target = path.resolve(root, '.' + decodeURIComponent(new URL(request.url, 'http://localhost').pathname));
  if (!target.startsWith(root + path.sep) || target === root) target = path.join(root, 'index.html');
  try {
    response.setHeader('Content-Type', target.endsWith('.js') ? 'text/javascript' : target.endsWith('.css') ? 'text/css' : target.endsWith('.ttf') ? 'font/ttf' : 'text/html');
    response.end(await fs.readFile(target));
  } catch { response.statusCode = 404; response.end('Not found'); }
});
await new Promise(resolve => server.listen(5188, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch({ executablePath: process.env.PHASE1_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, timezoneId: 'Asia/Bangkok' });
  page.setDefaultTimeout(15000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  // Reproduce the user's failure: fonts cannot be fetched, even when the page's
  // base URL differs from the app URL. PDF generation must still work.
  await page.addInitScript(() => { window.fetch = () => Promise.reject(new TypeError('Failed to fetch')); });
  await page.route('**/*.ttf', route => route.abort());
  await page.goto('http://127.0.0.1:5188/');
  await page.getByRole('button', { name: 'Department Manager', exact: true }).click();
  await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();
  await page.evaluate(() => { const base = document.createElement('base'); base.href = 'https://reports.invalid/nested/'; document.head.append(base); });
  const navigate = title => page.getByRole('navigation').getByRole('button', { name: title, exact: true }).click();
  await fs.mkdir('review/assessment-export', { recursive: true });
  await fs.mkdir('output/pdf', { recursive: true });
  async function exportPdf(target, expectedName) {
    const downloadEvent = page.waitForEvent('download');
    await page.getByRole('button', { name: 'ส่งออก PDF', exact: true }).click();
    const download = await downloadEvent;
    assert.equal(download.suggestedFilename(), expectedName);
    assert.equal(await download.failure(), null);
    await download.saveAs(target);
    const bytes = await fs.readFile(target);
    assert.equal(bytes.subarray(0, 5).toString(), '%PDF-');
    assert.ok(bytes.length > 10000, 'embedded font and report data are present');
    await page.getByRole('status').filter({ hasText: 'ดาวน์โหลดรายงาน PDF แล้ว' }).waitFor();
    assert.equal(await page.getByRole('alert').count(), 0);
    assert.equal(await page.getByRole('button', { name: 'ส่งออก PDF', exact: true }).isEnabled(), true);
  }
  await navigate('ประเมินคะแนนรายแผนก');
  await exportPdf('review/assessment-export/departments-all.pdf', 'section-assessment-ALL-2026.pdf');
  await page.getByLabel('แผนกที่ประเมิน', { exact: true }).selectOption('QC Section');
  await exportPdf('output/pdf/department-assessment-example.pdf', 'section-assessment-QC-Section-2026.pdf');
  await page.getByLabel('ปีประเมิน', { exact: true }).selectOption('2025');
  await exportPdf('review/assessment-export/department-2025.pdf', 'section-assessment-QC-Section-2025.pdf');
  await navigate('ประเมินคะแนนรายบุคคล');
  await page.getByLabel('พนักงานที่ประเมิน', { exact: true }).selectOption('EMP001');
  await exportPdf('output/pdf/individual-assessment-example.pdf', 'individual-assessment-EMP001-2026.pdf');
  // A second export must also work after the first blob URL has been used.
  await exportPdf('review/assessment-export/individual-repeat.pdf', 'individual-assessment-EMP001-2026.pdf');
  assert.deepEqual(errors, []);
  console.log('PASS: five real PDF downloads with blocked fetch/font URLs and a different document base; department/year scopes, repeat export, Thai fonts, and completion states.');
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
