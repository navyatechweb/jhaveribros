import fs from 'fs';
import path from 'path';

const snippet = `  <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="shortcut icon" href="/favicon.ico" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <meta name="apple-mobile-web-app-title" content="Jhaveri Bros & Co" />
  <link rel="manifest" href="/site.webmanifest" />`;

function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== 'dist' && file !== 'node_modules' && file !== '.git') {
        results = results.concat(getHtmlFiles(fullPath));
      }
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = getHtmlFiles('site');
console.log(`Found ${files.length} HTML files.`);

for (const filePath of files) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if head tag exists
  if (!content.includes('<head>')) {
    console.log(`Skipping (no <head>): ${filePath}`);
    continue;
  }

  // Remove any existing icon / apple-touch-icon / manifest / apple-mobile-web-app-title links
  // Pattern 1: Existing icon links
  content = content.replace(/[ \t]*<link[^>]*rel=["'](?:icon|shortcut icon|apple-touch-icon|manifest)["'][^>]*>\r?\n?/gi, '');
  // Pattern 2: Existing apple-mobile-web-app-title meta
  content = content.replace(/[ \t]*<meta[^>]*name=["']apple-mobile-web-app-title["'][^>]*>\r?\n?/gi, '');
  // Pattern 3: Existing comment <!-- Favicon -->
  content = content.replace(/[ \t]*<!-- Favicon -->\r?\n?/gi, '');

  // Now insert the new snippet before </head> or before Google Fonts / style.css
  const insertTarget = content.includes('<link rel="stylesheet" href="/assets/css/style.css">')
    ? '<link rel="stylesheet" href="/assets/css/style.css">'
    : (content.includes('</head>') ? '</head>' : null);

  if (!insertTarget) {
    console.warn(`Could not find insertion point in ${filePath}`);
    continue;
  }

  const replacement = `  <!-- Favicon & Web App Manifest -->\n${snippet}\n\n  ${insertTarget}`;
  content = content.replace(insertTarget, replacement);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated: ${filePath}`);
}

console.log('All files processed.');
