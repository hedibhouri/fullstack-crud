---
paths:
  - '**/*.spec.ts'
  - '**/*.e2e-spec.ts'
  - 'apps/api/test/**'
  - 'apps/web/src/**/__tests__/**'
---

# Testing rules

- Arrange / Act / Assert. One behaviour per `it`, named as a sentence: `it('throws NotFoundException when missing')`.
- Tests are deterministic: no real network, DB or timers. Mock at the boundary (repository, `api/` module), not internal functions.
- Reset mocks between tests (`jest.resetAllMocks()` / `vi.resetAllMocks()`); never share mutable state across tests.
- Build test data with small factory helpers (`buildTask(overrides)`), not copy-pasted literals.
- Assert on observable behaviour (return values, HTTP status/body, rendered text, emitted events), not on private details.
- Every bug fix starts with a failing test that reproduces it.
- Never delete or `.skip` a failing test to make the suite pass. Fix the code or explain why the test is wrong.
