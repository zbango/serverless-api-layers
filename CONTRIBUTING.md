# 🤝 Contributing to serverless-api-layers

Thank you for your interest in contributing to **serverless-api-layers**! This framework is built to empower developers to create validated, layered, and event-driven APIs on Serverless architecture.

Below you'll find guidelines to help you get started and avoid common pitfalls.

---

## ⚙️ Prerequisites

- Node.js **v18+**
- pnpm (installed via **npm**, not Homebrew)

### ✅ Installing pnpm (official way)

```bash
npm install -g pnpm@latest
```

> ⚠️ If you previously installed pnpm via Homebrew, we recommend uninstalling it:
>
> ```bash
> brew uninstall pnpm
> ```

To confirm you have the correct version:

```bash
pnpm -v  # should show something like 10.x.x
```

Optionally, define the expected version in your `packageManager` field:

```json
"packageManager": "pnpm@10.6.5"
```

---

## 📁 Project Structure

```
serverless-api-layers/
├── packages/
│   ├── core/         # Framework core
│   │   └── __tests/  # Unit tests for the core
│   ├── test/         # Test harness and utilities
│   └── docs/         # Documentation (Next.js or similar)
├── playground/       # Example projects using the framework
├── README.md
├── MANIFESTO.md
├── CONTRIBUTING.md
├── package.json (monorepo root)
└── pnpm-workspace.yaml
```

---

## 🚀 Getting Started

1. Clone the repo

```bash
git clone https://github.com/zbango/serverless-api-layers.git
cd serverless-api-layers
```

2. Install dependencies

```bash
pnpm install
```

3. Run all packages

```bash
pnpm build     # Builds all packages
pnpm dev       # Runs dev mode for all packages
pnpm test      # Runs tests for all packages
```

4. Run only for core

```bash
pnpm --filter core dev
```

---

## 🧪 Testing

- Unit tests for the core framework are located in `packages/core/__tests__`
- Run all tests:

```bash
pnpm test
```

---

## 🧠 Guidelines

- Use `pnpm` always, never mix with `npm install`.
- Keep exports clean in `core/src/index.ts`
- All models must use Zod.
- Prefer declarative code over imperative.
- Validate all inputs and outputs.

---

If you have questions, open an issue or reach out to [Steven Tabango](mailto:steven.tabango@gmail.com).

Let’s build better backends ✨
