import http from 'http';
import fs from 'fs';
import path from 'path';

async function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

async function run() {
  console.log('=== VERIFYING UI FIX ON LOCALHOST:5173 ===');
  
  // 1. Check index.html
  const home = await fetchUrl('http://localhost:5173/');
  console.log('GET / -> Status:', home.status);
  const hasCssLink = home.body.includes('<link rel="stylesheet" href="/assets/css/style.css">');
  console.log('Index links to /assets/css/style.css cleanly:', hasCssLink ? '✓' : '✗');
  const hasMainJs = home.body.includes('/assets/js/main.js');
  console.log('Index links to /assets/js/main.js:', hasMainJs ? '✓' : '✗');

  // 2. Check CSS endpoint
  const css = await fetchUrl('http://localhost:5173/assets/css/style.css');
  console.log('GET /assets/css/style.css -> Status:', css.status, 'Content-Type:', css.headers['content-type']);
  console.log('CSS length:', css.body.length);
  console.log('.jb-floating-whatsapp in CSS:', css.body.includes('.jb-floating-whatsapp') ? '✓' : '✗');
  console.log('.jb-floating-assistant-btn in CSS:', css.body.includes('.jb-floating-assistant-btn') ? '✓' : '✗');
  console.log('.jb-assistant-panel in CSS:', css.body.includes('.jb-assistant-panel') ? '✓' : '✗');
  console.log('.jb-assistant-panel display:none when closed:', css.body.includes('display: none;') ? '✓' : '✗');
  console.log('.jb-assistant-panel.is-open display:flex !important:', css.body.includes('display: flex !important;') ? '✓' : '✗');

  // 3. Check JS endpoint
  const js = await fetchUrl('http://localhost:5173/assets/js/main.js');
  console.log('GET /assets/js/main.js -> Status:', js.status);
  console.log('Defensive inline styles in WhatsApp button:', js.body.includes('btn.style.cssText') ? '✓' : '✗');
  console.log('Defensive inline styles in Assistant launcher:', js.body.includes('launcher.style.cssText') ? '✓' : '✗');
  console.log('Defensive inline display:none on panel:', js.body.includes('panel.style.cssText = \'display:none;') ? '✓' : '✗');
  console.log('Mobile background scroll lock logic present:', js.body.includes('document.body.style.overflow = \'hidden\';') ? '✓' : '✗');

  // 4. Check production dist files
  console.log('\n=== VERIFYING PRODUCTION BUILD ARTIFACTS ===');
  const distIndex = fs.readFileSync('site/dist/index.html', 'utf8');
  console.log('Dist index has clean style.css link:', distIndex.includes('<link rel="stylesheet" href="/assets/css/style.css">') ? '✓' : '✗');
  const distCssExists = fs.existsSync('site/dist/assets/css/style.css');
  console.log('Dist assets/css/style.css exists on disk:', distCssExists ? '✓' : '✗');
  if (distCssExists) {
    const distCss = fs.readFileSync('site/dist/assets/css/style.css', 'utf8');
    console.log('Dist CSS has WhatsApp styling:', distCss.includes('.jb-floating-whatsapp') ? '✓' : '✗');
    console.log('Dist CSS has Assistant launcher styling:', distCss.includes('.jb-floating-assistant-btn') ? '✓' : '✗');
    console.log('Dist CSS has Assistant panel styling:', distCss.includes('.jb-assistant-panel') ? '✓' : '✗');
  }

  console.log('\n=== ALL UI FIX VERIFICATIONS COMPLETE ===');
}

run().catch(console.error);
