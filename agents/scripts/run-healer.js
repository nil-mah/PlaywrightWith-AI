#!/usr/bin/env node

/**
 * Healer Agent Runner
 * Invokes the Healer agent to fix failing tests
 */

const path = require('path');

const healerDir = path.join(__dirname, '..', 'healer');

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║           Playwright Healer Agent                    ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

console.log('🔧 Healer Agent initialized');
console.log(`   Location: ${healerDir}`);
console.log(`   Role: Diagnose and fix failing tests`);
console.log(`   Instructions: ${path.join(healerDir, '.instructions.md')}\n`);

console.log('▶ Healer Agent is ready to:');
console.log('  • Analyze test failures and error logs');
console.log('  • Identify root causes of failures');
console.log('  • Fix broken selectors and assertions');
console.log('  • Update tests for application changes\n');

console.log('Expected inputs:');
console.log('1. Test failure output or error logs');
console.log('2. Affected test files and page objects');
console.log('3. Application context and DOM information\n');

console.log('Next steps:');
console.log('1. Run tests first: npm test');
console.log('2. Ask Healer to fix failing tests');
console.log('3. Verify fixes with: npm test');
console.log('4. Commit fixed tests to version control\n');

// The healer agent is now active and ready to interact with the user
// It will read from its .instructions.md file for guidance
