import { defineModel } from 'src/defineModel'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { z } from 'zod'

vi.mock('@aws-sdk/client-dynamodb', async () => {
  const actual = await vi.importActual<any>('@aws-sdk/client-dynamodb')

  // Create mock implementation inside the mock function
  const mockSend = vi.fn().mockImplementation((command) => {
    // For GetItemCommand
    if (command.constructor.name === 'GetItemCommand') {
      return Promise.resolve({
        Item: {
          pk: { S: 'USER#456' },
          sk: { S: 'PROFILE#456' },
          userId: { S: '456' },
          email: { S: 'john@example.com' },
          __type: { S: 'User' },
        },
      })
    }
    // For PutItemCommand
    return Promise.resolve({})
  })

  return {
    ...actual,
    DynamoDBClient: vi.fn().mockImplementation(() => ({
      send: mockSend,
    })),
  }
})

describe('defineModel', () => {
  const model = defineModel({
    tableName: 'example-table',
    entities: {
      User: {
        schema: z.object({
          userId: z.string(),
          email: z.string().email(),
        }),
        keys: {
          pk: (u) => `USER#${u.userId}`,
          sk: (u) => `PROFILE#${u.userId}`,
        },
        hooks: {
          beforeCreate: vi.fn(),
        },
      },
    },
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should insert a new User entity using put()', async () => {
    const result = await model.User.put({
      userId: '123',
      email: 'me@example.com',
    })

    expect(result).toMatchObject({
      pk: 'USER#123',
      sk: 'PROFILE#123',
      __type: 'User',
    })
  })

  it('should retrieve a User entity using get()', async () => {
    const result = await model.User.get({ userId: '456' })

    expect(result).toEqual({
      userId: '456',
      email: 'john@example.com',
    })
  })
})
