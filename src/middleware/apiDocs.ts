import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Redocのテンプレート
const redocTemplate = `
<!DOCTYPE html>
<html>
  <head>
    <title>Express TypeScript Study API - Documentation</title>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">
    <style>
      body { margin: 0; padding: 0; }
    </style>
  </head>
  <body>
    <redoc spec-url="./openapi.yaml"></redoc>
    <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
  </body>
</html>
`

export const setupApiDocs = (app: express.Express) => {
  // OpenAPI仕様書を提供
  app.get('/openapi.yaml', async (_req, res) => {
    try {
      const yamlPath = path.join(__dirname, '../../api/openapi.yaml')
      const yamlContent = await fs.readFile(yamlPath, 'utf-8')
      res.setHeader('Content-Type', 'application/x-yaml')
      res.send(yamlContent)
    } catch (error) {
      res.status(404).json({ error: 'OpenAPI specification not found' })
    }
  })

  // Redocドキュメントページを提供
  app.get('/api-docs', (_req, res) => {
    res.setHeader('Content-Type', 'text/html')
    res.send(redocTemplate)
  })

  // Swagger UI（オプション）
  app.get('/swagger', (_req, res) => {
    const swaggerTemplate = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Express TypeScript Study API - Swagger UI</title>
        <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui.css" />
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-bundle.js"></script>
        <script>
          SwaggerUIBundle({
            url: './openapi.yaml',
            dom_id: '#swagger-ui',
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIBundle.presets.standalone
            ]
          })
        </script>
      </body>
    </html>
    `
    res.setHeader('Content-Type', 'text/html')
    res.send(swaggerTemplate)
  })
}