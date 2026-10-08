import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:5174/');
    await page.waitForLoadState('networkidle');
    
    // Attempt to click Manager button to login
    await page.getByText('Department Manager').click();
    await page.getByRole('button', { name: /เข้าสู่ระบบ/ }).click();
    
    await page.waitForTimeout(2000); // Wait for render
    
    const html = await page.content();
    if (html.includes('id="root"></div>') || html.includes('id="root"></div')) {
      console.log('Root is empty! (White screen)');
    } else {
      console.log('Root has content.');
      // print a snippet of the body
      console.log(html.substring(0, 500));
    }

  } catch (e) {
    console.error('Error navigating:', e);
  } finally {
    await browser.close();
  }
})();
