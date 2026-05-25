# Test Plans Directory

This directory contains test plans created by the Planner Agent.

## What is a Test Plan?

A test plan is a comprehensive document that:
- Describes the feature or application under test
- Identifies test scenarios and test cases
- Defines expected results and test data
- Documents test coverage strategy
- Lists dependencies and prerequisites

## File Naming Convention

Test plans should be named with the convention:
```
test-plan-[feature-name].md
```

Examples:
- `test-plan-user-authentication.md`
- `test-plan-event-booking.md`
- `test-plan-search-functionality.md`

## Test Plan Structure

Each test plan should include:

```markdown
# Test Plan: [Feature Name]

## Feature Overview
- Brief description
- User stories covered
- Acceptance criteria

## Test Scenarios
1. **Scenario**: [Name]
   - **Preconditions**: 
   - **Steps**:
   - **Expected Results**:
   - **Test Data**:

## Test Data Requirements
- User roles needed
- Test data to create
- Mock data required

## Dependencies & Prerequisites
- Required features
- Environment setup
- External systems

## Coverage Goals
- Target coverage percentage
- Risk areas identified
- Known limitations
```

## Usage Workflow

1. **Create Plan**: Ask Planner agent to create a test plan for your feature
2. **Review Plan**: Check the generated plan for completeness
3. **Generate Tests**: Use Generator agent with the test plan
4. **Execute**: Run the generated tests with `npm test`
5. **Fix Issues**: Use Healer agent to fix any failing tests

## Examples

After running the Planner agent, test plans will appear here with examples of:
- User authentication test plan
- Feature-specific test plans
- Integration test plans
- Edge case test scenarios
