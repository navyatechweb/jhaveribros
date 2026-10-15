const http = require('http');

const routes = [
  '/',
  '/about-us',
  '/products',
  '/products/corporate-gifts',
  '/products/cups-medals-shields',
  '/products/plaques',
  '/products/salvers',
  '/products/silver',
  '/products/trophies',
  '/services',
  '/clientele',
  '/enquiry',
  '/contact',
  '/privacy-policy',
  '/terms-and-conditions',
  '/disclaimer',
  '/404.html'
];

const port = process.env.PORT || 5173;

async function testRoute(route) {
  return new Promise((resolve) => {
    const url = `http://localhost:${port}${route}`;
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasTitle = data.includes('<title>');
        const hasHeader = data.includes('site-header');
        const hasFooter = data.includes('site-footer');
        const hasJhaveri = data.includes('Jhaveri Bros');
        const hasOldCustomInk = data.toLowerCase().includes('custom ink luxembourg') || data.toLowerCase().includes('tattooparlor');
        
        console.log(`[${res.statusCode}] ${route.padEnd(30)} len: ${data.length.toString().padStart(6)} | Title: ${hasTitle ? '✓' : '✗'} | Header: ${hasHeader ? '✓' : '✗'} | Jhaveri: ${hasJhaveri ? '✓' : '✗'} | Clean: ${!hasOldCustomInk ? '✓' : 'FAIL (Old branding)'}`);
        resolve(res.statusCode === 200 && !hasOldCustomInk);
      });
    }).on('error', (err) => {
      console.error(`ERROR ${route}:`, err.message);
      resolve(false);
    });
  });
}

async function run() {
  console.log('Testing all production routes on preview server (http://localhost:4173)...\n');
  let allPass = true;
  for (const r of routes) {
    const ok = await testRoute(r);
    if (!ok && r !== '/404.html') allPass = false;
  }
  console.log('\nResult:', allPass ? 'ALL ROUTES PASSED VERIFICATION! ✓' : 'SOME ROUTES FAILED!');
}

run();
