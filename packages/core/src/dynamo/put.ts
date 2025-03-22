import { PutItemCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import { z } from 'zod'

const client = new DynamoDBClient({})

interface PutItemArgs<T extends z.ZodTypeAny> {
  tableName: string
  entityName: string
  entity: {
    schema: T
    keys: {
      pk: (input: z.infer<T>) => string
      sk: (input: z.infer<T>) => string
    }
    hooks?: {
      beforeCreate?: (data: z.infer<T>) => Promise<void>
    }
  }
}

export async function putItem<T extends z.ZodTypeAny>(args: PutItemArgs<T>, rawInput: unknown) {
  const { tableName, entityName, entity } = args

  // Step 1: Validate
  const parsed = entity.schema.parse(rawInput)

  // Step 2: Run hooks if any
  if (entity.hooks?.beforeCreate) {
    await entity.hooks.beforeCreate(parsed)
  }

  // Step 3: Generate keys
  const pk = entity.keys.pk(parsed)
  const sk = entity.keys.sk(parsed)

  // Step 4: Prepare item
  const item = {
    ...parsed,
    pk,
    sk,
    __type: entityName,
  }

  // Step 5: Put into DynamoDB
  const command = new PutItemCommand({
    TableName: tableName,
    Item: marshall(item),
  })

  await client.send(command)

  return item
}
