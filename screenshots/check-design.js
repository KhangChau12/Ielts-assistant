const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function checkDesign() {
  console.log('📸 Capturing auth pages for design review...\n');

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // Desktop only - 1920x1080
  await page.setViewport({ width: 1920, height: 1080 });

  // Login page
  console.log('Capturing login page...');
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
  await page.screenshot({
    path: path.join(__dirname, 'login.png'),
    fullPage: true
  });

  // Register page
  console.log('Capturing register page...');
  await page.goto('http://localhost:3000/register', { waitUntil: 'networkidle2' });
  await page.screenshot({
    path: path.join(__dirname, 'register.png'),
    fullPage: true
  });

  await browser.close();

  console.log('\n✅ Screenshots saved to /screenshots folder');
  console.log('📁 Review: login.png and register.png');
}

checkDesign().catch(console.error);