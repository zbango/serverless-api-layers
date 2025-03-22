import { z } from 'zod'
import { putItem } from './dynamo'
import { getItem } from './dynamo/get'

export type EntityHooks<T> = {
  beforeCreate?: (data: T) => Promise<void>
  afterDelete?: (id: string) => Promise<void>
}

export type EntityMethods<T> = Record<string, (...args: any[]) => Promise<any>>

export type EntityConfig<T extends z.ZodTypeAny> = {
  schema: T
  keys: {
    pk: (input: z.infer<T>) => string
    sk: (input: z.infer<T>) => string
  }
  methods?: EntityMethods<z.infer<T>>
  hooks?: EntityHooks<z.infer<T>>
}

export type ModelConfig = {
  tableName: string
  entities: Record<string, EntityConfig<any>>
}

export function defineModel(config: ModelConfig) {
  const output: Record<string, any> = {}

  for (const [name, entity] of Object.entries(config.entities)) {
    const entityApi = {
      schema: entity.schema,
      put: (input: any) =>
        putItem(
          {
            tableName: config.tableName,
            entityName: name,
            entity,
          },
          input,
        ),
      get: (key: any) =>
        getItem({
          tableName: config.tableName,
          entityName: name,
          entity,
          key,
        }),
      ...(entity.methods || {}),
    }

    output[name] = entityApi
  }

  return output
}
