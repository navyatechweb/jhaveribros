const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('================================================================');
console.log('   JHAVERI BROS. & CO. — MASTER AUDIT & REGRESSION SUITE        ');
console.log('   Verifying SEO, Mobile UX, Links, Forms, 404 & All 17 Routes   ');
console.log('================================================================\n');

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function assert(condition, message) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failedChecks++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

// 1. Audit Viewport & SEO Metadata Across All Pages
console.log('\n[1/6] AUDITING VIEWPORT & SEO METADATA ACROSS ALL HTML PAGES:');
const htmlFiles = [
  ...fs.readdirSync('site').filter(f => f.endsWith('.html') && f !== 'privacy.html' && f !== 'terms.html').map(f => path.join('site', f)),
  ...fs.readdirSync('site/products').filter(f => f.endsWith('.html')).map(f => path.join('site/products', f))
];

const titlesSeen = new Set();
const descsSeen = new Set();

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Viewport
  const hasViewport = content.includes('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
  assert(hasViewport, `${file} has width=device-width viewport meta tag`);

  // Title
  const titleM = content.match(/<title>([^<]+)<\/title>/i);
  const title = titleM ? titleM[1] : '';
  const hasValidTitle = title.length > 10 && title.includes('Jhaveri Bros') && !title.includes('&amp;');
  assert(hasValidTitle, `${file} title: "${title}"`);
  
  // Description
  const descM = content.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i) ||
                content.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["'][^>]*>/i);
  const desc = descM ? descM[1] : '';
  const descLen = desc.length;
  const hasValidDesc = descLen >= 140 && descLen <= 165 && desc.includes('Jhaveri Bros');
  assert(hasValidDesc, `${file} meta description: (${descLen} chars) "${desc.slice(0, 60)}..."`);
  
  const normalizedFile = file.replace(/\\/g, '/');
  if (normalizedFile !== 'site/products/index.html') { // products.html and products/index.html are duplicate aliases
    assert(!titlesSeen.has(title), `Title is unique for ${file}`);
    assert(!descsSeen.has(desc), `Description is unique for ${file}`);
    titlesSeen.add(title);
    descsSeen.add(desc);
  }
});

// 2. Audit Clickable Brand Logos & Navigation
console.log('\n[2/6] AUDITING CLICKABLE LOGOS & 7-DESTINATION NAVIGATION:');
htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Desktop logo clickable
  const hasDesktopLogoLink = content.includes('class="brand-link"');
  assert(hasDesktopLogoLink, `${file} has clickable desktop brand link`);

  // Mobile drawer header logo clickable
  if (content.includes('mobile-drawer-header')) {
    const hasMobileHeaderLink = content.includes('<a href="/" aria-label="Jhaveri Bros. homepage"');
    assert(hasMobileHeaderLink, `${file} has clickable mobile drawer header link`);
  }

  // Footer logo clickable (if footer brand logo exists)
  if (content.includes('footer-brand')) {
    const hasFooterLogoLink = content.includes('<a href="/" aria-label="Jhaveri Bros. homepage" style="display:inline-block;');
    assert(hasFooterLogoLink, `${file} has clickable footer logo link`);
  }
});

// 3. Audit Clickable Contact Links (tel: and mailto:) & Footer Destinations
console.log('\n[3/6] AUDITING CLICKABLE CONTACT CHANNELS & FOOTER LINKS:');
htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  if (content.includes('site-footer')) {
    // Tel links in footer
    const hasFooterTel = content.includes('href="tel:+912222071818"') || content.includes('href="tel:');
    assert(hasFooterTel, `${file} footer contains clickable telephone links`);

    // Legal links
    const hasPrivacy = content.includes('href="/privacy-policy"');
    const hasTerms = content.includes('href="/terms-and-conditions"');
    const hasDisclaimer = content.includes('href="/disclaimer"');
    assert(hasPrivacy && hasTerms && hasDisclaimer, `${file} footer contains all 3 legal policy links`);

    // Website credit
    const hasCredit = content.includes('navyatech.co.in');
    assert(hasCredit, `${file} footer contains verified Navya Tech management credit`);
  }
});

// 4. Audit 404 Not Found Page Content
console.log('\n[4/6] AUDITING 404 NOT FOUND PAGE CONTENT & BUTTONS:');
const notFoundContent = fs.readFileSync('site/404.html', 'utf8');
assert(notFoundContent.includes('This page could not be found.'), '404 page has exact required heading');
assert(notFoundContent.includes('The page you are looking for may have moved or is no longer available. Explore our collections or return to the homepage.'), '404 page has required supporting text');
assert(notFoundContent.includes('href="/"') && notFoundContent.includes('href="/products"') && notFoundContent.includes('href="/enquiry"') && notFoundContent.includes('href="/contact"'), '404 page has all 4 required destination links (Home, Products, Enquiry, Contact)');

// 5. Audit CSS Synchronization & Responsive Design
console.log('\n[5/6] AUDITING STYLESHEET SYNCHRONIZATION & RESPONSIVE RULES:');
const srcCss = fs.readFileSync('site/assets/css/style.css', 'utf8');
const pubCss = fs.readFileSync('site/public/assets/css/style.css', 'utf8');
assert(srcCss === pubCss, 'site/assets/css/style.css and site/public/assets/css/style.css are 100% synchronized');

assert(srcCss.includes('overflow-x: clip;'), 'style.css uses standard overflow-x: clip for document protection');
assert(srcCss.includes('overflow-wrap: anywhere;'), 'style.css protects layout against long unbroken text strings');
assert(srcCss.includes('repeat(12, minmax(0, 1fr))'), 'Bento grid tracks use minmax(0, 1fr) to prevent overflow');
assert(srcCss.includes('min-width: 44px') && srcCss.includes('min-height: 44px'), 'Mobile touch targets enforce 44px minimum sizing');

// 6. Test Live Routes via HTTP GET
console.log('\n[6/6] VERIFYING ALL 17 PUBLIC HTTP ROUTES ON LIVE SERVER:');
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

async function testRoutes() {
  for (const r of routes) {
    await new Promise((resolve) => {
      http.get(`http://localhost:5173${r}`, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          assert(res.statusCode === 200, `HTTP GET ${r} returned status 200 (${body.length} bytes)`);
          resolve();
        });
      }).on('error', (err) => {
        assert(false, `HTTP GET ${r} failed: ${err.message}`);
        resolve();
      });
    });
  }

  console.log('\n================================================================');
  console.log(`TOTAL AUDIT CHECKS: ${totalChecks}`);
  console.log(`PASSED: ${passedChecks}`);
  console.log(`FAILED: ${failedChecks}`);
  console.log(`STATUS: ${failedChecks === 0 ? 'ALL CRITERIA MET WITH 100% PASS RATE! ✓' : 'SOME CHECKS FAILED'}`);
  console.log('================================================================\n');

  if (failedChecks > 0) process.exit(1);
}

testRoutes();
