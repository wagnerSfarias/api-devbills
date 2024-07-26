import express, { json } from 'express'
import 'dotenv/config'

import { setupMongo } from './database'
import { errorHandler } from './middleware/error-handler.middleware'
import { routes } from './routes'

setupMongo().then(() => {
  const app = express()
  app.use(json())
  app.use(routes)
  app.use(errorHandler)

  app.listen(3333, () => console.log('🚀 Appp is running at port 3333!'))
})
