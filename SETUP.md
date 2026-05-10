# Template Setup

Steps to recreate this development environment from scratch.

## 1. Initialize the project

```bash
npm init -y
```

Then edit `package.json` manually:

- Change `"type": "commonjs"` to `"type": "module"`
- Remove `"directories"` if present

## 2. Install core TypeScript tooling

```bash
npm install --save-dev typescript tsx @types/node
```

## 3. Install Vitest

```bash
npm install --save-dev vitest
```

## 4. Install ESLint

```bash
npm init @eslint/config@latest
```

Follow the prompts:

- Lint: **JavaScript**
- How to use: **problems**
- Module type: **esm**
- Framework: **none**
- TypeScript: **yes**
- Where runs: **node** ← important, not browser
- Config format: **ts**
- Install dependencies: **yes**

## 5. Install Prettier

```bash
npm install --save-dev prettier eslint-config-prettier
```

## 6. Fix generated config files

In `eslint.config.ts`:

- Change `globals.browser` to `globals.node`
- Import `eslint-config-prettier` and add it last in the array

In `tsconfig.json`:

- Set `"module": "nodenext"` and `"moduleResolution": "nodenext"`
- Remove `"jsx"`, `"declaration"`, `"declarationMap"`
- Add `"rootDir": "."` if using both `src/` and `test/`
- Add `"exclude": ["node_modules", "dist"]`

In `package.json`:

- Update scripts (see `README.md`)
