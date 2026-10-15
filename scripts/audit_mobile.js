const fs = require('fs');
const path = require('path');

const htmlFiles = [
  ...fs.readdirSync('site').filter(f => f.endsWith('.html')).map(f => path.join('site', f)),
  ...fs.readdirSync('site/products').filter(f => f.endsWith('.html')).map(f => path.join('site/products', f))
];

console.log('--- AUDITING HTML FILES ---');
htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const issues = [];

  // 1. Meta viewport
  const viewportMatch = content.match(/<meta[^>]*name=["']viewport["'][^>]*>/i);
  if (!viewportMatch) {
    issues.push('Missing viewport meta tag');
  } else if (!viewportMatch[0].includes('width=device-width')) {
    issues.push('Viewport missing width=device-width: ' + viewportMatch[0]);
  }

  // 2. Fixed inline widths in pixels (e.g. style="width: 800px" or width="800")
  const fixedWidthStyle = content.match(/style="[^"]*width:\s*[4-9]\d{2,}px[^"]*"/gi);
  if (fixedWidthStyle) {
    issues.push('Fixed wide inline width style: ' + fixedWidthStyle.join(', '));
  }

  const fixedWidthAttr = content.match(/<[^>]+width=["']([4-9]\d{2,}|\d{4,})["'][^>]*>/gi);
  if (fixedWidthAttr) {
    // filter out svgs or iframes if handled
    issues.push('Fixed wide width attributes: ' + fixedWidthAttr.map(m => m.slice(0, 50)).join('; '));
  }

  // 3. Check for tel: and mailto: links in contact pages
  if (file.includes('contact') || file.includes('enquiry')) {
    if (!content.includes('tel:')) issues.push('No tel: links found');
    if (!content.includes('mailto:')) issues.push('No mailto: links found');
  }

  // 4. Check for images without alt or with potential layout shifts
  const imgMatches = content.match(/<img[^>]+>/gi) || [];
  let imgsWithoutAlt = 0;
  imgMatches.forEach(img => {
    if (!img.includes('alt=')) imgsWithoutAlt++;
  });
  if (imgsWithoutAlt > 0) issues.push(`${imgsWithoutAlt} images missing alt text`);

  console.log(`\n[${file}] - ${issues.length === 0 ? '✓ PASS' : '⚠ ISSUES FOUND:'}`);
  issues.forEach(iss => console.log('   - ' + iss));
});
