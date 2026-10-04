import { prisma } from '@/lib/prisma/db'
import { Todo, Tag } from '@prisma/client'

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

export async function createTodo(title: string, authorId: number, tagIds?: number[]) {
  return await prisma.todo.create({
    data: {
      title,
      authorId,
      completed: false,
      tags: tagIds?.length
        ? {
            create: tagIds.map((tagId) => ({ tagId })),
          }
        : undefined,
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
    },
  })
}

export async function updateTodo(
  id: number,
  data: Partial<Pick<Todo, 'title' | 'completed'>> & { tagIds?: number[] },
  userId: number
) {
  const { tagIds, ...todoData } = data

  return await prisma.$transaction(async (tx) => {
    if (tagIds !== undefined) {
      await tx.todoTag.deleteMany({
        where: { todoId: id },
      })

      if (tagIds.length > 0) {
        await tx.todoTag.createMany({
          data: tagIds.map((tagId) => ({ todoId: id, tagId })),
        })
      }
    }

    return await tx.todo.update({
      where: {
        id,
        authorId: userId,
        deletedAt: null,
      },
      data: todoData,
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })
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
      tags: {
        include: {
          tag: true,
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
      tags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

// Tag functions
export async function getTags(userId: number): Promise<Tag[]> {
  return await prisma.tag.findMany({
    where: {
      todos: {
        some: {
          todo: {
            authorId: userId,
          },
        },
      },
    },
    orderBy: { name: 'asc' },
  })
}

export async function getAllTags(): Promise<Tag[]> {
  return await prisma.tag.findMany({
    orderBy: { name: 'asc' },
  })
}

export async function createTag(name: string, color?: string): Promise<Tag> {
  return await prisma.tag.create({
    data: {
      name: name.trim(),
      color: color || '#3B82F6',
    },
  })
}

export async function getOrCreateTags(tagNames: string[]): Promise<number[]> {
  const tagIds: number[] = []

  for (const name of tagNames) {
    const trimmedName = name.trim()
    if (!trimmedName) continue

    let tag = await prisma.tag.findUnique({
      where: { name: trimmedName },
    })

    if (!tag) {
      tag = await prisma.tag.create({
        data: { name: trimmedName },
      })
    }

    tagIds.push(tag.id)
  }

  return tagIds
}