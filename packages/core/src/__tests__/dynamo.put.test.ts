import { describe, it, expect, vi, beforeEach } from 'vitest'
import { z } from 'zod'
import { putItem } from '../dynamo'

vi.mock('@aws-sdk/client-dynamodb', async () => {
  const actual = await vi.importActual<any>('@aws-sdk/client-dynamodb')
  return {
    ...actual,
    DynamoDBClient: vi.fn().mockImplementation(() => ({
      send: vi.fn().mockResolvedValue({}),
    })),
  }
})

const schema = z.object({
  userId: z.string(),
  email: z.string().email(),
})

const entity = {
  schema,
  keys: {
    pk: (u: any) => `USER#${u.userId}`,
    sk: (u: any) => `PROFILE#${u.userId}`,
  },
  hooks: {
    beforeCreate: vi.fn(),
  },
}

describe('putItem', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should validate input, run hooks, and send to DynamoDB', async () => {
    const input = {
      userId: 'abc123',
      email: 'test@example.com',
    }

    const result = await putItem(
      {
        tableName: 'test-table',
        entityName: 'User',
        entity,
      },
      input,
    )

    expect(entity.hooks!.beforeCreate).toHaveBeenCalledWith(input)
    expect(result).toMatchObject({
      pk: 'USER#abc123',
      sk: 'PROFILE#abc123',
      __type: 'User',
    })
  })
})
