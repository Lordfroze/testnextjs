import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    default: 'TodoList — Kelola Tugas dengan Tenang & Teratur',
    template: '%s | TodoList',
  },
  description: 'Aplikasi manajemen tugas modern untuk individu dan tim. Fitur lengkap: tag, deadline, kolaborasi, notifikasi real-time, dan keamanan enterprise. Mulai gratis sekarang.',
  keywords: ['todo', 'task management', 'productivity', 'team collaboration', 'project management', 'SaaS'],
  authors: [{ name: 'TodoList Team' }],
  creator: 'TodoList',
  publisher: 'TodoList',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://todolist.app',
    title: 'TodoList — Kelola Tugas dengan Tenang & Teratur',
    description: 'Aplikasi manajemen tugas modern untuk individu dan tim. Mulai gratis sekarang.',
    siteName: 'TodoList',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TodoList Dashboard Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TodoList — Kelola Tugas dengan Tenang & Teratur',
    description: 'Aplikasi manajemen tugas modern untuk individu dan tim. Mulai gratis sekarang.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#030712' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme on load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('darkMode');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var isDark = theme === 'true' || (theme === null && prefersDark);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white`}>
        {children}
      </body>
    </html>
  )
}