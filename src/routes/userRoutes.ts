import { Router } from 'express'
import { userController } from '../controllers/userController.js'

export const userRouter = Router()

userRouter.get('/users', userController.getUsers.bind(userController))
userRouter.post('/users', userController.createUser.bind(userController))
userRouter.get('/users/:userId', userController.getUserById.bind(userController))
userRouter.put('/users/:userId', userController.updateUser.bind(userController))
userRouter.delete('/users/:userId', userController.deleteUser.bind(userController))