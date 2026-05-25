#!/usr/bin/env node

/**
 * Generator Agent Runner
 * Invokes the Generator agent to create test code
 */

const path = require('path');

const generatorDir = path.join(__dirname, '..', 'generator');

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║        Playwright Generator Agent                    ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

console.log('🔧 Generator Agent initialized');
console.log(`   Location: ${generatorDir}`);
console.log(`   Role: Generate test code and Page Objects`);
console.log(`   Instructions: ${path.join(generatorDir, '.instructions.md')}\n`);

console.log('▶ Generator Agent is ready to:');
console.log('  • Write Playwright test specifications');
console.log('  • Create Page Object Model (POM) classes');
console.log('  • Generate test utilities and fixtures');
console.log('  • Implement best practices and patterns\n');

console.log('Expected inputs:');
console.log('1. Test plan from Planner (in test-plans/)');
console.log('2. Application structure and requirements\n');

console.log('Next steps:');
console.log('1. Ask Generator to create tests from a test plan');
console.log('2. Review generated files in tests/ui/ and src/pages/');
console.log('3. Run tests with: npm test');
console.log('4. Use Healer agent if tests fail: npm run agent:heal\n');

// The generator agent is now active and ready to interact with the user
// It will read from its .instructions.md file for guidance
