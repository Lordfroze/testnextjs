# 📋 Planning: TodoList App dengan Login (React + Tailwind + Next.js)

## 🎯 Tujuan
Membuat aplikasi **TodoList** yang terintegrasi antara **frontend (React + Tailwind)** dan **backend (Next.js)** dengan fitur:
- Login pengguna
- CRUD Todo
- Soft delete
- Nama penulis pada setiap todo

## 📚 Dokumentasi Terkait

**Dokumentasi lengkap untuk proyek ini tersedia di [README.md](./readme.md)** yang mencakup:
- Struktur folder dan penamaan file
- Semua API endpoints yang tersedia
- Schema database Prisma
- Cara setup project
- Tech stack yang digunakan
- Cara menjalankan dan test aplikasi
- Troubleshooting dan praktik terbaik

---

## 📖 Ringkasan Fitur Utama

### 1. Autentikasi (Login)
- Halaman login di `/login`
- API route `/api/auth/login` dengan JWT token
- Middleware proteksi route
- Cookie yang aman (httpOnly, secure)

### 2. CRUD Todo
- Model database Todo dengan relasi ke User
- API endpoints untuk semua operasi Todo
- Soft delete (menggunakan `deletedAt` field)
- Filter untuk mengabaikan todo yang terhapus

### 3. Soft Delete
- Tidak pernah menghapus data secara permanen
- Mengatur `deletedAt` ke timestamp saat ini
- Query filter `WHERE deletedAt IS NULL`

### 4. Nama Penulis
- Relasi Todo ke User model
- Menampilkan nama penulis di UI
- Menyimpan `authorId` saat membuat todo

### 5. Fitur Tambahan
- Antarmuka yang responsif (Tailwind CSS)
- Proteksi route dengan middleware
- Penanganan error yang komprehensif
- Praktik terbaik keamanan

---

## 🧱 Stack Teknologi
- **Framework**: Next.js 14+ (App Router)
- **Frontend**: React, Tailwind CSS
- **Database**: Bisa pakai MongoDB atau PostgreSQL (sesuai preferensi)
- **Auth**: JWT + cookie (atau bisa pakai NextAuth.js jika ingin lebih cepat)
- **ORM**: Prisma (untuk TypeScript-friendly DB access)

---

## 🔐 Fitur 1: Autentikasi (Login)
1. Buat halaman `/login`
   - Form: username/email + password
2. API route `/api/auth/login`
   - Cek ke database apakah user valid
   - Jika iya, generate JWT token
   - Simpan token di cookie (httpOnly)
3. Buat middleware untuk proteksi route
   - Jika belum login, redirect ke `/login`
4. Buat endpoint `/api/auth/logout`
   - Hapus cookie token

> Catatan: Jika mau lebih cepat, pakai NextAuth.js dan sesuaikan dengan kebutuhan.

---

## 🗂️ Fitur 2: CRUD Todo
1. Model Todo:
   ```prisma
   model Todo {
     id        Int      @id @default(autoincrement())
     title     String
     completed Boolean  @default(false)
     authorId  Int
     author    User     @relation(fields: [authorId], references: [id])
     deletedAt DateTime?  // untuk soft delete
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
   }
   ```
2. API Routes:
   - `GET /api/todos` — ambil semua todo yang tidak dihapus (deletedAt == null)
   - `GET /api/todos/:id` — detail satu todo
   - `POST /api/todos` — buat todo baru (perlu auth)
   - `PUT /api/todos/:id` — update todo (perlu auth)
   - `DELETE /api/todos/:id` — soft delete (set deletedAt, jangan hapus permanen)
3. Frontend:
   - Halaman `/todo` (dilindungi auth)
   - Form tambah todo
   - List todo
   - Checkbox "sudah selesai"
   - Tombol hapus (soft delete)
   - Nama penulis ditampilkan di tiap todo

---

## 🗑️ Fitur 3: Soft Delete
- Saat delete, jangan hapus dari database
- Set `deletedAt` ke waktu sekarang
- Query `GET /todos` hanya mengembalikan todo dengan `deletedAt == null`
- Tambahkan filter `WHERE deletedAt IS NULL` di semua query todo

---

## ✍️ Fitur 4: Nama Penulis di Setiap Todo
- Todo harus punya relasi ke User
- Tampilkan nama penulis (nama atau username) di UI tiap todo
- Saat membuat todo, simpan `authorId` dari user yang sedang login

---

## 🗺️ Flow Penggunaan
1. User buka `/login`, masuk
2. Setelah login, dialihkan ke `/todo`
3. User lihat daftar todo miliknya
4. User bisa:
   - Tambah todo baru
   - Edit / tandai sudah selesai
   - Hapus (soft delete)
5. Nama penulis muncul di setiap todo

---

## 📁 Struktur Folder Cadangan
```
app/
├── login/
├── todo/
api/
├── auth/
│   ├── login/route.ts
│   └── logout/route.ts
├── todos/
│   ├── route.ts        // GET all, POST
│   └── [id]/route.ts   // GET one, PUT, DELETE
lib/
├── prisma/db.ts
├── auth.ts (fungsi JWT/cookie)
middleware.ts (proteksi route)
```

---

## ✅ Kriteria Selesai
- [ ] Bisa login dan logout
- [ ] Bisa melihat halaman todo hanya setelah login
- [ ] Bisa tambah, edit, hapus todo
- [ ] Todo yang dihapus tidak muncul di list (soft delete)
- [ ] Nama penulis muncul di setiap todo
- [ ] Responsif di mobile (Tailwind)

---

> Dokumen ini bersifat high-level. Silakan disesuaikan teknisnya saat implementasi.
