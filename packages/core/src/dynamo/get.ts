// packages/core/src/dynamo/get.ts

import { GetItemCommand } from '@aws-sdk/client-dynamodb'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { z } from 'zod'

const client = new DynamoDBClient({})

interface GetItemArgs<T extends z.ZodTypeAny> {
  tableName: string
  entityName: string
  entity: {
    schema: T
    keys: {
      pk: (input: Partial<z.infer<T>>) => string
      sk: (input: Partial<z.infer<T>>) => string
    }
  }
  key: Partial<z.infer<T>>
}

export async function getItem<T extends z.ZodTypeAny>(args: GetItemArgs<T>) {
  const { tableName, entityName, entity, key } = args

  const pk = entity.keys.pk(key)
  const sk = entity.keys.sk(key)

  const command = new GetItemCommand({
    TableName: tableName,
    Key: {
      pk: { S: pk },
      sk: { S: sk },
    },
  })

  const result = await client.send(command)

  if (!result.Item) return null

  const item = unmarshall(result.Item)

  if (item.__type !== entityName) return null

  return entity.schema.parse(item)
}
