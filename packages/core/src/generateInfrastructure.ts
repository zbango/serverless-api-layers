import type { ModelConfig } from './defineModel'
import yaml from 'js-yaml'

const METHOD_PERMISSIONS = {
  put: 'dynamodb:PutItem',
  get: 'dynamodb:GetItem',
  delete: 'dynamodb:DeleteItem',
  query: 'dynamodb:Query',
  scan: 'dynamodb:Scan',
}

export function generateInfrastructure(models: ModelConfig[]) {
  const resources: any = {}
  const iamStatements: any[] = []

  for (const model of models) {
    const tableName = model.tableName

    // Register table resource if not already defined
    if (!resources[tableName]) {
      resources[tableName] = {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: tableName,
          AttributeDefinitions: [
            { AttributeName: 'pk', AttributeType: 'S' },
            { AttributeName: 'sk', AttributeType: 'S' },
          ],
          KeySchema: [
            { AttributeName: 'pk', KeyType: 'HASH' },
            { AttributeName: 'sk', KeyType: 'RANGE' },
          ],
          BillingMode: 'PAY_PER_REQUEST',
        },
      }
    }

    // Collect IAM permissions from used methods
    for (const entity of Object.values(model.entities)) {
      const methods = Object.keys(entity.methods ?? {})

      if ('put' in entity) methods.push('put')
      if ('get' in entity) methods.push('get')

      const unique = new Set(methods)
      for (const method of unique) {
        const action = METHOD_PERMISSIONS[method as keyof typeof METHOD_PERMISSIONS]
        if (action) {
          iamStatements.push({
            Effect: 'Allow',
            Action: action,
            Resource: { 'Fn::GetAtt': [tableName, 'Arn'] },
          })
        }
      }
    }
  }

  const serverlessYml = {
    service: 'serverless-api-layers',
    provider: {
      name: 'aws',
      runtime: 'nodejs18.x',
      iamRoleStatements: iamStatements,
    },
    resources: {
      Resources: resources,
    },
  }

  return yaml.dump(serverlessYml, { noRefs: true })
}
