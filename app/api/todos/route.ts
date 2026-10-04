import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getTodosWithAuthor, createTodo } from '@/lib/todos'

export async function GET() {
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const todos = await getTodosWithAuthor(session.id)
    return NextResponse.json(todos)
  } catch (error) {
    console.error('Get todos error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { title } = await request.json()

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const todo = await createTodo(title.trim(), session.id)
    return NextResponse.json(todo, { status: 201 })
  } catch (error) {
    console.error('Create todo error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}