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
    response.setHeader('Content-Type', target.endsWith('.js') ? 'text/javascript' : target.endsWith('.css') ? 'text/css' : target.endsWith('.woff2') ? 'font/woff2' : 'text/html');
    response.end(await fs.readFile(target));
  } catch { response.statusCode = 404; response.end('Not found'); }
});
await new Promise(resolve => server.listen(5187, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch({ executablePath: process.env.PHASE1_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, timezoneId: 'Asia/Bangkok' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await fs.mkdir('review/filters', { recursive: true });
  await page.goto('http://127.0.0.1:5187/');
  const navigate = title => page.getByRole('navigation').getByRole('button', { name: title, exact: true }).click();
  let checked = 0;
  for (const role of ['Staff', 'Section Chief', 'Department Manager', 'System Admin']) {
    if (role !== 'Staff') await page.getByRole('button', { name: 'เปลี่ยนบทบาท / ออกจากระบบ', exact: true }).click();
    await page.getByRole('button', { name: role, exact: true }).click();
    await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();
    const titles = await page.getByRole('navigation').getByRole('button').evaluateAll(buttons => buttons.map(button => button.getAttribute('aria-label')));
    for (const title of titles) {
      await navigate(title);
      if (!await page.locator('.filter-panel').count()) continue;
      for (const width of [1920, 1440, 1080, 768]) {
        await page.setViewportSize({ width, height: 1000 });
        const issues = await page.locator('.filter-panel').evaluateAll(panels => panels.flatMap(panel => {
          const problems = [];
          const bounds = panel.getBoundingClientRect();
          if (panel.scrollWidth > panel.clientWidth + 1) problems.push('panel overflow');
          const controls = [...panel.querySelectorAll('.filter-fields input, .filter-fields select')];
          for (const control of controls) {
            const rect = control.getBoundingClientRect();
            if (rect.left < bounds.left || rect.right > bounds.right + 1) problems.push('control outside panel');
            if (rect.height < 44) problems.push('control too short');
            if (!control.labels?.length) problems.push('missing accessible label');
          }
          for (let i = 0; i < controls.length; i++) for (let j = i + 1; j < controls.length; j++) {
            const a = controls[i].getBoundingClientRect(), b = controls[j].getBoundingClientRect();
            if (Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1) problems.push('overlapping controls');
            if (Math.abs(a.top - b.top) < 44 && Math.abs(a.top - b.top) > 1) problems.push('uneven control alignment');
          }
          return problems;
        }));
        assert.deepEqual(issues, [], `${role}: ${title} at ${width}px`);
        checked++;
      }
      await page.setViewportSize({ width: 1440, height: 1000 });
    }
    if (role === 'Staff') {
      await navigate('ดูคะแนนของฉัน');
      const wi = page.getByLabel('Work Instruction', { exact: true });
      const longOption = await wi.locator('option').evaluateAll(options => options.find(option => option.textContent.length > 42)?.value);
      assert.ok(longOption, 'seed includes a long W/I name');
      await wi.selectOption(longOption);
      await page.getByLabel('เฉพาะสกิลที่ได้รับมอบหมาย', { exact: true }).check();
      assert.ok(await page.locator('.field-selected-value:visible').count(), 'full selected name is visible');
      await page.locator('.filter-panel').screenshot({ path: 'review/filters/staff-long-wi.png' });
      await page.getByRole('button', { name: 'แสดงทุกสกิล', exact: true }).click();
      assert.equal(await wi.inputValue(), 'ALL');
      assert.equal(await page.getByLabel('เฉพาะสกิลที่ได้รับมอบหมาย', { exact: true }).isChecked(), false);
    }
    if (role === 'Department Manager') {
      await navigate('ภาพรวมสำหรับผู้จัดการ');
      await page.getByLabel('แผนก', { exact: true }).selectOption('Production');
      await page.getByLabel('ปี', { exact: true }).selectOption('2025');
      await page.getByLabel('เฉพาะสกิลที่ได้รับมอบหมาย', { exact: true }).uncheck();
      await page.getByRole('button', { name: 'ล้างตัวกรอง', exact: true }).click();
      assert.equal(await page.getByLabel('แผนก', { exact: true }).inputValue(), 'ALL');
      assert.equal(await page.getByLabel('ปี', { exact: true }).inputValue(), '2026');
      assert.equal(await page.getByLabel('เฉพาะสกิลที่ได้รับมอบหมาย', { exact: true }).isChecked(), true);
      for (const width of [1440, 1080, 768]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.locator('.filter-panel').screenshot({ path: `review/filters/executive-${width}.png` });
      }
      await navigate('รายงานความสามารถตามงาน');
      await page.getByLabel('แผนก', { exact: true }).selectOption('QC Section');
      await page.getByLabel('ทีม', { exact: true }).selectOption('QC-B');
      await page.getByRole('button', { name: 'ล้างตัวกรอง', exact: true }).click();
      for (const label of ['แผนก', 'ทีม', 'พนักงาน', 'Work Instruction', 'ประเภทสกิล']) assert.equal(await page.getByLabel(label, { exact: true }).inputValue(), 'ALL');
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.locator('.filter-panel').screenshot({ path: 'review/filters/job-report.png' });
    }
    if (role === 'System Admin') {
      await navigate('จัดการข้อมูลพื้นฐาน');
      await page.getByLabel('ค้นหามาตรฐานงาน', { exact: true }).fill('ไม่พบรายการนี้');
      await page.getByLabel('รวมรายการที่เก็บเข้าคลัง', { exact: true }).check();
      await page.getByRole('button', { name: 'ล้างตัวกรอง', exact: true }).click();
      assert.equal(await page.getByLabel('ค้นหามาตรฐานงาน', { exact: true }).inputValue(), '');
      assert.equal(await page.getByLabel('รวมรายการที่เก็บเข้าคลัง', { exact: true }).isChecked(), false);
      await page.locator('.filter-panel').screenshot({ path: 'review/filters/master-data.png' });
    }
  }
  assert.deepEqual(errors, []);
  console.log(`PASS: ${checked} page/viewport filter checks across four roles, long selected text, accessible labels, no overflow or overlap, and filter resets.`);
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
