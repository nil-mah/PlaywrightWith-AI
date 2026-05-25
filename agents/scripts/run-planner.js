#!/usr/bin/env node

/**
 * Planner Agent Runner
 * Invokes the Planner agent to create test plans
 */

const path = require('path');

const plannerDir = path.join(__dirname, '..', 'planner');

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║          Playwright Planner Agent                    ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

console.log('📋 Planner Agent initialized');
console.log(`   Location: ${plannerDir}`);
console.log(`   Role: Create comprehensive test plans`);
console.log(`   Instructions: ${path.join(plannerDir, '.instructions.md')}\n`);

console.log('▶ Planner Agent is ready to:');
console.log('  • Analyze application features and requirements');
console.log('  • Create test scenarios and test cases');
console.log('  • Plan test coverage and strategy');
console.log('  • Define test data requirements\n');

console.log('Next steps:');
console.log('1. Ask Planner to create a test plan for your feature');
console.log('2. Review the generated test plan in test-plans/');
console.log('3. Run Generator agent with: npm run agent:generate\n');

// The planner agent is now active and ready to interact with the user
// It will read from its .instructions.md file for guidance
