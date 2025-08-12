import { PrismaClient } from '@prisma/client'
import { logger } from '../utils/logger.js'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['error', 'warn'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect()
    logger.info('✅ Database connected successfully')
  } catch (error) {
    logger.error('❌ Database connection failed:', error)
    throw error
  }
}

export const disconnectDatabase = async (): Promise<void> => {
  await prisma.$disconnect()
  logger.info('Database disconnected')
}