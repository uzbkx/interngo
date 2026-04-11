# Playwright 3-Agent Testing System

## Purpose

After Claude finishes implementing any feature, fix, or change, this testing system automatically spins up **3 parallel Playwright agents** that validate the work from three independent angles before considering the task complete. No implementation is "done" until all three agents pass.

---

## When to Trigger

Run this testing pipeline **immediately after Claude completes any of the following**:

- Implementing a new feature or component
- Fixing a bug
- Refactoring existing code
- Modifying UI layout, styles, or interactions
- Changing API endpoints or data flows
- Updating dependencies that affect runtime behavior

**Do NOT skip testing** even for "small" changes. If code was modified, all three agents run.

---

## Agent Architecture

All three agents run **in parallel** using separate Playwright browser contexts. Each agent operates independently and produces its own pass/fail verdict with detailed findings.

```
                    +------------------+
                    |  Claude finishes  |
                    |  implementation   |
                    +--------+---------+
                             |
              +--------------+--------------+
              |              |              |
     +--------v---+  +------v------+  +----v--------+
     |   AGENT 1  |  |   AGENT 2   |  |   AGENT 3   |
     |   Visual   |  |    Code     |  |  Functional  |
     |  Inspector |  |  Reviewer   |  |   Tester     |
     +--------+---+  +------+------+  +----+--------+
              |              |              |
              +--------------+--------------+
                             |
                    +--------v---------+
                    |  Aggregate Report |
                    |  Pass / Fail      |
                    +------------------+
```

---

## Agent 1: Visual Inspector

### Role
Detect visual regressions, layout breakage, design inconsistencies, and responsive failures. This agent is the "designer's eye" — it catches what automated unit tests miss.

### Responsibilities

#### 1.1 Screenshot Comparison
- Take full-page screenshots of every affected page/route **before and after** the change
- Compare screenshots pixel-by-pixel using a perceptual diff algorithm
- Flag any region where the diff exceeds a **0.1% pixel threshold**
- For new pages with no baseline, capture the initial baseline and flag it for human review

#### 1.2 Component-Level Visual Regression
- Identify all UI components that were added or modified in the change
- Isolate each component and screenshot it in all its states:
  - Default / resting state
  - Hover state
  - Focus state
  - Active / pressed state
  - Disabled state
  - Loading state
  - Error state
  - Empty / no-data state
- Compare each state screenshot against its baseline
- Report any unexpected visual changes to components that were NOT directly modified (cascade regressions)

#### 1.3 Layout & Spacing Verification
- Verify the page layout grid is intact (no overlapping elements, no broken flex/grid)
- Check that spacing between elements follows the design system's spacing scale
- Detect elements that overflow their containers
- Detect elements that are cut off or hidden unintentionally (clipped text, truncated images)
- Verify z-index stacking is correct (no elements hidden behind others unexpectedly)

#### 1.4 Typography & Color Consistency
- Verify font families, sizes, weights, and line heights match the design system
- Check that text contrast ratios meet WCAG AA minimum (4.5:1 for normal text, 3:1 for large text)
- Verify color usage matches the design tokens (no hardcoded hex values that drift from the palette)
- Check that dark mode / light mode variants render correctly if applicable

#### 1.5 Responsive Testing
- Test at these breakpoints at minimum:
  - **Mobile**: 375px (iPhone SE), 390px (iPhone 14)
  - **Tablet**: 768px (iPad), 1024px (iPad landscape)
  - **Desktop**: 1280px, 1440px, 1920px
- At each breakpoint verify:
  - No horizontal scrollbar appears (unless intentional)
  - Text remains readable (no text smaller than 12px on mobile)
  - Touch targets are at least 44x44px on mobile
  - Navigation is accessible and functional
  - Images and media scale appropriately
  - Modals and overlays fit within the viewport

#### 1.6 Animation & Transition Check
- Verify that CSS transitions and animations still play correctly
- Check for janky or stuttering animations (frame drops)
- Ensure animations respect `prefers-reduced-motion` media query
- Verify loading skeletons and spinners display during async operations

#### 1.7 Cross-Browser Visual Check
- Run visual checks in at minimum:
  - Chromium (latest)
  - Firefox (latest)
  - WebKit/Safari (latest)
- Flag any browser-specific rendering differences

### Pass Criteria
- Zero unexpected visual diffs above the threshold
- All responsive breakpoints render correctly
- All component states match baselines
- No layout overflow or clipping issues
- WCAG contrast ratios met

### Failure Output
For each failure, provide:
- Screenshot of the issue with the problem area highlighted/annotated
- Before vs. after comparison (side by side)
- Exact CSS selector of the affected element
- Viewport size where the issue occurs
- Suggested fix if determinable

---

## Agent 2: Code Reviewer

### Role
Analyze the code that was written or modified for quality, correctness, security, performance, and adherence to project conventions. This agent reads the actual source code and the diff — it does NOT run the app.

### Responsibilities

#### 2.1 Diff Analysis
- Read the full git diff of all changes Claude made
- Understand the intent of each change
- Flag any changes that seem unrelated to the stated task (scope creep)
- Flag any files that were modified but probably shouldn't have been

#### 2.2 Code Quality
- Check for:
  - Dead code (unused variables, unreachable branches, commented-out code)
  - Code duplication (same logic repeated instead of extracted)
  - Overly complex functions (cyclomatic complexity > 10)
  - Functions that are too long (> 50 lines as a soft guideline)
  - Deeply nested conditionals (> 3 levels)
  - Magic numbers or strings that should be constants
  - Inconsistent naming conventions
  - Missing or incorrect TypeScript types (if applicable)
  - Proper error handling (no swallowed errors, no empty catch blocks)

#### 2.3 Security Audit
- Check for OWASP Top 10 vulnerabilities:
  - **Injection**: SQL injection, command injection, XSS via unsanitized user input
  - **Broken auth**: Hardcoded credentials, missing auth checks on routes
  - **Sensitive data exposure**: Secrets in code, PII logging, unencrypted storage
  - **CSRF**: Missing CSRF tokens on state-changing requests
  - **Insecure deserialization**: Unsafe JSON.parse on untrusted input
  - **Dependency vulnerabilities**: Known CVEs in imported packages
- Check for:
  - `eval()`, `innerHTML`, `dangerouslySetInnerHTML` usage without sanitization
  - Regex that could be exploited for ReDoS
  - File path construction from user input without sanitization
  - API keys, tokens, or secrets anywhere in the code

#### 2.4 Performance Review
- Flag:
  - N+1 query patterns (loops that make individual DB/API calls)
  - Missing pagination on list endpoints
  - Unbounded data fetching (no limits on query results)
  - Expensive operations inside render loops or hot paths
  - Missing memoization where re-computation is costly
  - Large bundle imports that could be lazy-loaded or tree-shaken
  - Missing `key` props on list renders (React)
  - Synchronous blocking operations that should be async
  - Memory leaks (event listeners not cleaned up, intervals not cleared)

#### 2.5 Accessibility Code Review
- Verify:
  - All interactive elements have appropriate ARIA attributes
  - Images have meaningful `alt` text (not empty, not "image")
  - Form inputs have associated `<label>` elements
  - Focus management is handled for dynamic content (modals, drawers, toasts)
  - Keyboard navigation works (no mouse-only interactions)
  - Semantic HTML is used (`<button>` not `<div onClick>`, `<nav>` not `<div class="nav">`)
  - Color is not the only means of conveying information
  - Screen reader announcements for dynamic state changes (`aria-live` regions)

#### 2.6 Test Coverage Assessment
- Check if the changes include appropriate tests:
  - New features should have corresponding test files
  - Bug fixes should have regression tests that would have caught the bug
  - Edge cases identified in the implementation should be tested
- Flag missing test coverage with specific suggestions for what to test
- Verify existing tests still make sense after the changes (no tests testing old behavior)

#### 2.7 Dependency & Import Review
- Check for:
  - New dependencies that were added — are they necessary? Are they maintained? Are they large?
  - Circular imports
  - Importing from internal/private modules of dependencies
  - Version pinning issues

#### 2.8 Project Convention Adherence
- Verify the code follows existing patterns in the codebase:
  - File naming conventions
  - Directory structure
  - State management patterns
  - API call patterns
  - Error handling patterns
  - Logging conventions
- Flag deviations from established patterns (unless the deviation is an intentional improvement)

### Pass Criteria
- No security vulnerabilities
- No performance anti-patterns
- Code quality metrics within acceptable ranges
- Accessibility requirements met in code
- Appropriate test coverage exists
- Project conventions followed

### Failure Output
For each issue, provide:
- Severity: **Critical** (must fix), **Warning** (should fix), **Info** (nice to fix)
- File path and line number
- Description of the issue
- Why it matters
- Suggested fix with code snippet

---

## Agent 3: Functional Tester

### Role
Verify that the implementation actually works correctly from a user's perspective. This agent interacts with the running application like a real user would — clicking, typing, navigating, and verifying outcomes.

### Responsibilities

#### 3.1 Happy Path Testing
- Identify the primary user flow(s) affected by the change
- Walk through each flow end-to-end:
  - Navigate to the relevant page
  - Interact with the new/modified UI elements
  - Verify the expected outcome occurs
  - Verify data persistence (if applicable — refresh and check data is still there)
  - Verify navigation works correctly (back button, breadcrumbs, links)
- For API changes: verify the request/response cycle produces correct results

#### 3.2 Input Validation & Edge Cases
- Test boundary conditions:
  - Empty inputs / empty state
  - Maximum length inputs (paste 10,000 characters into text fields)
  - Special characters: `<script>alert('xss')</script>`, `'; DROP TABLE users; --`, unicode, emojis, RTL text
  - Negative numbers, zero, very large numbers
  - Invalid email formats, phone numbers, URLs
  - File uploads: wrong type, too large, zero bytes, corrupted file
- Test state transitions:
  - Rapid clicking / double submission
  - Navigating away mid-operation and coming back
  - Submitting a form and immediately hitting back
  - Opening the same action in multiple tabs

#### 3.3 Error Handling Verification
- Trigger every error state the implementation should handle:
  - Network failures (use Playwright to simulate offline mode)
  - API returning 400, 401, 403, 404, 500 errors
  - Timeout scenarios (throttle network to simulate slow responses)
  - Malformed API responses
- For each error, verify:
  - A user-friendly error message is displayed (not a raw stack trace)
  - The app does not crash or enter an unrecoverable state
  - The user can recover (retry, go back, dismiss the error)
  - Error state is cleared when the user retries successfully

#### 3.4 Data Integrity Testing
- Verify CRUD operations work correctly:
  - **Create**: New items appear in lists, counts update, related data updates
  - **Read**: Data displays correctly, formatting is right, sorting/filtering works
  - **Update**: Changes persist, optimistic updates revert on failure, related data stays consistent
  - **Delete**: Items are removed, counts update, dependent data handles the deletion gracefully, undo works if implemented
- Test concurrent operations:
  - Edit the same item in two tabs — verify conflict handling
  - Delete an item while it's being edited elsewhere

#### 3.5 Authentication & Authorization Testing
- If the change involves protected resources:
  - Verify unauthenticated users are redirected to login
  - Verify unauthorized users see appropriate error messages
  - Test with different user roles/permissions
  - Verify session expiry is handled gracefully
  - Test token refresh flows

#### 3.6 Navigation & Routing
- Verify:
  - Direct URL access works (deep linking)
  - Browser back/forward buttons work correctly
  - Page refresh preserves state where expected
  - Query parameters and URL state are handled correctly
  - 404 pages display for invalid routes
  - Redirects work as expected

#### 3.7 Integration Verification
- Test that the change works correctly with adjacent features:
  - If a list page was modified, test that clicking into detail pages still works
  - If an API endpoint changed, test all consumers of that endpoint
  - If a shared component was modified, test it in all contexts where it appears
  - If state management was changed, verify derived/computed state updates correctly

#### 3.8 Performance Functional Testing
- Measure and verify:
  - Page load time is under 3 seconds on throttled 3G
  - Time to interactive is under 5 seconds
  - No layout shift after initial render (CLS < 0.1)
  - List views handle 100+ items without freezing
  - Search/filter operations respond in under 500ms
  - Animations run at 60fps (no jank)

#### 3.9 Keyboard & Screen Reader Testing
- Verify complete keyboard operability:
  - Tab through all interactive elements in logical order
  - Enter/Space activates buttons and links
  - Escape closes modals, dropdowns, popovers
  - Arrow keys navigate within composite widgets (tabs, menus, listboxes)
  - No keyboard traps (user can always tab out)
- Verify screen reader compatibility:
  - All content is announced in meaningful order
  - Dynamic updates are announced via live regions
  - Form errors are associated with their inputs and announced

### Pass Criteria
- All happy paths complete successfully
- Edge cases handled without crashes
- Error states display correct messages and allow recovery
- Data operations are consistent and persistent
- No regressions in adjacent features
- Performance budgets met
- Keyboard and screen reader accessible

### Failure Output
For each failure, provide:
- Severity: **Blocker** (prevents release), **Major** (degrades experience), **Minor** (cosmetic/edge case)
- Steps to reproduce (exact clicks, inputs, and navigation)
- Expected result vs. actual result
- Screenshot or video recording of the failure
- Browser/viewport where the failure occurs
- Console errors captured during the failure
- Network requests that failed (status code, response body)

---

## Orchestration Instructions

### Startup Sequence

1. **Pre-flight checks**:
   - Verify the dev server is running and healthy (hit the health endpoint or root URL)
   - Verify Playwright browsers are installed (`npx playwright install` if needed)
   - Create fresh browser contexts for each agent (no shared state between agents)
   - Capture pre-change baselines if this is the first run

2. **Launch all 3 agents in parallel**:
   - Each agent gets its own isolated browser context
   - Each agent gets its own temp directory for screenshots and artifacts
   - Set a **global timeout of 5 minutes per agent** — if an agent hasn't finished, kill it and report timeout
   - Agents must NOT interfere with each other's state (no shared database rows, no shared test accounts)

3. **During execution**:
   - Each agent logs its progress in real-time
   - If Agent 3 (Functional) needs to modify data, use unique identifiers to avoid collisions
   - If any agent encounters a hard crash, capture the error and continue other agents

### Test Account & Data Isolation
- Each agent should use a **separate test user account** if authentication is involved
- Agent 3 should create its own test data and clean it up after each test
- Never rely on data created by another agent

### Retry Policy
- Each individual test within an agent gets **1 automatic retry** on failure (to account for flaky selectors or network blips)
- If a test fails on retry, it is marked as a genuine failure
- Agents themselves do NOT retry — if an agent crashes, it is marked as errored

---

## Aggregate Reporting

### Report Structure

After all 3 agents complete, produce a single **unified report** with this structure:

```
=== PLAYWRIGHT TEST REPORT ===

Overall Verdict: PASS | FAIL | ERROR

Agent 1 — Visual Inspector:    PASS | FAIL (X issues)
Agent 2 — Code Reviewer:       PASS | FAIL (X issues)
Agent 3 — Functional Tester:   PASS | FAIL (X issues)

--- BLOCKERS (must fix before proceeding) ---
[List of Critical/Blocker issues from all agents]

--- WARNINGS (should fix) ---
[List of Warning/Major issues from all agents]

--- INFO (nice to fix) ---
[List of Info/Minor issues from all agents]

--- SCREENSHOTS & ARTIFACTS ---
[Links to captured screenshots, diffs, videos]
```

### Verdict Logic
- **PASS**: All 3 agents pass with zero blockers and zero critical issues
- **FAIL**: Any agent has a blocker/critical issue
- **ERROR**: Any agent crashed or timed out (treat as failure, investigate before re-running)

### What Happens After the Report

- **If PASS**: Claude can consider the implementation complete and report success to the user
- **If FAIL**: Claude must:
  1. Read the failure details from all agents
  2. Fix the issues in priority order (Blockers first, then Warnings)
  3. Re-run the full 3-agent test suite after fixes
  4. Repeat until all agents pass
- **If ERROR**: Claude must investigate why the agent crashed, fix the test infrastructure issue, and re-run

### Maximum Retry Cycles
- The fix-and-retest loop runs a **maximum of 3 cycles**
- If after 3 cycles there are still failures, Claude must:
  1. Report the remaining issues to the user
  2. Explain what was tried
  3. Ask for guidance

---

## Configuration

### Environment Variables
```
PLAYWRIGHT_BASE_URL=http://localhost:3000    # App URL to test against
PLAYWRIGHT_TIMEOUT=30000                      # Per-action timeout (ms)
PLAYWRIGHT_RETRIES=1                          # Auto-retries per test
PLAYWRIGHT_SCREENSHOT_DIR=./test-artifacts    # Where to save screenshots
PLAYWRIGHT_VIDEO=on                           # Record video of agent runs
PLAYWRIGHT_TRACE=on                           # Capture Playwright traces for debugging
```

### Customization Per Project
- Adjust breakpoints in Agent 1 to match your project's design system
- Adjust performance budgets in Agent 3 to match your SLAs
- Add project-specific security rules to Agent 2 based on your tech stack
- Modify severity thresholds based on your team's quality bar

---

## Screenshot Retrieval & Visual Evidence

### How Screenshots Are Captured

Every agent captures screenshots at key moments. All screenshots are saved to `PLAYWRIGHT_SCREENSHOT_DIR` (default: `./test-artifacts/`) organized by agent and timestamp.

#### Agent 1 (Visual Inspector) Screenshots
```
test-artifacts/
  visual/
    baselines/                      # Pre-change reference screenshots
      {page-name}-{breakpoint}.png
    current/                        # Post-change screenshots
      {page-name}-{breakpoint}.png
    diffs/                          # Perceptual diff images (red highlights)
      {page-name}-{breakpoint}-diff.png
    components/                     # Isolated component state captures
      {component}-{state}.png
```

**Capture methods:**
- `page.screenshot({ fullPage: true })` — full-page captures for layout verification
- `element.screenshot()` — isolated component captures for state-by-state comparison
- Use `page.setViewportSize()` before each breakpoint capture
- Diff images generated by comparing baseline vs. current using `pixelmatch` or Playwright's built-in comparator

#### Agent 2 (Code Reviewer) Screenshots
Agent 2 does not browse the app, but it should capture:
```
test-artifacts/
  code-review/
    annotated-diff.html             # Syntax-highlighted diff with inline annotations
    dependency-graph.png            # Visual of new/changed import relationships (optional)
```

#### Agent 3 (Functional Tester) Screenshots
```
test-artifacts/
  functional/
    steps/                          # Screenshot at each interaction step
      {test-name}-step-{N}.png
    failures/                       # Screenshot at moment of failure
      {test-name}-failure.png
    videos/                         # Full video recordings of test runs
      {test-name}.webm
    traces/                         # Playwright trace files (open with `npx playwright show-trace`)
      {test-name}-trace.zip
    network/                        # HAR files for network request analysis
      {test-name}.har
```

**Capture methods:**
- `page.screenshot()` after every significant interaction (click, submit, navigation)
- On failure: immediate screenshot + console log dump + network log
- Video: enabled via `video: 'on'` in browser context config
- Trace: enabled via `tracing.start()` / `tracing.stop()` — captures DOM snapshots, network, console at every step

### Retrieving Screenshots After a Run

After the test suite completes, Claude should:

1. **Read all failure screenshots** using the `Read` tool (it supports image files)
2. **Display the visual diff** for any Agent 1 failures — show the before, after, and diff side-by-side
3. **Display the failure screenshot** for any Agent 3 failures — annotate what went wrong
4. **If video was captured**, reference the path so the user can play it back
5. **If a Playwright trace was captured**, provide the command to open it:
   ```
   npx playwright show-trace test-artifacts/functional/traces/{test-name}-trace.zip
   ```

### Screenshot Comparison Strategy

| Scenario | What to capture | How to compare |
|----------|----------------|----------------|
| New page/component | Capture as new baseline | No comparison — flag for human review |
| Existing page modified | Capture current + load baseline | Pixel diff with threshold |
| Responsive check | Capture at each breakpoint | Compare against breakpoint baselines |
| Error state | Capture the error UI | Compare against expected error design |
| Before/after fix | Capture pre-fix and post-fix | Side-by-side for the report |

### Screenshot Naming Convention

All screenshots follow this naming pattern for easy retrieval:
```
{agent}-{page-or-test}-{breakpoint-or-state}-{timestamp}.png
```

Examples:
```
visual-homepage-375px-20260405T143022.png
visual-dashboard-hover-1440px-20260405T143025.png
functional-login-step-3-20260405T143030.png
functional-checkout-failure-20260405T143045.png
```

### Automatic Cleanup
- Baselines are kept permanently (committed to the repo or stored in a dedicated baseline directory)
- Current run artifacts are kept for the **last 5 runs** and then pruned
- Failure screenshots are kept until the issue is resolved

---

## Summary

| Agent | Focus | Catches |
|-------|-------|---------|
| **Visual Inspector** | How it looks | Layout breaks, responsive failures, design drift, visual regressions |
| **Code Reviewer** | How it's written | Security holes, performance issues, dead code, missing tests, convention violations |
| **Functional Tester** | How it works | Broken flows, edge case crashes, data bugs, error handling gaps, accessibility failures |

All three agents must pass before any implementation is considered complete. No exceptions.
