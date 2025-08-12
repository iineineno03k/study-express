import { Router } from 'express'
import { userRouter } from './userRoutes.js'
import { env } from '../config/env.js'

export const apiRouter = Router()

apiRouter.use(env.API_PREFIX, userRouter)