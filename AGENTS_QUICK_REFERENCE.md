# Playwright AI Agents - Quick Reference

## Agent Commands

### 🔍 Planner Agent
Creates comprehensive test plans for features.

```bash
npm run agent:plan
```

**Usage:**
1. Run the command to activate the Planner agent
2. Ask it to create a test plan for your feature
3. Review the generated plan in `test-plans/`
4. Pass the plan to the Generator agent

**Example Output:**
```
test-plans/test-plan-user-login.md
```

---

### 🔧 Generator Agent
Generates test code and Page Objects from test plans.

```bash
npm run agent:generate
```

**Usage:**
1. Prepare a test plan (from Planner or manually)
2. Run the command to activate the Generator agent
3. Ask it to generate tests from a specific test plan
4. Review generated files in `tests/ui/` and `src/pages/`
5. Run tests with `npm test`

**Example Output:**
```
tests/ui/login/user-login.spec.ts
src/pages/LoginPage.ts
```

---

### 🛠️ Healer Agent
Diagnoses and fixes failing tests.

```bash
npm run agent:heal
```

**Usage:**
1. Run tests: `npm test`
2. If tests fail, run the Healer agent
3. Share test failure output with the agent
4. Agent analyzes and fixes the issues
5. Review fixed files and verify with `npm test`

**Example Workflow:**
```bash
npm test                  # Tests fail ✗
npm run agent:heal        # Healer analyzes failures
# Healer fixes broken tests
npm test                  # Tests pass ✓
```

---

### 🎯 Orchestrator
Runs all three agents in sequence: Planner → Generator → Healer

```bash
npm run agent:orchestrate
```

**Complete Workflow:**
```
Planner creates test plan
  ↓
Generator creates tests from plan
  ↓
Healer fixes any failures
  ↓
All agents complete
```

---

## Typical Workflows

### Workflow 1: Plan and Generate Tests
```bash
npm run agent:plan           # 1. Create test plan
npm run agent:generate       # 2. Generate test code
npm test                     # 3. Run tests
```

### Workflow 2: Fix Failing Tests
```bash
npm test                     # 1. Run tests (some fail)
npm run agent:heal           # 2. Fix failures
npm test                     # 3. Verify fixes
```

### Workflow 3: Complete Automation
```bash
npm run agent:orchestrate    # 1. All agents run in sequence
npm test                     # 2. Verify final result
```

### Workflow 4: Iterative Test Development
```bash
# Iteration 1
npm run agent:plan           # Create initial plan
npm run agent:generate       # Generate tests

npm test                     # Run tests
npm run agent:heal           # Fix failures (Iteration 2)

npm test                     # Verify all pass
```

---

## Agent Capabilities Matrix

| Capability | Planner | Generator | Healer |
|-----------|---------|-----------|--------|
| Create test plans | ✓ | - | - |
| Generate test code | - | ✓ | - |
| Generate Page Objects | - | ✓ | - |
| Analyze failures | - | - | ✓ |
| Fix broken selectors | - | - | ✓ |
| Update assertions | - | - | ✓ |
| Implement best practices | ✓ | ✓ | - |

---

## Environment Setup

### Prerequisites
```bash
node >= 20.0.0
npm >= 10.0.0
playwright >= 1.52.0
typescript >= 5.7.0
```

### Installation
```bash
npm install
```

### Verify Setup
```bash
npm run agent:plan     # Should show Planner welcome message
npm run agent:generate # Should show Generator welcome message  
npm run agent:heal     # Should show Healer welcome message
```

---

## Configuration

Edit `agents/config.json` to:
- Enable/disable specific agents
- Adjust timeout values
- Modify output directories
- Restrict/allow specific tools per agent

---

## Tips and Tricks

### 1. Use Descriptive Feature Names
When asking Planner for a test plan, use clear feature names:
```
"Plan tests for user login with email and password"
```

### 2. Share Test Failure Context
When using Healer, share the full test output:
```
Failure: element not found for selector "#invalid-selector"
Expected to find input.email-field but got error...
```

### 3. Review and Adjust
Always review agent-generated code before committing:
- Check test logic is correct
- Verify selectors work with your app
- Ensure test data is available

### 4. Batch Processing
For multiple features:
```bash
npm run agent:plan           # Plan all features
npm run agent:generate       # Generate all tests
npm test                     # Run all tests
npm run agent:heal           # Fix any failures
```

---

## Troubleshooting

### Agent not responding
Check MCP servers are running:
```bash
curl https://api.githubcopilot.com/mcp/
```

### Generated tests fail immediately
- Check application is running
- Verify selectors in Page Objects
- Ensure test data is available

### Healer can't fix tests
- Provide complete error messages
- Share relevant application code
- Include HTML/DOM context if possible

---

## File Structure Reference

```
PROJECT/
├── agents/                          # Agent definitions
│   ├── planner/.instructions.md     # Planner guidance
│   ├── generator/.instructions.md   # Generator guidance
│   ├── healer/.instructions.md      # Healer guidance
│   └── config.json                  # Agent configuration
├── test-plans/                      # Planner output
│   └── test-plan-*.md
├── tests/ui/                        # Generator output (tests)
├── src/pages/                       # Generator output (POMs)
├── test-results/                    # Test execution results
└── playwright-report/               # Test report
```

---

## Next Steps

1. ✅ Agents are set up and ready to use
2. 📋 Start with `npm run agent:plan` for your first feature
3. 🔧 Use `npm run agent:generate` to create tests
4. 🧪 Run `npm test` to execute tests
5. 🛠️ Use `npm run agent:heal` to fix any failures

Happy automating! 🚀
