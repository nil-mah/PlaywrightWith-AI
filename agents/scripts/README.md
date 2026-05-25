# Agent Scripts

This directory contains scripts for running individual Playwright AI agents.

## Scripts

### run-planner.ts
Runs the Planner agent to create test plans based on requirements.

### run-generator.ts  
Runs the Generator agent to create test code from plans.

### run-healer.ts
Runs the Healer agent to fix failing tests.

### orchestrate.ts
Orchestrates all three agents in sequence:
Planner → Generator → Healer

## Usage

```bash
# Run individual agents
npm run agent:plan
npm run agent:generate  
npm run agent:heal

# Run all agents in orchestration
npm run agent:orchestrate
```

## Environment Variables

Set these in `.env` to configure agent behavior:

```env
AGENT_MODE=interactive|batch
AGENT_LOG_LEVEL=debug|info|warn|error
AGENT_TIMEOUT=300000
```

## Output

- **Planner**: Creates test plans in `test-plans/`
- **Generator**: Creates test files in `tests/ui/`
- **Healer**: Updates broken tests in `tests/ui/`
