# 🧱 serverless-api-layers – Core

[![Release](https://img.shields.io/github/actions/workflow/status/zbango/serverless-api-layers/release.yml?branch=main&label=release)](https://github.com/zbango/serverless-api-layers/actions/workflows/release.yml)
[![npm version](https://img.shields.io/npm/v/serverless-api-layers?label=npm)](https://www.npmjs.com/package/serverless-api-layers)

Core package for building secure, validated and event-driven Data API layers on AWS using Serverless Framework and TypeScript.

---

## ✨ Features

- 📦 Simple data modeling with `defineModel()` and Zod
- 🔒 Input validation, hooks, and typed responses
- 🧠 DynamoDB abstraction with Single Table Design (STD)
- 🧪 Built-in support for unit testing
- ⚡ Automatic generation of `serverless.yml` infrastructure
- 🔁 Ready for event-driven architectures (SNS, SQS, etc.)

---

## 📦 Installation

```bash
pnpm add serverless-api-layers zod @aws-sdk/client-dynamodb @aws-sdk/util-dynamodb
```

---

## 🛠 Usage Example

```ts
import { defineModel } from 'serverless-api-layers'
import { z } from 'zod'

const model = defineModel({
  tableName: 'my-table',
  entities: {
    User: {
      schema: z.object({ userId: z.string(), email: z.string().email() }),
      keys: {
        pk: (u) => `USER#${u.userId}`,
        sk: (u) => `PROFILE#${u.userId}`,
      },
    },
  },
})

await model.User.put({ userId: '123', email: 'me@example.com' })
```

---

## 🧪 Run tests

```bash
pnpm test
```

---

## 🚀 Release flow

This package uses [`semantic-release`](https://semantic-release.gitbook.io/) to automatically:

- Bump version based on commit messages
- Update changelog
- Publish to npm
- Create GitHub release

See [PUBLISHING.md](../../PUBLISHING.md) for full details.

---

## 📄 License

MIT – © Steven Tabango
