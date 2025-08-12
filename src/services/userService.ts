import { prisma } from '../db/client.js'
import { AppError } from '../middleware/errorHandler.js'
import bcrypt from 'bcrypt'

export interface CreateUserDto {
  email: string
  name: string
  password: string
  bio?: string
}

export interface UpdateUserDto {
  name?: string
  bio?: string
}

export interface UserResponse {
  id: string
  email: string
  name: string
  bio: string | null
  createdAt: Date
  updatedAt: Date
}

export class UserService {
  async findAll(page: number = 1, limit: number = 10): Promise<{
    users: UserResponse[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }> {
    const skip = (page - 1) * limit
    
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          bio: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ])

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  async findById(id: string): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      throw new AppError(404, 'User not found')
    }

    return user
  }

  async create(data: CreateUserDto): Promise<UserResponse> {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      throw new AppError(409, 'User with this email already exists')
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return user
  }

  async update(id: string, data: UpdateUserDto): Promise<UserResponse> {
    const existingUser = await prisma.user.findUnique({
      where: { id },
    })

    if (!existingUser) {
      throw new AppError(404, 'User not found')
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return user
  }

  async delete(id: string): Promise<void> {
    const existingUser = await prisma.user.findUnique({
      where: { id },
    })

    if (!existingUser) {
      throw new AppError(404, 'User not found')
    }

    await prisma.user.delete({
      where: { id },
    })
  }
}

export const userService = new UserService()