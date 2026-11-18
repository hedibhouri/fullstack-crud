# 12 — Code quality tooling

Automated tools enforce quality so humans review **logic**, not style. Each tool has a distinct
job:

| Tool             | Job                           | Runs when                                |
| ---------------- | ----------------------------- | ---------------------------------------- |
| **TypeScript**   | Type correctness              | editor, `npm run typecheck`, build, CI   |
| **ESLint**       | Bugs & bad patterns           | editor, `npm run lint`, pre-commit, CI   |
| **Prettier**     | Formatting                    | on save, pre-commit, CI (`format:check`) |
| **EditorConfig** | Basic editor settings         | any editor                               |
| **Husky**        | Runs Git hooks                | `git commit`                             |
| **lint-staged**  | Lint/format only staged files | pre-commit hook                          |

## 1. TypeScript strict mode

Both apps enable `"strict": true`, which turns on `strictNullChecks`, `noImplicitAny` and more.
Extra flags used:

| Flag                                  | Effect                                                                        |
| ------------------------------------- | ----------------------------------------------------------------------------- |
| `noImplicitOverride`                  | Overriding a method requires `override` (API)                                 |
| `noFallthroughCasesInSwitch`          | Forgetting `break` is an error                                                |
| `noUncheckedIndexedAccess`            | `arr[0]` is `T \| undefined` (web)                                            |
| `noUnusedLocals/Parameters`           | Dead code is an error (web)                                                   |
| `strictPropertyInitialization: false` | (API) Entities/DTOs are filled by TypeORM/class-transformer, not constructors |

Project conventions on top: no `any` (use `unknown` and narrow), no `@ts-ignore`, explicit
return types on exported functions.

## 2. ESLint 9 (flat config)

ESLint 9 uses a single `eslint.config.*` file exporting an array of config objects.

**API** ([`eslint.config.mjs`](../apps/api/eslint.config.mjs)):

- `eslint.configs.recommended` + `tseslint.configs.recommendedTypeChecked` — **type-aware** rules
  (they use the TypeScript compiler), e.g. `no-floating-promises` catches a forgotten `await`,
  one of the most common Node bugs.
- `eslint-plugin-prettier/recommended` — reports formatting differences as lint errors.
- Test files relax a few `no-unsafe-*` rules because mocks are loosely typed.

**Web** ([`eslint.config.ts`](../apps/web/eslint.config.ts)):

- `eslint-plugin-vue` `flat/recommended` + `@vue/eslint-config-typescript`.
- Custom rules: multi-word component names, PascalCase in templates, block order
  script → template → style.
- `skipFormatting` — ESLint ignores formatting; Prettier owns it.

Fix automatically what can be fixed: `npm run lint:fix -w @app/api`.

## 3. Prettier

[`.prettierrc.json`](../.prettierrc.json): single quotes, semicolons, trailing commas, 100-char
lines, LF line endings. Run `npm run format` (write) or `npm run format:check` (CI).
[`.prettierignore`](../.prettierignore) skips build output and the lockfile.

**Why a formatter?** It ends every style debate and makes diffs show only real changes.

## 4. EditorConfig and `.gitattributes`

[`.editorconfig`](../.editorconfig) sets UTF-8, LF, 2-space indent, final newline for any editor.
[`.gitattributes`](../.gitattributes) (`* text=auto eol=lf`) makes Git store LF even on Windows,
avoiding "every line changed" diffs between Windows and Linux/Mac developers.

## 5. Git hooks: Husky + lint-staged

A **Git hook** is a script Git runs at certain moments. [Husky](https://typicode.github.io/husky)
manages them inside the repo:

- `npm install` runs the root `prepare` script → `husky` → sets `git config core.hooksPath .husky/_`.
- [`.husky/pre-commit`](../.husky/pre-commit) contains `npx lint-staged`.

[lint-staged](https://github.com/lint-staged/lint-staged) runs commands **only on staged files**
(fast, even in big repos). It uses the **closest** config to each file:

| Config location         | Files                  | Commands                           |
| ----------------------- | ---------------------- | ---------------------------------- |
| `apps/api/package.json` | `*.ts`                 | `eslint --fix`, `prettier --write` |
| `apps/web/package.json` | `*.{ts,vue}`, `*.css`  | `eslint --fix`, `prettier --write` |
| root `package.json`     | `*.{json,md,yml,yaml}` | `prettier --write`                 |

Because each app has its own config, ESLint runs from that app's folder and finds the right
`eslint.config`. If ESLint finds an unfixable error, the commit is aborted.

**Alternatives:** `simple-git-hooks` (lighter), `lefthook` (fast, parallel). Hooks can be bypassed
with `--no-verify`, which is why **CI re-runs every check** — the hook is convenience, CI is the
real gate.

## 6. VS Code settings

[`.vscode/settings.json`](../.vscode/settings.json): format on save with Prettier, ESLint fix on
save, use the workspace TypeScript. [`extensions.json`](../.vscode/extensions.json) recommends
Vue (Volar), ESLint, Prettier, EditorConfig — VS Code prompts new contributors to install them.

## 7. The Definition of Done

A change is complete only when this passes (also what CI runs):

```bash
npm run format:check && npm run lint && npm run typecheck && npm test && npm run test:e2e && npm run build
```
