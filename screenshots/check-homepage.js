const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function checkHomepage() {
  console.log('📸 Capturing homepage for design review...\n');

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // Desktop - 1920x1080
  await page.setViewport({ width: 1920, height: 1080 });

  // Homepage
  console.log('Capturing homepage...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  // Wait a bit for any animations
  await new Promise(resolve => setTimeout(resolve, 1000));

  await page.screenshot({
    path: path.join(__dirname, 'homepage.png'),
    fullPage: true
  });

  await browser.close();

  console.log('\n✅ Screenshot saved to /screenshots/homepage.png');
  console.log('📁 Review the design and iterate!');
}

checkHomepage().catch(console.error);
