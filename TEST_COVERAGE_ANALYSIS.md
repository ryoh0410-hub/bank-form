# Test Coverage Analysis: Bank Registration Form

## Current State
- **Total Lines of Code**: ~570 (HTML + embedded CSS + JavaScript)
- **Test Coverage**: 0%
- **Testing Framework**: None established

---

## Executive Summary

The bank account registration form (`bank_registration_form.html`) contains all logic in a single HTML file with embedded JavaScript. Currently, **there are no automated tests**. The codebase has significant business logic for form validation, data handling, and submission that would benefit from comprehensive testing.

### Priority Areas (High → Low Impact)
1. **Form validation logic** - Critical to data quality
2. **Data transformation & serialization** - Ensures correct data submission
3. **Form state management** - UI state transitions
4. **Input formatting** - Phone number & account number filtering
5. **Error handling** - User feedback on failures

---

## Architecture Overview

### Testable Components

```
bank_registration_form.html
├── Form Fields (14 inputs/selects)
├── Validation Logic
│   ├── HTML5 native validation
│   └── Custom agreement check
├── Data Processing
│   ├── FormData → JSON conversion
│   └── Field mapping & defaults
├── Submission Handling
│   ├── GAS integration (fetch)
│   └── Demo mode fallback
├── Input Filtering
│   ├── Account number (digits only)
│   └── Phone number (digits + hyphens)
└── UI State Management
    ├── Button loading state
    ├── Error banner visibility
    └── Success overlay display
```

---

## Recommended Testing Stack

### Framework & Tools
- **Test Runner**: [Vitest](https://vitest.dev/) or [Jest](https://jestjs.io/)
  - Fast, modern, good DOM support
  - ESM-friendly (better for future module refactoring)
  
- **DOM Testing**: [jsdom](https://github.com/jsdom/jsdom) (included with Jest/Vitest)

- **Assertions**: Built-in (Vitest) or [@testing-library/jest-dom](https://testing-library.com/docs/queries/about)

- **Mocking**: [Vitest mock utilities](https://vitest.dev/api/vi.html) or Jest

### Project Setup (Recommended)

Create a `tests/` directory and extract JavaScript into separate module files for testing.

---

## Test Coverage Recommendations

### 1. **Form Validation Tests** (HIGH PRIORITY)
**Current Coverage**: 0%  
**Recommended Coverage**: 90%+

#### Tests to Add
- ✅ Required fields validation (name_kanji, email, contractor_id, etc.)
- ✅ Email format validation
- ✅ Agreement checkbox must be checked before submission
- ✅ Form should prevent submission with invalid HTML5 fields
- ✅ Account number field auto-clears non-digits
- ✅ Phone number field preserves only digits and hyphens
- ✅ Account type select must have a selection
- ✅ Request type radio button defaults to "新規"
- ✅ Bank type radio button defaults to "銀行"

#### Example Test
```javascript
describe('Form Validation', () => {
  it('should require name_kanji field', () => {
    // Fill all fields except name_kanji
    // Submit form
    // Assert form does not submit
  });

  it('should reject invalid email format', () => {
    // Set email to "invalid-email"
    // Assert checkValidity() returns false
  });

  it('should require agreement checkbox for submission', () => {
    // Fill all fields, leave agreement unchecked
    // Submit
    // Assert alert shown: "個人情報取扱方針への同意が必要です。"
  });
});
```

---

### 2. **Data Transformation Tests** (HIGH PRIORITY)
**Current Coverage**: 0%  
**Recommended Coverage**: 95%+

#### Tests to Add
- ✅ FormData correctly converts to data object with all 17 fields
- ✅ Optional fields (phone, bank_code, branch_code, notes) are included as empty strings when blank
- ✅ Timestamp is formatted in Asia/Tokyo timezone
- ✅ All field mappings match the HTML form names
- ✅ Data object structure matches expected API contract

#### Example Test
```javascript
describe('Data Transformation', () => {
  it('should convert form data to submission object with all fields', () => {
    // Fill form with sample data
    // Submit (mock fetch)
    // Assert transmitted data object includes all 17 fields
  });

  it('should format timestamp in Asia/Tokyo timezone', () => {
    // Check that timestamp includes Japanese-formatted date
  });

  it('should include empty strings for optional fields', () => {
    // Leave phone, bank_code, branch_code, notes empty
    // Assert data object has those fields as ''
  });
});
```

---

### 3. **Submission & API Integration Tests** (MEDIUM PRIORITY)
**Current Coverage**: 0%  
**Recommended Coverage**: 85%+

#### Tests to Add
- ✅ GAS_SCRIPT_URL unset → demo mode activated (1200ms delay, success overlay shown)
- ✅ GAS_SCRIPT_URL set → fetch called with correct method (POST), mode (no-cors), headers
- ✅ fetch succeeds → success overlay shown, form reset
- ✅ fetch fails → error banner shown and scrolled into view
- ✅ Submit button disabled during submission
- ✅ Submit button loading class added during submission
- ✅ Submit button re-enabled after completion (success or failure)

#### Example Test
```javascript
describe('Form Submission', () => {
  it('should activate demo mode when GAS_SCRIPT_URL is empty', async () => {
    // Ensure GAS_SCRIPT_URL is ''
    // Submit valid form
    // Wait 1200ms
    // Assert success overlay has class 'show'
  });

  it('should call fetch with correct parameters when GAS_SCRIPT_URL is set', async () => {
    // Set GAS_SCRIPT_URL to a mock URL
    // Mock fetch to resolve
    // Submit form
    // Assert fetch was called with POST, no-cors, URLSearchParams body
  });

  it('should disable button and add loading class during submission', async () => {
    // Submit form (mock slow fetch)
    // Assert submitBtn.disabled === true
    // Assert submitBtn has 'loading' class
  });

  it('should show error banner when fetch fails', async () => {
    // Mock fetch to reject
    // Submit form
    // Assert errorBanner has 'show' class
  });
});
```

---

### 4. **Input Filtering Tests** (MEDIUM PRIORITY)
**Current Coverage**: 0%  
**Recommended Coverage**: 100%

#### Tests to Add
- ✅ Account number field removes all non-digit characters
- ✅ Account number max length 8 characters enforced
- ✅ Phone number field removes characters except digits and hyphens
- ✅ Filtering occurs on input event in real-time

#### Example Test
```javascript
describe('Input Filtering', () => {
  it('should remove non-digit characters from account_number', () => {
    const field = document.querySelector('[name="account_number"]');
    field.value = 'abc123def456';
    field.dispatchEvent(new Event('input'));
    expect(field.value).toBe('123456');
  });

  it('should only allow digits and hyphens in phone field', () => {
    const field = document.querySelector('[name="phone"]');
    field.value = '090#1234@5678';
    field.dispatchEvent(new Event('input'));
    expect(field.value).toBe('0901234-5678');
  });
});
```

---

### 5. **UI State Management Tests** (MEDIUM PRIORITY)
**Current Coverage**: 0%  
**Recommended Coverage**: 85%

#### Tests to Add
- ✅ Success overlay visibility toggled correctly
- ✅ Success close button removes 'show' class
- ✅ Error banner visibility and scroll behavior
- ✅ Setup notice appears only when GAS_SCRIPT_URL is empty
- ✅ Spinner visibility in button matches loading state

#### Example Test
```javascript
describe('UI State Management', () => {
  it('should show success overlay after successful submission', async () => {
    // Submit valid form in demo mode
    // Wait for completion
    // Assert successOverlay.classList.contains('show')
  });

  it('should close success overlay when close button clicked', () => {
    // Show success overlay
    // Click close button
    // Assert successOverlay does not have 'show' class
  });

  it('should show setup notice when GAS_SCRIPT_URL is empty', () => {
    // Ensure GAS_SCRIPT_URL is ''
    // Reload script
    // Assert setupNotice.classList.contains('visible')
  });
});
```

---

### 6. **Edge Cases & Boundary Tests** (LOW-MEDIUM PRIORITY)
**Current Coverage**: 0%  
**Recommended Coverage**: 70%

#### Tests to Add
- ✅ Bank code max length 4 enforced
- ✅ Branch code max length 3 enforced
- ✅ Account number max length 8 enforced
- ✅ Large data submission doesn't overflow
- ✅ Form reset clears all fields including unchecked agreement
- ✅ Rapid repeated submissions (should be prevented by disabled button)
- ✅ Network timeout handling (no-cors fetch behavior)

#### Example Test
```javascript
describe('Edge Cases', () => {
  it('should enforce maxlength on bank_code (4 digits)', () => {
    const field = document.querySelector('[name="bank_code"]');
    field.value = '12345';
    expect(field.maxLength).toBe(4);
    expect(field.value.length).toBeLessThanOrEqual(4);
  });

  it('should reset form including unchecked agreement checkbox', async () => {
    // Fill and submit form in demo mode
    // Check that agree checkbox is unchecked after reset
  });
});
```

---

## Test Implementation Strategy

### Phase 1: Setup (Week 1)
- [ ] Extract JavaScript into `formValidation.js` and `formSubmission.js`
- [ ] Set up Vitest with jsdom
- [ ] Create `tests/setup.js` with form HTML fixture
- [ ] Establish CI/CD integration

### Phase 2: Critical Tests (Week 1-2)
- [ ] Form validation tests (aim for 90%+ coverage)
- [ ] Data transformation tests (aim for 95%+ coverage)
- [ ] Input filtering tests (aim for 100% coverage)

### Phase 3: Integration Tests (Week 2-3)
- [ ] Submission handling tests
- [ ] UI state management tests
- [ ] Mock fetch and GAS integration

### Phase 4: Edge Cases (Week 3-4)
- [ ] Boundary value tests
- [ ] Network error scenarios
- [ ] Rapid interaction tests

---

## Coverage Goals

| Category | Current | Target | Priority |
|----------|---------|--------|----------|
| Form Validation | 0% | 90% | HIGH |
| Data Transform | 0% | 95% | HIGH |
| Input Filtering | 0% | 100% | HIGH |
| Submission | 0% | 85% | MEDIUM |
| UI State | 0% | 85% | MEDIUM |
| Edge Cases | 0% | 70% | LOW-MEDIUM |
| **Overall** | **0%** | **85%** | - |

---

## Quick Implementation Example

Here's a minimal test file to get started:

```javascript
// tests/formValidation.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';

describe('Bank Registration Form', () => {
  let dom;
  let form;

  beforeEach(() => {
    dom = new JSDOM(`<!DOCTYPE html><form id="bankForm">
      <input type="text" name="name_kanji" required>
      <input type="email" name="email" required>
      <input type="checkbox" id="agree" required>
    </form>`);
    
    global.document = dom.window.document;
    form = document.getElementById('bankForm');
  });

  it('should mark form as invalid when required fields are empty', () => {
    expect(form.checkValidity()).toBe(false);
  });

  it('should reject invalid email format', () => {
    const emailInput = form.querySelector('[name="email"]');
    emailInput.value = 'not-an-email';
    expect(emailInput.checkValidity()).toBe(false);
  });
});
```

---

## Benefits of Test Coverage

✅ **Regression Prevention**: Catch breaking changes before deployment  
✅ **Refactoring Safety**: Confidently extract JavaScript into modules  
✅ **Documentation**: Tests serve as living documentation of expected behavior  
✅ **Confidence**: Deploy form changes without manual testing every time  
✅ **Maintenance**: Future developers can safely modify code  
✅ **Data Quality**: Ensure correct data reaches Google Sheets  

---

## Next Steps

1. **Review & Approve** this analysis
2. **Set up testing framework** (Vitest recommended)
3. **Create test fixtures** for the form HTML
4. **Implement Phase 1 tests** (validation, transformation, filtering)
5. **Integrate into CI/CD** pipeline
6. **Establish coverage thresholds** (e.g., 80% minimum)

---

## Questions for Refinement

1. **Code Organization**: Should JavaScript be extracted into separate module files?
2. **Async Testing**: How strict should we be with GAS integration testing?
3. **Snapshot Tests**: Should UI structure be tested with snapshots?
4. **E2E Testing**: Should we add Selenium/Playwright tests for real browser testing?
5. **Accessibility Testing**: Should we test WCAG compliance?

---

## Appendix: Files Affected by Changes

```
bank_registration_form.html
├── <script> section (470-566)
│   ├── Form event listeners
│   ├── Validation logic
│   ├── Data transformation
│   ├── Submission handling
│   ├── Input filtering
│   └── UI state management
└── Future: refactor into modules
    ├── modules/formValidation.js
    ├── modules/dataTransform.js
    ├── modules/submission.js
    ├── modules/inputFilter.js
    └── tests/
        ├── formValidation.test.js
        ├── dataTransform.test.js
        ├── submission.test.js
        └── inputFilter.test.js
```

---

*Analysis Date: 2026-05-27*  
*Codebase: bank_registration_form.html (v2.0.0)*
