'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Icons } from './icons'
import { features } from './data'
import { FeatureCard } from './feature-card'
import { PricingSection } from './pricing-section'
import { TestimonialsSection } from './testimonials-section'
import { CTASection } from './cta-section'
import { Footer } from './footer'

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    document.documentElement.classList.toggle('dark', newMode)
    localStorage.setItem('darkMode', String(newMode))
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">✓</span>
            </div>
            <span>TodoList</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Fitur</Link>
            <Link href="#pricing" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Harga</Link>
            <Link href="#testimonials" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Testimoni</Link>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={darkMode ? 'Light mode' : 'Dark mode'}
            >
              {darkMode ? '☀' : '🌙'}
            </button>
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">Masuk</Link>
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Daftar</Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? '✕' : '≡'}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col gap-4">
              <Link href="#features" className="text-sm font-medium text-gray-600 dark:text-gray-300" onClick={() => setMobileMenuOpen(false)}>Fitur</Link>
              <Link href="#pricing" className="text-sm font-medium text-gray-600 dark:text-gray-300" onClick={() => setMobileMenuOpen(false)}>Harga</Link>
              <Link href="#testimonials" className="text-sm font-medium text-gray-600 dark:text-gray-300" onClick={() => setMobileMenuOpen(false)}>Testimoni</Link>
              <div className="flex items-center gap-4 pt-2">
                <button onClick={toggleDarkMode} className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                  {darkMode ? '☀' : '🌙'} {darkMode ? 'Terang' : 'Gelap'}
                </button>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <Link href="/login" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg text-center" onClick={() => setMobileMenuOpen(false)}>Masuk</Link>
                <Link href="/login" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-lg text-center" onClick={() => setMobileMenuOpen(false)}>Daftar</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span>Versi 2.0 Dirilis — Lebih cepat, lebih cerdas</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            Kelola Tugas dengan{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Tenang & Teratur
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Aplikasi manajemen tugas modern yang dirancang untuk membantu Anda dan tim
            fokus pada yang penting. Bebas gangguan, cepat, dan aman.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Mulai Gratis Sekarang →
            </Link>
            <Link
              href="#features"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200"
            >
              Lihat Fitur
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              ★ ★ ★ ★ ★
              <span className="ml-2 font-medium text-gray-700 dark:text-gray-200">4.9/5</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <span className="w-6 h-px bg-gray-300 dark:bg-gray-600" />
            </div>
            <span>10.000+ pengguna aktif</span>
            <span className="w-6 h-px bg-gray-300 dark:bg-gray-600" />
            <span>99.9% uptime</span>
            <span className="w-6 h-px bg-gray-300 dark:bg-gray-600" />
            <span>SOC2 Type II</span>
          </div>
        </div>

        <div className="mt-20 relative">
          <div className="relative max-w-5xl mx-auto">
            <div className="relative aspect-[16/10] rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden shadow-2xl">
              <div className="absolute inset-0 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 font-mono">todolist.app/dashboard</div>
                </div>

                <div className="flex gap-6 h-[300px]">
                  <div className="w-48 flex-shrink-0 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                    <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">PROYEK</div>
                    <div className="space-y-2">
                      {['Pribadi', 'Kerja', 'Belanja', 'Ide'].map((proj, i) => (
                        <div
                          key={proj}
                          className={`px-3 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                            i === 0
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                        >
                          {proj}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pribadi</h3>
                      <button className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">+ Tambah</button>
                    </div>
                    <div className="space-y-3">
                      {[
                        { title: 'Selesaikan proposal proyek', completed: true, tag: 'Urgent', tagColor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
                        { title: 'Review pull request #247', completed: false, tag: 'Review', tagColor: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' },
                        { title: 'Beli domain untuk side project', completed: false, tag: 'Pribadi', tagColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
                        { title: 'Jadwal meeting tim mingguan', completed: false, tag: 'Meeting', tagColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
                        { title: 'Backup database produksi', completed: true, tag: 'Ops', tagColor: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
                      ].map((todo, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                            todo.completed ? 'bg-gray-50 dark:bg-gray-800/50' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                            todo.completed ? 'bg-blue-600 border-blue-600' : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {todo.completed && <span className="text-white text-sm font-bold">✓</span>}
                          </div>
                          <span className={`flex-1 text-sm ${
                            todo.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'
                          }`}>
                            {todo.title}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${todo.tagColor}`}>
                            {todo.tag}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-3xl opacity-50" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-100 dark:bg-purple-900/30 rounded-full blur-3xl opacity-50" />
          </div>
        </div>
      </div>
    </section>
  )
}