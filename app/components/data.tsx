import { Icons } from './icons'

export const features = [
  {
    icon: Icons.Sparkles,
    title: 'Manajemen Tugas Intuitif',
    description: 'Buat, atur, dan lacak todo dengan antarmuka yang bersih dan bebas gangguan. Fokus pada yang penting.',
  },
  {
    icon: Icons.Zap,
    title: 'Cepat & Ringan',
    description: 'Dibangun dengan Next.js 14 dan React 18. Loading instan, transisi halus, performa optimal di semua perangkat.',
  },
  {
    icon: Icons.Shield,
    title: 'Keamanan Enterprise',
    description: 'Autentikasi JWT, enkripsi password bcrypt, dan proteksi route berbasis role. Data Anda aman.',
  },
  {
    icon: Icons.Users,
    title: 'Kolaborasi Tim',
    description: 'Bagikan proyek, assign tugas, dan lacak kemajuan tim. Cocok untuk personal maupun tim kecil.',
  },
  {
    icon: Icons.Calendar,
    title: 'Jadwal & Deadline',
    description: 'Set tanggal jatuh tempo, pengingat, dan lihat ringkasan mingguan. Tidak pernah melewatkan deadline.',
  },
  {
    icon: Icons.Tag,
    title: 'Tags & Filter Cerdas',
    description: 'Kategorikan dengan tag warna, filter by status/prioritas/author, dan temukan tugas dalam hitungan detik.',
  },
  {
    icon: Icons.Bell,
    title: 'Notifikasi Real-time',
    description: 'Dapatkan update instan saat tugas di-assign, di-update, atau mendekati deadline. Tetap terinformasi.',
  },
  {
    icon: Icons.Share,
    title: 'Ekspor & Integrasi',
    description: 'Ekspor ke CSV/PDF, integrasi webhook, dan API terbuka untuk workflow kustom Anda.',
  },
]

export const pricingPlans = [
  {
    name: 'Gratis',
    price: 'Rp 0',
    period: '/bulan',
    description: 'Cocok untuk penggunaan pribadi & proyek kecil',
    features: [
      'Todo & proyek tidak terbatas',
      'Tag, filter, & pencarian',
      'Ekspor CSV/PDF',
      'Mode gelap/terang',
      'Sinkronisasi cloud',
    ],
    cta: 'Mulai Gratis',
    popular: false,
  },
  {
    name: 'Pro',
    price: 'Rp 79.000',
    period: '/bulan',
    description: 'Untuk profesional & tim kecil yang butuh lebih',
    features: [
      'Semua fitur Gratis',
      'Kolaborasi tim (hingga 10 orang)',
      'Deadline & pengingat otomatis',
      'Notifikasi email & push',
      'Analytics & laporan produktivitas',
      'Prioritas dukungan',
    ],
    cta: 'Mulai Uji Coba 14 Hari',
    popular: true,
  },
  {
    name: 'Tim',
    price: 'Rp 199.000',
    period: '/bulan',
    description: 'Untuk tim yang butuh manajemen lanjutan',
    features: [
      'Semua fitur Pro',
      'Anggota tim tidak terbatas',
      'Role & permission kustom',
      'Audit log aktivitas',
      'SSO (SAML/OIDC)',
      'Dedicated support & SLA',
    ],
    cta: 'Hubungi Sales',
    popular: false,
  },
]

export const testimonials = [
  {
    quote: 'TodoList mengubah cara tim kami bekerja. Antarmukanya begitu bersih dan intuitif—onboarding tim baru hanya butuh menit, bukan jam.',
    author: 'Sarah Wijaya',
    role: 'Engineering Lead, Tokopedia',
    avatar: 'SW',
  },
  {
    quote: 'Fitur tag dan filter saja sudah worth it. Saya bisa mengelola 200+ tugas mingguan tanpa pernah kewalahan. Best productivity tool I\'ve used.',
    author: 'Budi Santoso',
    role: 'Freelance Developer',
    avatar: 'BS',
  },
  {
    quote: 'Sebagai startup, kami butuh tool yang scale. TodoList tumbuh bersama kami—dari 3 orang jadi 50+ tanpa perlu migrasi platform.',
    author: 'Lisa Chen',
    role: 'COO, FinTech Startup',
    avatar: 'LC',
  },
]