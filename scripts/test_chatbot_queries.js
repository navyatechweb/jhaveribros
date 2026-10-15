import fs from 'fs';

const code = fs.readFileSync('site/assets/js/main.js', 'utf8');

// Extract KB and evaluateQuery definitions
const kbMatch = code.match(/const JB_KB = \{[\s\S]*?\n  \};\n\n  \/\/ 2\. Build DOM Elements/);
const evalMatch = code.match(/const evaluateQuery = \([\s\S]*?\n  \};\n\n  \/\/ 5\. Query Handling/);

if (!kbMatch || !evalMatch) {
  console.error('Failed to parse main.js');
  process.exit(1);
}

const testEnv = new Function(kbMatch[0] + '\n' + evalMatch[0].replace('// 5. Query Handling', '') + '\nreturn evaluateQuery;');
const evaluateQuery = testEnv();

const testQueries = [
  'Where is your showroom located?',
  'Can I navigate to the shop using google maps?',
  'Who manages this website?',
  'Tell me about trophies and awards',
  'Do you make medals with ribbons for school sports?',
  'What corporate gifts do you offer?',
  'How does chemical etching work?',
  'Can you put a 3d model inside crystal?',
  'What is your minimum order quantity?',
  'Can I order just 1 single trophy for retirement?',
  'How long does custom delivery take?',
  'What materials do you use?',
  'How do I send my company logo?',
  'Did you make trophies for Amitabh Bachchan?',
  'Are you open on Sunday?',
  'What are your contact phone numbers and email?',
  'Tell me about your history from 1914',
  'What is your privacy policy?',
  'What presentation salvers and trays do you make?',
  'Do you sell hallmarked 999 pure silver coins?'
];

console.log('=== TESTING CHATBOT KNOWLEDGE ACROSS ALL SITE TOPICS ===\n');
let allPassed = true;

testQueries.forEach((q, i) => {
  const res = evaluateQuery(q);
  const hasText = !!res.text && res.text.length > 20;
  const hasCards = Array.isArray(res.cards) && res.cards.length > 0;
  const hasChips = Array.isArray(res.chips) && res.chips.length > 0;
  const ok = hasText && hasCards && hasChips;
  if (!ok) allPassed = false;
  console.log(`[${i + 1}] "${q}"`);
  console.log(`    ↳ Cards (${res.cards.length}): ${res.cards.map(c => c.title).join(' | ')}`);
  console.log(`    ↳ Chips (${res.chips.length}): ${res.chips.join(', ')}`);
  console.log(`    ↳ Status: ${ok ? '✓ PASS' : '✗ FAIL'}\n`);
});

console.log('Overall Chatbot Knowledge Test:', allPassed ? 'ALL PASSED ✓' : 'FAILED ✗');
if (!allPassed) process.exit(1);
