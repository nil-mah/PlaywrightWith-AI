#!/usr/bin/env node

/**
 * Playwright AI Agents Orchestrator
 * Coordinates planning, generation, and healing of tests
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

interface AgentConfig {
  name: string;
  description: string;
  command: string;
  enabled: boolean;
}

const agents: AgentConfig[] = [
  {
    name: 'planner',
    description: 'Plan test scenarios',
    command: 'npm run agent:plan',
    enabled: true,
  },
  {
    name: 'generator',
    description: 'Generate test code',
    command: 'npm run agent:generate',
    enabled: true,
  },
  {
    name: 'healer',
    description: 'Fix failing tests',
    command: 'npm run agent:heal',
    enabled: true,
  },
];

async function runAgent(agent: AgentConfig): Promise<void> {
  if (!agent.enabled) {
    console.log(`⊘ Skipping ${agent.name} (disabled)`);
    return;
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`▶ Running ${agent.name.toUpperCase()} Agent`);
  console.log(`  ${agent.description}`);
  console.log(`${'='.repeat(60)}\n`);

  try {
    execSync(agent.command, { stdio: 'inherit' });
    console.log(`\n✓ ${agent.name} completed successfully\n`);
  } catch (error) {
    console.error(`\n✗ ${agent.name} failed`);
    throw error;
  }
}

async function orchestrate(): Promise<void> {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║     Playwright AI Agents Orchestration                   ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');

  const startTime = Date.now();

  try {
    for (const agent of agents) {
      await runAgent(agent);
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log('\n╔═══════════════════════════════════════════════════════════╗');
    console.log('║     All agents completed successfully!                   ║');
    console.log(`║     Total time: ${duration}s` + ' '.repeat(32 - duration.length) + '║');
    console.log('╚═══════════════════════════════════════════════════════════╝\n');
  } catch (error) {
    console.error('\nOrchestration failed. See errors above.');
    process.exit(1);
  }
}

// Run orchestration
orchestrate().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
