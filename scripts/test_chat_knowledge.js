// Test Script: Validate Chatbot Knowledge Base, Matching, & WhatsApp Integration
const fs = require('fs');
const path = require('path');

const mainJsPath = path.resolve(__dirname, '../site/assets/js/main.js');
const cssPath = path.resolve(__dirname, '../site/assets/css/style.css');

const mainJsContent = fs.readFileSync(mainJsPath, 'utf8');
const cssContent = fs.readFileSync(cssPath, 'utf8');

console.log('--- TEST 1: WhatsApp Configuration ---');
const hasWaNumber = mainJsContent.includes('919355412903');
const hasWaUrl = mainJsContent.includes('https://wa.me/919355412903');
const hasWaClass = cssContent.includes('.jb-floating-whatsapp');
const hasWaTooltip = cssContent.includes('.jb-whatsapp-tooltip');
console.log('WhatsApp number present:', hasWaNumber ? '✓' : 'FAIL');
console.log('WhatsApp URL format correct:', hasWaUrl ? '✓' : 'FAIL');
console.log('WhatsApp CSS styles defined:', hasWaClass && hasWaTooltip ? '✓' : 'FAIL');

console.log('\n--- TEST 2: Assistant Launcher & Popup Structure ---');
const hasLauncherClass = cssContent.includes('.jb-floating-assistant-btn');
const hasPanelClass = cssContent.includes('.jb-assistant-panel');
const hasCloseBtn = mainJsContent.includes('jbAssistantClose');
const hasComposer = mainJsContent.includes('jbAssistantComposer');
console.log('Assistant launcher present:', hasLauncherClass ? '✓' : 'FAIL');
console.log('Assistant panel styles present:', hasPanelClass ? '✓' : 'FAIL');
console.log('Top-right close button defined:', hasCloseBtn ? '✓' : 'FAIL');
console.log('Message composer defined:', hasComposer ? '✓' : 'FAIL');

console.log('\n--- TEST 3: Suggested Initial Questions ---');
const suggestions = [
  'Explore our products',
  'Find a trophy or award',
  'Discover corporate gifts',
  'Learn about engraving',
  'Explore our history',
  'Contact our team'
];

let allSuggestionsFound = true;
suggestions.forEach(s => {
  const found = mainJsContent.includes(s);
  if (!found) allSuggestionsFound = false;
  console.log(`Suggestion "${s}":`, found ? '✓' : 'FAIL');
});

console.log('\n--- TEST 4: Knowledge Categories & Services ---');
const expectedCategories = [
  'Corporate Gifts & Executive Mementoes',
  'Trophies & Recognition Awards',
  'Cups, Medals & Shields',
  'Commemorative Plaques & Citations',
  'Presentation Salvers & Trays',
  'Silver Gifts & Keepsakes'
];
let allCategoriesFound = true;
expectedCategories.forEach(cat => {
  const found = mainJsContent.includes(cat);
  if (!found) allCategoriesFound = false;
  console.log(`Category "${cat}":`, found ? '✓' : 'FAIL');
});

const expectedServices = [
  'Laser Engraving',
  'Pantograph Engraving',
  'Chemical Etching',
  'Embossing & Die-Stamping',
  'Screen Printing',
  'Sand Blasting',
  '3D Sub-Surface Laser Engraving',
  'Polyurethane Domed Decals',
  'Hot Foil Stamping'
];
let allServicesFound = true;
expectedServices.forEach(srv => {
  const found = mainJsContent.includes(srv);
  if (!found) allServicesFound = false;
  console.log(`Service "${srv}":`, found ? '✓' : 'FAIL');
});

console.log('\n--- TEST 5: Verify Image Assets Referenced in Chatbot ---');
const imageRegex = /\/assets\/img\/[a-zA-Z0-9_\-\.\/]+/g;
const matches = [...new Set(mainJsContent.match(imageRegex) || [])];
let allImagesExist = true;

matches.forEach(imgPath => {
  // Strip query strings or trailing chars
  const cleanPath = imgPath.split('?')[0].replace(/['",;)]+$/, '');
  const fullPath = path.resolve(__dirname, '../site', cleanPath.replace(/^\//, ''));
  const exists = fs.existsSync(fullPath);
  if (!exists) {
    allImagesExist = false;
    console.log(`MISSING IMAGE: ${cleanPath}`);
  }
});
console.log(`Total unique image assets verified: ${matches.length} | All Exist on Disk:`, allImagesExist ? '✓' : 'FAIL');

console.log('\n--- OVERALL STATUS ---');
const pass = hasWaNumber && hasWaUrl && hasWaClass && hasLauncherClass && allSuggestionsFound && allCategoriesFound && allServicesFound && allImagesExist;
console.log(pass ? 'ALL VERIFICATION CRITERIA PASSED! ✓' : 'SOME CHECKS FAILED!');
process.exit(pass ? 0 : 1);
