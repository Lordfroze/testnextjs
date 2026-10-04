'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Tag {
  id: number
  name: string
  color: string
}

interface Todo {
  id: number
  title: string
  completed: boolean
  authorId: number
  deletedAt: Date | null
  createdAt: Date
  updatedAt: Date
  author?: {
    id: number
    username: string
  }
  tags?: Array<{
    tag: Tag
  }>
}

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [newTodoTags, setNewTodoTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [showTagSuggestions, setShowTagSuggestions] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [addingUser, setAddingUser] = useState(false)
  const [userRole, setUserRole] = useState<string>('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchTodos()
    fetchTags()
    fetchUserRole()
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos')
      if (response.ok) {
        const data = await response.json()
        setTodos(data)
      } else if (response.status === 401) {
        router.push('/login')
      } else {
        setError('Gagal memuat todo')
      }
    } catch {
      setError('Terjadi kesalahan saat memuat todo')
    } finally {
      setLoading(false)
    }
  }

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/tags')
      if (response.ok) {
        const data = await response.json()
        setAvailableTags(data)
      }
    } catch {
      // Ignore error
    }
  }

  const fetchUserRole = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUserRole(data.role || '')
      }
    } catch {
      // Ignore error, role will be empty
    }
  }

  const navigateToAdminUsers = () => {
    router.push('/admin/users')
  }

  const addTagToNewTodo = (tagName: string) => {
    const trimmed = tagName.trim()
    if (trimmed && !newTodoTags.includes(trimmed)) {
      setNewTodoTags([...newTodoTags, trimmed])
      setTagInput('')
      setShowTagSuggestions(false)
    }
  }

  const removeTagFromNewTodo = (tagName: string) => {
    setNewTodoTags(newTodoTags.filter((t) => t !== tagName))
  }

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTagToNewTodo(tagInput)
    } else if (e.key === 'Backspace' && !tagInput && newTodoTags.length > 0) {
      removeTagFromNewTodo(newTodoTags[newTodoTags.length - 1])
    }
  }

  const filteredTagSuggestions = availableTags
    .filter((tag) => 
      tag.name.toLowerCase().includes(tagInput.toLowerCase()) &&
      !newTodoTags.includes(tag.name)
    )
    .slice(0, 5)

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodo.trim(), tagNames: newTodoTags }),
      })

      if (response.ok) {
        const todo = await response.json()
        setTodos([todo, ...todos])
        setNewTodo('')
        setNewTodoTags([])
      } else {
        setError('Gagal menambahkan todo')
      }
    } catch {
      setError('Terjadi kesalahan saat menambahkan todo')
    }
  }

  const toggleTodo = async (id: number, completed: boolean) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed }),
      })

      if (response.ok) {
        const updatedTodo = await response.json()
        setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)))
      }
    } catch {
      setError('Gagal memperbarui todo')
    }
  }

  const updateTodoTitle = async (id: number, title: string, tagNames?: string[]) => {
    if (!title.trim()) return

    try {
      const body: Record<string, unknown> = { title: title.trim() }
      if (tagNames !== undefined) {
        body.tagNames = tagNames
      }
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        const updatedTodo = await response.json()
        setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)))
      }
    } catch {
      setError('Gagal memperbarui todo')
    }
  }

  const deleteTodo = async (id: number) => {
    if (!confirm('Yakin ingin menghapus todo ini?')) return

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setTodos(todos.filter((todo) => todo.id !== id))
      } else {
        setError('Gagal menghapus todo')
      }
    } catch {
      setError('Terjadi kesalahan saat menghapus todo')
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
      router.refresh()
    } catch {
      setError('Gagal logout')
    }
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUsername.trim() || !newPassword.trim()) return

    setAddingUser(true)
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername.trim(), password: newPassword }),
      })

      if (response.ok) {
        setShowAddUserModal(false)
        setNewUsername('')
        setNewPassword('')
        setError('User berhasil ditambahkan')
      } else {
        const data = await response.json()
        setError(data.error || 'Gagal menambahkan user')
      }
    } catch {
      setError('Terjadi kesalahan saat menambahkan user')
    } finally {
      setAddingUser(false)
    }
  }

  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen)
  }

  const closeSettings = () => {
    setSettingsOpen(false)
  }

  const closeSearch = () => {
    setIsSearchOpen(false)
    setSearchQuery('')
  }

  // Filter todos based on search query
  const filteredTodos = todos.filter((todo) => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    const titleMatch = todo.title.toLowerCase().includes(query)
    const tagMatch = todo.tags?.some((t) => t.tag.name.toLowerCase().includes(query))
    const authorMatch = todo.author?.username.toLowerCase().includes(query)
    return titleMatch || tagMatch || authorMatch
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <div className="absolute inset-0 w-12 h-12 border-4 border-purple-500 border-b-transparent rounded-full animate-spin reverse" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Subtle background gradient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-30" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/10 dark:to-purple-900/10 rounded-full blur-3xl opacity-10" />
      </div>

      {/* Header */}
      <header className="relative z-50 sticky top-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <span className="text-white text-xl font-bold">✓</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              TodoList
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-gray-500 dark:text-gray-400 font-medium">
              {todos.length} todo{todos.length !== 1 ? 's' : ''}
            </span>

            {/* Search */}
            <div className="relative">
              {!isSearchOpen ? (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 transition-all duration-200"
                  aria-label="Cari todo"
                  aria-expanded="false"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari todo, tag, atau author..."
                    className="px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-200 shadow-sm"
                    autoFocus
                    aria-label="Cari todo"
                  />
                  <button
                    onClick={closeSearch}
                    className="p-2.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 transition-all duration-200"
                    aria-label="Tutup pencarian"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Settings Dropdown - Only for Admins */}
            {userRole === 'ADMIN' && (
              <div className="relative">
                <button
                  onClick={toggleSettings}
                  className="p-2.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 transition-all duration-200"
                  aria-label="Pengaturan"
                  aria-expanded={settingsOpen}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>

                {/* Settings Dropdown Menu */}
                {settingsOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 py-1.5 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
                    <button
                      onClick={() => {
                        setShowAddUserModal(true)
                        closeSettings()
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      Tambah User
                    </button>
                    <hr className="my-1.5 border-gray-200 dark:border-gray-800" />
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Click outside to close */}
            {settingsOpen && (
              <div
                className="fixed inset-0 z-40"
                onClick={closeSettings}
                aria-hidden="true"
              />
            )}

            {/* Admin Users navigation for admins */}
            {userRole === 'ADMIN' && (
              <button
                onClick={navigateToAdminUsers}
                className="hidden sm:block px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Manajemen Pengguna
              </button>
            )}
            
            {/* Logout button for non-admin users */}
            {userRole !== 'ADMIN' && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 transition-all duration-200"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Search Results Info Bar */}
      {searchQuery && (
        <div className="relative z-10 max-w-3xl mx-auto px-4 py-3 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Ditemukan <span className="font-semibold text-gray-900 dark:text-white">{filteredTodos.length}</span> dari <span className="font-semibold text-gray-900 dark:text-white">{todos.length}</span> todo
            </span>
            <button
              onClick={closeSearch}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline text-sm font-medium transition-colors"
            >
              Hapus pencarian
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8 pb-16">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl flex items-center justify-between animate-in slide-in-from-top-2 fade-in duration-200" role="alert">
            <span>{error}</span>
            <button
              onClick={() => setError('')}
              className="text-red-500 hover:text-red-700 dark:hover:text-red-300 font-bold text-lg leading-none transition-colors"
            >
              ×
            </button>
          </div>
        )}

        {/* Add Todo Form */}
        <form onSubmit={addTodo} className="mb-8 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="Tambah todo baru..."
                  className="w-full px-5 py-4 pr-12 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-200 shadow-sm"
                  aria-label="Todo baru"
                />
              </div>
              <button
                type="submit"
                disabled={!newTodo.trim()}
                className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 transition-all duration-200 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                aria-label="Tambah todo"
              >
                Tambah
              </button>
            </div>
            
            {/* Tag Input */}
            <div className="mt-4 relative">
              <div className="flex flex-wrap gap-2 mb-2">
                {newTodoTags.map((tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full border border-blue-100 dark:border-blue-900/30 animate-in zoom-in-95 fade-in duration-150"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTagFromNewTodo(tag)}
                      className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-200 leading-none p-0.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                      aria-label={`Hapus tag ${tag}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
                <div className="relative">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => {
                      setTagInput(e.target.value)
                      setShowTagSuggestions(true)
                    }}
                    onFocus={() => setShowTagSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowTagSuggestions(false), 200)}
                    onKeyDown={handleTagInputKeyDown}
                    placeholder="Tambah tag (Enter/koma)..."
                    className="px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-52 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-200 shadow-sm"
                    aria-label="Input tag"
                  />
                  {showTagSuggestions && filteredTagSuggestions.length > 0 && (
                    <div className="absolute z-10 mt-2 w-52 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
                      {filteredTagSuggestions.map((tag) => (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => addTagToNewTodo(tag.name)}
                          className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors"
                        >
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: tag.color }}
                          />
                          #{tag.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Todo List */}
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-16 animate-in fade-in duration-300">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl flex items-center justify-center mb-6">
                <svg
                  className="w-10 h-10 text-blue-500 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {searchQuery ? 'Tidak ada todo yang cocok' : 'Belum ada todo'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchQuery
                  ? 'Coba kata kunci lain atau hapus pencarian'
                  : 'Mulai dengan menambahkan todo baru di atas'}
              </p>
              {searchQuery && (
                <button
                  onClick={closeSearch}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Hapus pencarian
                </button>
              )}
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onUpdateTitle={updateTodoTitle}
                onDelete={deleteTodo}
                availableTags={availableTags}
              />
            ))
          )}
        </div>
      </main>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200">
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowAddUserModal(false)}
              aria-hidden="true"
            />
            
            <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 animate-in zoom-in-95 fade-in duration-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tambah User Baru</h2>
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
                  aria-label="Tutup"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleAddUser} className="p-6 space-y-5">
                <div>
                  <label htmlFor="newUsername" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Username
                  </label>
                  <input
                    id="newUsername"
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Masukkan username (min. 3 karakter)"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-200 shadow-sm"
                    required
                    minLength={3}
                    autoFocus
                  />
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Masukkan password (min. 6 karakter)"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-200 shadow-sm"
                    required
                    minLength={6}
                  />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddUserModal(false)}
                    className="flex-1 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 transition-all duration-200"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={addingUser}
                    className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 transition-all duration-200 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    {addingUser ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Menambah...
                      </span>
                    ) : (
                      'Tambah User'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Todo Item Component
interface TodoItemProps {
  todo: Todo
  onToggle: (id: number, completed: boolean) => void
  onUpdateTitle: (id: number, title: string, tagNames?: string[]) => void
  onDelete: (id: number) => void
  availableTags: Tag[]
}

function TodoItem({ todo, onToggle, onUpdateTitle, onDelete, availableTags }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editTags, setEditTags] = useState<string[]>(todo.tags?.map((t) => t.tag.name) || [])
  const [editTagInput, setEditTagInput] = useState('')
  const [showEditTagSuggestions, setShowEditTagSuggestions] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdateTitle(todo.id, editTitle, editTags)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditTitle(todo.title)
    setEditTags(todo.tags?.map((t) => t.tag.name) || [])
    setIsEditing(false)
  }

  const addTagToEdit = (tagName: string) => {
    const trimmed = tagName.trim()
    if (trimmed && !editTags.includes(trimmed)) {
      setEditTags([...editTags, trimmed])
      setEditTagInput('')
      setShowEditTagSuggestions(false)
    }
  }

  const removeTagFromEdit = (tagName: string) => {
    setEditTags(editTags.filter((t) => t !== tagName))
  }

  const handleEditTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTagToEdit(editTagInput)
    } else if (e.key === 'Backspace' && !editTagInput && editTags.length > 0) {
      removeTagFromEdit(editTags[editTags.length - 1])
    }
  }

  const filteredEditTagSuggestions = availableTags
    .filter((tag) => 
      tag.name.toLowerCase().includes(editTagInput.toLowerCase()) &&
      !editTags.includes(tag.name)
    )
    .slice(0, 5)

  const authorName = todo.author?.username || 'Unknown'

  return (
    <div
      className={`group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 ${
        todo.completed ? 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800' : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
      }`}
    >
      {/* Checkbox */}
      <div className="absolute left-4 top-4">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id, todo.completed)}
          className="h-5 w-5 appearance-none rounded border-2 border-gray-300 dark:border-gray-600 checked:bg-gradient-to-br checked:from-blue-500 checked:to-purple-600 checked:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200 cursor-pointer"
          aria-label={todo.completed ? 'Tandai belum selesai' : 'Tandai selesai'}
        />
      </div>

      {isEditing ? (
        <div className="ml-12 w-full">
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-200 shadow-sm"
              autoFocus
            />
            
            {/* Tag editing */}
            <div className="relative">
              <div className="flex flex-wrap gap-2 mb-2">
                {editTags.map((tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full border border-blue-100 dark:border-blue-900/30 animate-in zoom-in-95 fade-in duration-150"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTagFromEdit(tag)}
                      className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-200 leading-none p-0.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                      aria-label={`Hapus tag ${tag}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
                <div className="relative">
                  <input
                    type="text"
                    value={editTagInput}
                    onChange={(e) => {
                      setEditTagInput(e.target.value)
                      setShowEditTagSuggestions(true)
                    }}
                    onFocus={() => setShowEditTagSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowEditTagSuggestions(false), 200)}
                    onKeyDown={handleEditTagInputKeyDown}
                    placeholder="Tambah tag..."
                    className="px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-52 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-200 shadow-sm"
                    aria-label="Input tag"
                  />
                  {showEditTagSuggestions && filteredEditTagSuggestions.length > 0 && (
                    <div className="absolute z-10 mt-2 w-52 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
                      {filteredEditTagSuggestions.map((tag) => (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => addTagToEdit(tag.name)}
                          className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors"
                        >
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: tag.color }}
                          />
                          #{tag.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 transition-all duration-200 shadow-lg shadow-blue-500/25"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950 transition-all duration-200"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="ml-12 flex-1 min-w-0 flex flex-col justify-between">
          <span
            className={`block cursor-pointer ${
              todo.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'
            }`}
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>

          {/* Bottom meta row with tags on left, author/date/actions on right */}
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            {/* Display tags on the left */}
            {todo.tags && todo.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mr-auto">
                {todo.tags.map((t) => (
                  <span
                    key={t.tag.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full transition-all duration-200"
                    style={{ 
                      backgroundColor: `${t.tag.color}15`,
                      color: t.tag.color,
                      border: `1px solid ${t.tag.color}30`
                    }}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.tag.color }} />
                    #{t.tag.name}
                  </span>
                ))}
              </div>
            )}

            <span className="text-xs text-gray-500 dark:text-gray-400 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-xl font-medium">
              {authorName}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">
              {new Date(todo.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
            <button
              onClick={() => setIsEditing(true)}
              className="p-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200"
              aria-label="Edit todo"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              disabled={isDeleting}
              className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 disabled:opacity-50"
              aria-label="Hapus todo"
            >
              {isDeleting ? (
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}