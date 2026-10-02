# 📋 TodoList Application dengan Login

Aplikasi TodoList lengkap yang mengintegrasikan frontend (React + Tailwind) dan backend (Next.js) dengan autentikasi JWT dan fitur CRUD lengkap.

---

## 🎯 Tujuan

Membuat aplikasi **TodoList** yang aman dengan fitur:
- Autentikasi pengguna (login/logout)
- CRUD operations untuk todo
- Soft delete (tidak menghapus data secara permanen)
- Penampilan nama penulis di setiap todo
- **Role-based access control (RBAC) - Admin & User roles**
- **Manajemen user oleh Admin**
- Antarmuka yang responsif untuk mobile dan desktop

---

## 🏗️ Arsitektur dan Struktur Folder

### Struktur Proyek Utama
```
.
├── app/
│   ├── login/
│   │   └── page.tsx           # Halaman login
│   ├── todo/
│   │   └── page.tsx           # Halaman daftar todo (dilindungi auth)
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.ts    # API login
│   │   │   ├── logout/
│   │   │   │   └── route.ts    # API logout
│   │   │   └── me/
│   │   │       └── route.ts    # API get current user info
│   │   ├── admin/
│   │   │   └── users/
│   │   │       └── route.ts    # Admin user management
│   │   └── todos/
│   │       ├── route.ts        # GET /api/todos, POST /api/todos
│   │       └── [id]/route.ts   # GET /api/todos/:id, PUT /api/todos/:id, DELETE /api/todos/:id
│   └── lib/
│       ├── session.ts          # Utility sesi JWT
│       └── todos.ts            # Utility todo operations
├── lib/
│   ├── prisma/
│   │   ├── db.ts              # Koneksi Prisma
│   │   └── schema.prisma      # Definis schema database
│   ├── auth.ts                # Utility autentikasi (opsional)
│   └── middleware.ts          # Proteksi route
└── package.json
```

### Penamaan File dan Konvensi

- **Route Handlers**: `app/api/<resource>/route.ts` untuk operations collection
- **Route Handlers with ID**: `app/api/<resource>/<id>/route.ts` untuk operations single resource
- **Middleware**: `middleware.ts` di root untuk proteksi global
- **Utility Modules**: `lib/` folder untuk helper functions
- **Database Models**: `prisma/` folder untuk schema dan koneksi

---

## 🔌 API Endpoints yang Tersedia

### Autentikasi
```http
POST /api/auth/login           # Login pengguna
POST /api/auth/logout          # Logout pengguna
GET  /api/auth/me              # Info user saat ini (termasuk role)
```

### Admin User Management (Admin Only)
```http
GET  /api/admin/users          # Daftar semua user
POST /api/admin/users          # Buat user baru
```

**Request Body (Login):**
```json
{
  "username": "user123",
  "password": "password123"
}
```

**Response (Login):**
```json
{
  "userId": 1,
  "username": "admin",
  "role": "ADMIN"
}
```

**Response (/api/auth/me):**
```json
{
  "userId": "1",
  "username": "admin",
  "role": "ADMIN"
}
```

### Todo Operations
```http
GET /api/todos                 # Ambil semua todo milik pengguna
POST /api/todos                # Buat todo baru
GET /api/todos/:id             # Ambil todo spesifik
PUT /api/todos/:id             # Update todo
DELETE /api/todos/:id          # Soft delete todo
```

**Request Body (Todo Operations):**
```json
{
  "title": "Belajar Next.js",
  "completed": false
}
```

**Response Contoh (GET /api/todos):**
```json
[
  {
    "id": 1,
    "title": "Belajar Next.js",
    "completed": false,
    "authorId": 1,
    "deletedAt": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

## 🗄️ Schema Database

### Prisma Schema (`prisma/schema.prisma`)
```prisma
model User {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  password  String
  role      String   @default("USER")  // USER, ADMIN
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  todos     Todo[]
}

model Todo {
  id        Int      @id @default(autoincrement())
  title     String
  completed Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  deletedAt DateTime?  // untuk soft delete
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([authorId])
  @@index([deletedAt])
}
```

### Cara Migrasi Schema
```bash
# Generate Prisma client
npx prisma generate

# Push schema ke database
npx prisma db push

# Atau gunakan migration (disarankan untuk production)
npx prisma migrate dev
```

---

## 🔐 Role-Based Access Control (RBAC)

Aplikasi ini mengimplementasikan sistem **Role-Based Access Control** dengan dua peran:

### Peran (Roles)
| Role | Deskripsi | Akses |
|------|-----------|-------|
| **ADMIN** | Administrator sistem | Full access ke semua fitur + manajemen user |
| **USER** | Pengguna biasa | Akses ke todo CRUD sendiri |

### Hak Akses per Endpoint
| Endpoint | USER | ADMIN |
|----------|------|-------|
| `GET /api/todos` | ✅ | ✅ |
| `POST /api/todos` | ✅ | ✅ |
| `PUT /api/todos/:id` | ✅ (milik sendiri) | ✅ |
| `DELETE /api/todos/:id` | ✅ (milik sendiri) | ✅ |
| `GET /api/auth/me` | ✅ | ✅ |
| `GET /api/admin/users` | ❌ 403 | ✅ |
| `POST /api/admin/users` | ❌ 403 | ✅ |

### Fitur Admin
- **Settings Menu** hanya muncul untuk user dengan role `ADMIN`
- **Tambah User** via modal di halaman todo
- User baru otomatis mendapat role `USER`
- Admin tidak bisa dihapus/diubah role-nya via UI

### Implementasi Teknis
- Role disimpan di database (`User.role`)
- Role dimasukkan ke JWT token saat login
- Middleware & API memverifikasi `session.role === 'ADMIN'`
- Frontend kondisional merender UI berdasarkan `userRole`

---

## ⚙️ Tech Stack dan Library

### Framework Utama
- **Next.js 14+** (App Router)
- **React 18+**
- **TypeScript**

### Styling
- **Tailwind CSS** (Utility-first CSS framework)

### Backend
- **Node.js** runtime
- **JWT** (jsonwebtoken) untuk autentikasi
- **bcryptjs** untuk hashing password
- **Prisma ORM** untuk database access

### Database
- **PostgreSQL** (disarankan) atau **MongoDB**

### DevOps
- **Vercel** untuk deployment (recommendation)
- **Environment Variables** untuk konfigurasi aman

### Dependencies Utama
```json
{
  "dependencies": {
    "next": "14.2.0",
    "react": "18.3.0",
    "react-dom": "18.3.0",
    "typescript": "5.5.3",
    "@types/node": "20.12.0",
    "@types/react": "18.3.0",
    "@types/react-dom": "18.3.0",
    "@prisma/client": "5.10.0",
    "jsonwebtoken": "9.0.2",
    "bcryptjs": "2.4.3",
    "jose": "5.2.0"
  },
  "devDependencies": {
    "tailwindcss": "3.4.0",
    "autoprefixer": "10.4.17",
    "postcss": "8.4.35",
    "prisma": "5.10.0",
    "tsx": "4.7.0",
    "eslint": "8.57.0",
    "eslint-config-next": "14.2.0"
  }
}
```

---

## 🚀 Cara Setup Project

### 1. Clone Repository
```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Install Dependencies
```bash
# Install npm packages
npm install
# Atau gunakan yarn
yarn install
```

### 3. Konfigurasi Environment Variables
Buat file `.env.local` di root project:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/tododb"
# Atau untuk MongoDB
DATABASE_URL="mongodb://localhost:27017/tododb"

# JWT Secret (ganti dengan secret yang kuat)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Setup Database
```bash
# Generate Prisma client
npx prisma generate

# Setup database (push schema)
npx prisma db push

# Atau gunakan migrations
npx prisma migrate dev
```

### 5. Create Test Users
```bash
# Gunakan Prisma Studio untuk melihat data
npx prisma studio

# Atau buat user test secara manual:
npx prisma db execute --file=scripts/create-test-user.sql
```

---

## 🏃‍♂️ Cara Run Aplikasi

### Development Server
```bash
# Jalankan di localhost:3000
npm run dev
# Atau
yarn dev
```

### Build untuk Production
```bash
# Build aplikasi
npm run build
# Atau
yarn build
```

### Run di Production
```bash
# Jalankan dengan Node.js
npm start
# Atau
yarn start
```

### Environment Variables Production
```env
# Pastikan environment variables di-setup dengan benar:
- DATABASE_URL
- JWT_SECRET
- PORT (jika ingin custom port)
```

---

## 🧪 Cara Test Aplikasi

### Test Manual
1. **Halaman Login**
   - Akses `http://localhost:3000/login`
   - Coba login dengan kredensial valid: `username: admin`, `password: admin123` (Role: ADMIN)
   - Test redirect setelah login sukses ke `/todo`
   - Test redirect guest ke `/login` ketika mengakses `/todo`

2. **Halaman Todo**
   - Setelah login, akses `http://localhost:3000/todo`
   - Test buat todo baru
   - Test edit todo (centang checkbox selesai)
   - Test hapus todo (soft delete)
   - Verifikasi todo yang dihapus tidak muncul di list

3. **Fitur Admin (hanya untuk user ADMIN)**
   - Login sebagai `admin` / `admin123`
   - Icon Settings (⚙️) muncul di header sebelah tombol Logout
   - Klik "Tambah User" untuk membuat user baru
   - User baru otomatis mendapat role `USER`

4. **API Endpoints**
   - Gunakan tools seperti Postman atau curl
   - Test semua endpoint yang disebutkan di atas

### Test Otomatis (Jika Tersedia)
```bash
# Jalankan test unit
npm test
# Atau
yarn test

# Jalankan test integrasi (jika ada)
npm run test:integration

# Jalankan test e2e
npm run test:e2e
```

### Test API Authentication
```bash
# Test login sukses
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Test akses endpoint terproteksi
curl -X GET http://localhost:3000/api/todos \
  -H "Cookie: session=your-jwt-token"
```

---

## 📁 File Penting untuk Edit

### Frontend Files
- `app/login/page.tsx` - Form login
- `app/todo/page.tsx` - Daftar todo
- `app/api/auth/login/route.ts` - API login
- `app/api/auth/logout/route.ts` - API logout
- `app/api/todos/route.ts` - API todo collection
- `app/api/todos/[id]/route.ts` - API todo single resource

### Backend Files
- `lib/session.ts` - Utility sesi JWT
- `lib/todos.ts` - Utility todo operations
- `lib/prisma/db.ts` - Koneksi database
- `lib/prisma/schema.prisma` - Schema database
- `lib/middleware.ts` - Middleware proteksi route

### Konfigurasi
- `tailwind.config.js` - Konfigurasi Tailwind CSS
- `next.config.js` - Konfigurasi Next.js
- `package.json` - Dependencies dan scripts

---

## 🔒 Keamanan dan Pertimbangan Produksi

### Praktik Terbaik
1. **Environment Variables**: Simpan secrets di environment variables
2. **Password Hashing**: Gunakan bcrypt dengan salt rounds yang tinggi
3. **JWT Secret**: Gunakan secret yang kuat dan unik di production
4. **HTTPOnly Cookies**: Cookie session ditandai dengan httpOnly
5. **CORS**: Konfigurasi CORS untuk API endpoints (jika diperlukan)
6. **Rate Limiting**: Implementasikan rate limiting untuk endpoint autentikasi
7. **Input Validation**: Validasi semua input pengguna
8. **Error Handling**: Jangan expose detail error ke klien

### Pertimbangan Produksi
- Gunakan **PostgreSQL** di production (bukan SQLite)
- Implementasikan **HTTPS** di production
- Gunakan **Vercel** atau platform cloud lain untuk deployment
- Setup **monitoring dan logging**
- Implementasikan **backup dan recovery**
- Gunakan **CDN** untuk static assets

---

## 🌟 Fitur Tambahan (Opsional)

### 1. NextAuth.js
```bash
# Ganti JWT manual dengan NextAuth.js
npm install @auth/core @auth/nextjs
```

### 2. Upload File
```bash
# Untuk mengupload gambar ke todo
npm install @uploadthing/react @uploadthing/core
```

### 3. Real-time Updates
```bash
# Untuk update real-time dengan WebSockets
npm install socket.io-client
```

### 4. Testing Libraries
```bash
# Untuk test yang lebih komprehensif
npm install @testing-library/react @testing-library/jest-dom
```

---

## 🐛 Troubleshooting

### Masalah Umum

**Error: "Cannot find module 'jsonwebtoken'"**
```bash
npm install jsonwebtoken
```

**Error: "Database connection error"**
```bash
# Periksa DATABASE_URL di .env.local
# Pastikan database server running
# Untuk PostgreSQL: systemctl status postgresql
```

**Error: "NEXT_PUBLIC_APP_URL not found"**
```bash
# Tambahkan NEXT_PUBLIC_APP_URL ke .env.local
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Error: "Route /todo not found"**
```bash
# Periksa middleware.ts
# Pastikan route /todo didefinisikan di app/
```

---

## 📝 Catatan Penulis

Aplikasi ini dibuat sebagai referensi untuk:
- Implementasi autentikasi JWT di Next.js
- Menggunakan Prisma ORM dengan PostgreSQL
- Membangun aplikasi full-stack dengan React dan TypeScript
- Membuat utility yang reusable untuk todo operations
- Menunjukkan praktik terbaik keamanan dan performance

Untuk pertanyaan, kontribusi, atau perbaikan, silakan buka issue di repository ini.

---

*Terakhir diperbarui: $(date '+%Y-%m-%d')*
*Versi: 1.0.0*