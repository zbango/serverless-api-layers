import { describe, it, expect, vi, beforeEach } from 'vitest'
import { z } from 'zod'
import { getItem } from 'src/dynamo/get'

vi.mock('@aws-sdk/client-dynamodb', async () => {
  const actual = await vi.importActual<any>('@aws-sdk/client-dynamodb')
  return {
    ...actual,
    DynamoDBClient: vi.fn().mockImplementation(() => ({
      send: vi.fn().mockResolvedValue({
        Item: {
          pk: { S: 'USER#abc123' },
          sk: { S: 'PROFILE#abc123' },
          userId: { S: 'abc123' },
          email: { S: 'test@example.com' },
          __type: { S: 'User' },
        },
      }),
    })),
  }
})

describe('getItem', () => {
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
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch, validate, and return parsed item', async () => {
    const result = await getItem({
      tableName: 'test-table',
      entityName: 'User',
      entity,
      key: { userId: 'abc123' },
    })

    expect(result).toEqual({
      userId: 'abc123',
      email: 'test@example.com',
    })
  })
})
