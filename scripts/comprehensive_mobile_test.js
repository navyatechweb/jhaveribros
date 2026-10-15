const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('================================================================');
console.log('   JHAVERI BROS. & CO. — COMPREHENSIVE MOBILE AUDIT SUITE       ');
console.log('   Auditing Mobile UX, Responsive CSS, Touch Targets & Viewports ');
console.log('================================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

// 1. Audit Viewport Meta Tags across ALL HTML Files
console.log('\n[1/7] AUDITING VIEWPORT META TAGS IN ALL HTML FILES:');
const htmlFiles = [
  ...fs.readdirSync('site').filter(f => f.endsWith('.html')).map(f => path.join('site', f)),
  ...fs.readdirSync('site/products').filter(f => f.endsWith('.html')).map(f => path.join('site/products', f))
];

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const hasViewport = content.includes('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
  assert(hasViewport, `${file} has width=device-width viewport meta tag`);
});

// 2. Audit Main Header, Brand, and Navigation
console.log('\n[2/7] AUDITING BRAND LOGO & 7-DESTINATION MOBILE NAVIGATION:');
const mainPages = [
  'site/index.html',
  'site/about-us.html',
  'site/products.html',
  'site/services.html',
  'site/clientele.html',
  'site/enquiry.html',
  'site/contact.html'
];

const requiredNavs = ['HOME', 'ABOUT US', 'PRODUCTS', 'SERVICES', 'CLIENTELE', 'ENQUIRY', 'CONTACT'];
const requiredGalleries = [
  'corporate-gifts',
  'cups-medals-shields',
  'plaques',
  'salvers',
  'silver',
  'trophies'
];

mainPages.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  assert(content.includes('src="/favicon.ico"') || content.includes("src='/favicon.ico'"), `${file} uses official /favicon.ico logo`);
  assert(content.includes('Jhaveri Bros. &amp; Co.') || content.includes('Jhaveri Bros. & Co.'), `${file} brand title strictly Jhaveri Bros. & Co.`);
  
  // Check all 7 destinations exist in mobile drawer
  const allNavsPresent = requiredNavs.every(n => content.includes(`>${n}<`));
  assert(allNavsPresent, `${file} mobile drawer contains all 7 main navigation items`);

  // Check all 6 galleries exist in products submenu
  const allGalleriesPresent = requiredGalleries.every(g => content.includes(g));
  assert(allGalleriesPresent, `${file} mobile navigation reaches all 6 product galleries`);
});

// 3. Audit Services Page (All 9 Techniques Have Responsive Classes)
console.log('\n[3/7] AUDITING SERVICES PAGE FOR 9 RESPONSIVE PROCESS ROWS:');
const servicesContent = fs.readFileSync('site/services.html', 'utf8');
const processIds = ['laser', 'pantograph', 'etching', 'embossing', 'screen', 'sandblast', '3d', 'sticker', 'foil'];

processIds.forEach(id => {
  const hasRowClass = servicesContent.includes(`id="${id}" class="service-process-row"`);
  assert(hasRowClass, `Process #${id} has class="service-process-row" for mobile responsive stacking`);
});

// 4. Audit CSS Responsive Design System & Breakpoints in style.css
console.log('\n[4/7] AUDITING RESPONSIVE CSS IN style.css:');
const css = fs.readFileSync('site/assets/css/style.css', 'utf8');

// Check Safe Area Inset declarations
assert(css.includes('--safe-area-bottom: env(safe-area-inset-bottom'), 'CSS defines safe-area variables for mobile bezels/notches');

// Check global overflow-x protection
assert(css.includes('overflow-x: hidden') && css.includes('max-width: 100%'), 'html and body protected against horizontal overflow');

// Check word breaking protection
assert(css.includes('overflow-wrap: break-word'), 'CSS prevents long strings/emails/URLs from breaking mobile layout');

// Check iOS auto-zoom prevention (<768px font-size: 16px)
assert(css.includes('font-size: 16px !important'), 'iOS Safari auto-zoom prevented via 16px font-size rule on mobile inputs');

// Check minimum 44px touch targets
assert(css.includes('min-width: 44px') && css.includes('min-height: 44px'), '44px x 44px touch targets enforced for mobile controls');

// Check brand title clamp & truncation
assert(css.includes('clamp(1rem, 3.8vw, 1.4rem)') && css.includes('text-overflow: ellipsis'), 'Brand title uses fluid clamp and ellipsis on narrow mobile viewports');

// Check Content-driven breakpoints: 1100, 900, 768, 640, 600, 480, 360
const testedBreakpoints = [1100, 900, 768, 640, 600, 480, 360];
testedBreakpoints.forEach(bp => {
  assert(css.includes(`@media (max-width: ${bp}px)`), `CSS contains content-driven breakpoint for max-width: ${bp}px`);
});

// Check reduced motion support
assert(css.includes('@media (prefers-reduced-motion: reduce)'), 'CSS contains prefers-reduced-motion support');

// Check CSS sync between site/assets/css and site/public/assets/css
const publicCss = fs.readFileSync('site/public/assets/css/style.css', 'utf8');
assert(css === publicCss, 'site/assets/css/style.css and site/public/assets/css/style.css are 100% identical and synchronized');

// 5. Audit Floating Controls (WhatsApp + AI Concierge)
console.log('\n[5/7] AUDITING FLOATING CONTROLS & CHATBOT POPUP:');
assert(css.includes('.jb-floating-whatsapp'), 'Floating WhatsApp button styled');
assert(css.includes('.jb-floating-assistant-btn'), 'Floating AI Assistant launcher styled');
assert(css.includes('.jb-assistant-panel'), 'Chatbot popup panel styled with fixed header and composer');
assert(css.includes('height: calc(100dvh - 20px) !important'), 'Chatbot popup expands responsively to 100dvh on mobile');
assert(css.includes('padding-bottom: max(5.5rem'), 'Footer has bottom safe-area clearance for floating buttons');

// 6. Audit Forms & Contact Information
console.log('\n[6/7] AUDITING ENQUIRY FORMS & CLICKABLE CONTACT CHANNELS:');
const contactContent = fs.readFileSync('site/contact.html', 'utf8');
assert(contactContent.includes('href="tel:+912222071818"'), 'Telephone numbers are clickable tel: links');
assert(contactContent.includes('href="mailto:info@jhaveribros.com"'), 'Email address is a clickable mailto: link');
assert(contactContent.includes('<iframe') && css.includes('.map-wrapper iframe'), 'Google Maps embed is enclosed in a responsive wrapper');

const enquiryContent = fs.readFileSync('site/enquiry.html', 'utf8');
assert(enquiryContent.includes('type="tel"'), 'Phone input field has type="tel" for numeric mobile keyboards');
assert(enquiryContent.includes('type="email"'), 'Email input field has type="email" for email mobile keyboards');

// 7. Verify All 17 Production Routes on Server
const port = process.env.PORT || 5173;
console.log(`\n[7/7] VERIFYING ALL 17 PUBLIC HTTP ROUTES (http://localhost:${port}):`);
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

async function runRouteTests() {
  for (const route of routes) {
    await new Promise(resolve => {
      http.get(`http://localhost:${port}${route}`, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          assert(res.statusCode === 200, `Route ${route} returned HTTP 200 (length: ${data.length})`);
          resolve();
        });
      }).on('error', err => {
        assert(false, `Route ${route} failed with error: ${err.message}`);
        resolve();
      });
    });
  }

  console.log('\n================================================================');
  console.log(`TOTAL AUDIT CHECKS: ${totalTests}`);
  console.log(`PASSED: ${passedTests}`);
  console.log(`FAILED: ${failedTests}`);
  console.log(failedTests === 0 ? 'STATUS: ALL CRITERIA MET WITH 100% PASS RATE!' : 'STATUS: SOME CHECKS FAILED');
  console.log('================================================================');
  process.exit(failedTests === 0 ? 0 : 1);
}

runRouteTests();
