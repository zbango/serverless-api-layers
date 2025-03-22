import { z } from 'zod'

// Define the types for the model structure
export type EntityConfig<T extends z.ZodTypeAny> = {
  schema: T
  keys: {
    pk: (input: z.infer<T>) => string
    sk: (input: z.infer<T>) => string
  }
  indexes?: Record<
    string,
    {
      gsi: string
      pk: (input: z.infer<T>) => string
      sk: (input: z.infer<T>) => string
    }
  >
}

export type ModelConfig = {
  tableName: string
  entities: Record<string, EntityConfig<any>>
}

export function defineModel(config: ModelConfig) {
  return config
}
