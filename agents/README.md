# Playwright AI Agents

This directory contains three coordinated AI agents for intelligent test automation:

## Agents

### 1. Planner Agent
**Role**: Analyzes requirements and creates comprehensive test plans
- Analyzes application features and user flows
- Identifies test scenarios and edge cases
- Creates detailed test plans and strategies
- Defines test data requirements

**Usage**: `npm run agent:plan`

### 2. Generator Agent
**Role**: Generates test code based on test plans
- Writes Playwright test specifications
- Creates Page Object Model classes
- Generates test fixtures and utilities
- Implements best practices and patterns

**Usage**: `npm run agent:generate`

### 3. Healer Agent
**Role**: Diagnoses and fixes failing tests
- Analyzes test failures and error logs
- Identifies root causes of failures
- Fixes broken selectors and assertions
- Updates tests for application changes

**Usage**: `npm run agent:heal`

## Workflow

```
Requirements → Planner (Plan) → Generator (Code) → Execute → Healer (Fix)
```

## Configuration

Each agent has its own configuration in `.instructions.md` files that define:
- Agent purpose and constraints
- Tool access and limitations
- Interaction guidelines
- Quality standards

## Running Agents

```bash
# Plan tests for a feature
npm run agent:plan

# Generate tests based on plan
npm run agent:generate

# Heal failing tests
npm run agent:heal

# Run all agents in sequence
npm run agent:orchestrate
```
