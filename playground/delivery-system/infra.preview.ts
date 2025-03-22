import { z } from 'zod'
import { defineModel } from '../../packages/core/src/defineModel'
import { generateInfrastructure } from '../../packages/core/src/generateInfrastructure'
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const model = defineModel({
  tableName: 'delivery-system-table',
  entities: {
    Order: {
      schema: z.object({
        orderId: z.string(),
        customerId: z.string(),
        status: z.string(),
      }),
      keys: {
        pk: (o) => `ORDER#${o.orderId}`,
        sk: (o) => `STATUS#${o.status}`,
      },
    },
    User: {
      schema: z.object({
        userId: z.string(),
        email: z.string().email(),
      }),
      keys: {
        pk: (u) => `USER#${u.userId}`,
        sk: (u) => `PROFILE#${u.userId}`,
      },
    },
  },
})

const yamlOutput = generateInfrastructure([
  {
    tableName: 'delivery-system-table',
    entities: {
      Order: model.Order,
      User: model.User,
    },
  },
])

const outputPath = join(__dirname, 'serverless.generated.yml')
writeFileSync(outputPath, yamlOutput)

console.log(`✅ serverless.generated.yml written to: ${outputPath}`)
