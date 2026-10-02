import { prisma } from '@/lib/prisma/db'
import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'

const secretKey = process.env.JWT_SECRET!
const key = new TextEncoder().encode(secretKey)

export interface AuthUser {
  id: number
  username: string
  role: string
}

export async function authenticateUser(
  username: string,
  password: string
): Promise<AuthUser | null> {
  const user = await prisma.user.findUnique({
    where: { username },
  })

  if (!user) return null

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) return null

  return { id: user.id, username: user.username, role: user.role }
}

export async function createUser(
  username: string,
  password: string,
  role: string = 'USER'
): Promise<AuthUser> {
  const hashedPassword = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      role,
    },
  })

  return { id: user.id, username: user.username, role: user.role }
}

export async function generateToken(user: AuthUser): Promise<string> {
  return await new SignJWT({ userId: user.id, username: user.username, role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key)
}

export async function verifyToken(token: string): Promise<{ userId: number; username: string; role: string } | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    })
    return {
      userId: payload.userId as number,
      username: payload.username as string,
      role: payload.role as string,
    }
  } catch {
    return null
  }
}