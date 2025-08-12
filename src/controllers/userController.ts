import { type Request, type Response, type NextFunction } from 'express'
import { userService } from '../services/userService.js'

export class UserController {
  async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || 10
      
      const result = await userService.findAll(page, limit)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.findById(req.params.userId)
      res.json(user)
    } catch (error) {
      next(error)
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.create(req.body)
      res.status(201).json(user)
    } catch (error) {
      next(error)
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.update(req.params.userId, req.body)
      res.json(user)
    } catch (error) {
      next(error)
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await userService.delete(req.params.userId)
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
}

export const userController = new UserController()