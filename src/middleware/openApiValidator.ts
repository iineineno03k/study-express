import OpenApiValidator from 'express-openapi-validator'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const openApiValidator = OpenApiValidator.middleware({
  apiSpec: path.join(__dirname, '../../api/openapi.yaml'),
  validateRequests: true,
  validateResponses: true,
  validateApiSpec: true,
  validateFormats: 'full',
})