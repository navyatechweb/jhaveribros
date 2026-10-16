const fs = require('fs');

const cssPath = 'site/assets/css/style.css';
let css = fs.readFileSync(cssPath, 'utf8');

// 1. Update html/body overflow-x to clip and ensure overflow-wrap: anywhere for unbreakable strings
css = css.replace(
  /html\s*\{([^}]*)\}/s,
  (match, body) => {
    let newBody = body.replace(/overflow-x:\s*hidden;/g, 'overflow-x: clip;');
    return `html {${newBody}}`;
  }
);

css = css.replace(
  /body\s*\{([^}]*)\}/s,
  (match, body) => {
    let newBody = body.replace(/overflow-x:\s*hidden;/g, 'overflow-x: clip;');
    if (!newBody.includes('overflow-wrap: anywhere')) {
      newBody = newBody.replace(/overflow-wrap:\s*break-word;/g, 'overflow-wrap: anywhere;');
    }
    return `body {${newBody}}`;
  }
);

// 2. Ensure bento-grid uses minmax(0, 1fr)
css = css.replace(
  /grid-template-columns:\s*repeat\(12,\s*1fr\);/g,
  'grid-template-columns: repeat(12, minmax(0, 1fr));'
);

// 3. Ensure all bento-col and bento-card elements have min-width: 0
if (!css.includes('.bento-col-12, .bento-col-9, .bento-col-8')) {
  css = css.replace(
    /\.bento-card\s*\{/g,
    '.bento-card {\n  min-width: 0;'
  );
  css = css.replace(
    /\/\* Span Utilities \*\//g,
    '/* Span Utilities */\n.bento-col-12, .bento-col-9, .bento-col-8, .bento-col-7, .bento-col-6, .bento-col-5, .bento-col-4, .bento-col-3 { min-width: 0; }'
  );
}

// 4. Update .footer-top-grid
css = css.replace(
  /grid-template-columns:\s*2fr 1fr 1fr 1fr 1\.5fr;/g,
  'grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.5fr);'
);

// 5. Update .hero-grid
css = css.replace(
  /grid-template-columns:\s*1\.15fr 0\.85fr;/g,
  'grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);'
);

// 6. Ensure .product-grid uses minmax with min(100%, 240px)
css = css.replace(
  /grid-template-columns:\s*repeat\(auto-fill,\s*minmax\(260px,\s*1fr\)\);/g,
  'grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr));'
);

fs.writeFileSync(cssPath, css, 'utf8');
fs.copyFileSync(cssPath, 'site/public/assets/css/style.css');

console.log('Successfully updated style.css and synced to public/assets/css/style.css');
