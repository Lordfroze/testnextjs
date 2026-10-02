import { prisma } from '@/lib/prisma/db'
import { Todo } from '@prisma/client'

export async function getTodos(userId: number): Promise<Todo[]> {
  return await prisma.todo.findMany({
    where: {
      authorId: userId,
      deletedAt: null,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getTodoById(id: number, userId: number): Promise<Todo | null> {
  return await prisma.todo.findFirst({
    where: {
      id,
      authorId: userId,
      deletedAt: null,
    },
  })
}

export async function createTodo(title: string, authorId: number) {
  return await prisma.todo.create({
    data: {
      title,
      authorId,
      completed: false,
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  })
}

export async function updateTodo(
  id: number,
  data: Partial<Pick<Todo, 'title' | 'completed'>>,
  userId: number
) {
  return await prisma.todo.update({
    where: {
      id,
      authorId: userId,
      deletedAt: null,
    },
    data,
    include: {
      author: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  })
}

export async function deleteTodo(id: number, userId: number): Promise<Todo> {
  return await prisma.todo.update({
    where: {
      id,
      authorId: userId,
    },
    data: {
      deletedAt: new Date(),
    },
  })
}

export async function getTodoWithAuthor(id: number, userId: number) {
  return await prisma.todo.findFirst({
    where: {
      id,
      authorId: userId,
      deletedAt: null,
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  })
}

export async function getTodosWithAuthor(userId: number) {
  return await prisma.todo.findMany({
    where: {
      authorId: userId,
      deletedAt: null,
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}