import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create test user
  const hashedPassword = await bcrypt.hash('admin123', 12)

  const user = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('✅ Created user:', user.username)

  // Create sample todos
  const todos = [
    { title: 'Belajar Next.js App Router', completed: true },
    { title: 'Setup Prisma ORM dengan PostgreSQL', completed: true },
    { title: 'Implementasi JWT Authentication', completed: false },
    { title: 'Buat CRUD Todo dengan Soft Delete', completed: false },
    { title: 'Styling dengan Tailwind CSS', completed: false },
  ]

  for (const todo of todos) {
    await prisma.todo.create({
      data: {
        ...todo,
        authorId: user.id,
      },
    })
  }

  console.log('✅ Created sample todos')
  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })