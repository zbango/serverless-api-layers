# serverless-api-layers

> Build validated, layered, and event-driven APIs on Serverless architecture.

---

## 🧠 What is this framework?

This is a lightweight but powerful TypeScript-based toolkit to build **data-driven backends** using AWS Lambda, API Gateway, DynamoDB and event-driven patterns.

It helps you define your **entities**, expose them via **validated APIs**, and soon — react to **events** across your system.

---

## ✅ Why this framework?

| Feature                    | Description                                                                |
| -------------------------- | -------------------------------------------------------------------------- |
| ⚙️ Serverless Native       | Designed from the ground up for AWS Lambda + API Gateway + DynamoDB        |
| 🧩 Schema-first Logic      | Use Zod to define and validate your entities and API inputs                |
| 🚀 Rapid API Exposure      | Create endpoints with type-safe input/output and built-in rate limiting    |
| 🧠 Entity-centric Modeling | Group logic by entity (e.g. Order, User, Product) in a single-table design |
| 🔐 Built-in Protections    | Support for authorization, namespacing, and rate limiting                  |
| 🔁 Event-ready (soon)      | React to DynamoDB Streams, SQS, SNS, or cron jobs                          |

---

## 📦 Core Concepts

- **`defineModel()`** → declare your entities and how they map to a single DynamoDB table
- **`defineApi()`** → expose APIs using declarative routes with input/output validation
- **`defineRateLimit()`** → apply per-IP or per-user rate limiting powered by DynamoDB TTL

```ts
// Example route
api.POST('/orders', OrderInput, OrderOutput, async ({ input }) => {
  return await DeliverySystem.Order.put(input)
})
```

---

## 📘 Use Cases

- CRUD services with validation and authorization
- Internal backoffice APIs
- Structured data APIs for mobile/web apps
- Microservices with domain-centric logic
- Event-driven automations (coming soon)

---

## 📐 Layer Coverage

Your API is composed of three fundamental layers:

| Layer                | Role                                                                |
| -------------------- | ------------------------------------------------------------------- |
| Presentation Layer   | Defines how external clients interact via HTTP endpoints            |
| Business Logic Layer | Validates inputs, applies rules and controls the flow of operations |
| Data Storage Layer   | Handles structured reads/writes to your database (DynamoDB)         |

**serverless-api-layers** covers all three, making it a complete backend foundation.

---

## 🔭 Status

This framework is in early development, but stable for:

- Schema definition with `zod`
- API exposure with validation
- Rate limiting via DynamoDB

Event-driven capabilities and automated infrastructure generation are on the roadmap.
