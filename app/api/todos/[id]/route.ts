import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { getTodoById, getTodoWithAuthor, updateTodo, deleteTodo } from '@/lib/todos'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const todoId = parseInt(id)

    if (isNaN(todoId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const todo = await getTodoWithAuthor(todoId, parseInt(session.userId))

    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
    }

    return NextResponse.json(todo)
  } catch (error) {
    console.error('Get todo error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const todoId = parseInt(id)

    if (isNaN(todoId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const { title, completed } = await request.json()

    const todo = await getTodoById(todoId, parseInt(session.userId))

    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
    }

    const updatedTodo = await updateTodo(
      todoId,
      {
        ...(title !== undefined && { title: title.trim() }),
        ...(completed !== undefined && { completed }),
      },
      parseInt(session.userId)
    )

    return NextResponse.json(updatedTodo)
  } catch (error) {
    console.error('Update todo error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const todoId = parseInt(id)

    if (isNaN(todoId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const todo = await getTodoById(todoId, parseInt(session.userId))

    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
    }

    await deleteTodo(todoId, parseInt(session.userId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete todo error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}