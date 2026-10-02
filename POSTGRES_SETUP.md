# PostgreSQL Setup Guide for TodoList App

This document provides step-by-step instructions to set up PostgreSQL for the TodoList application.

## 🐘 PostgreSQL Installation

### Option 1: Homebrew (macOS)
```bash
# Install PostgreSQL
brew install postgresql

# Start PostgreSQL service
brew services start postgresql

# Verify installation
psql --version
```

### Option 2: Docker
```bash
# Pull PostgreSQL image
docker pull postgres:18.2-alpine

# Run PostgreSQL container
docker run -d \
  --name postgres-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=adadeh \
  -e POSTGRES_DB=tododb \
  -p 5432:5432 \
  postgres:18.2-alpine
```

### Option 3: Manual Installation
Download from https://www.postgresql.org/download/

## 🔐 PostgreSQL Authentication Setup

### Set Password for PostgreSQL User
```bash
# Switch to postgres user
su postgres

# Set password for postgres user
psql -U postgres -h localhost -c "ALTER USER postgres WITH PASSWORD 'adadeh';"

# Exit postgres user
su -
```

### Grant Permissions
```bash
# As postgres user
su postgres -c "
psql -h localhost -c \"GRANT ALL PRIVILEGES ON DATABASE tododb TO postgres;\"
"
```

## 📁 File Updates

### .env File (PostgreSQL)
```env
DATABASE_URL="postgresql://postgres:adadeh@localhost:5432/tododb?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-min-32-chars"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### Prisma Schema (PostgreSQL)
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## 🗄️ Database Setup Commands

### After PostgreSQL is Running
```bash
# Navigate to project directory
cd /path/to/todolist-app

# Generate Prisma client
npm run prisma:generate

# Push schema to PostgreSQL database
npm run prisma:push

# Seed database with initial data
npm run db:seed

# Verify connection
psql -U postgres -h localhost -d tododb -c "SELECT 'Connection successful';"
```

## 🔍 Verification Steps

### 1. Check PostgreSQL Status
```bash
# Check if PostgreSQL is running
netstat -an | grep 5432

# Check PostgreSQL processes
ps aux | grep postgres | grep -v grep
```

### 2. Test Database Connection
```bash
# Test connection
psql -U postgres -h localhost -d tododb -c "SELECT version();"

# Check tables
psql -U postgres -h localhost -d tododb -c "\dt"

# Check data
psql -U postgres -h localhost -d tododb -c "SELECT * FROM users LIMIT 3;"
```

### 3. Verify Application Setup
```bash
# Start Next.js development server
npm run dev

# Check if app is accessible
# Open http://localhost:3000 in your browser
# Login with: admin / admin123
```

## 🚨 Troubleshooting

### Connection Issues
```bash
# Check PostgreSQL service
brew services list | grep postgresql

# Start PostgreSQL service
brew services start postgresql

# Restart PostgreSQL
brew services restart postgresql
```

### Permission Issues
```bash
# Check PostgreSQL data directory
ls -la /Library/PostgreSQL/18/data/

# Fix permissions if needed
chmod 700 /Library/PostgreSQL/18/data
```

### Docker Issues
```bash
# Check Docker status
docker ps

# Restart Docker daemon
brew services restart docker
```

## 📋 Quick Reference

### Current Configuration
- **Database**: PostgreSQL
- **Host**: localhost
- **Port**: 5432
- **Username**: postgres
- **Password**: adadeh
- **Database Name**: tododb
- **Schema**: public

### Commands Summary
```bash
# Install PostgreSQL
homebrew install postgresql
brew services start postgresql

# Setup TodoList with PostgreSQL
cd /path/to/todolist-app
npm run prisma:generate
npm run prisma:push
npm run db:seed
npm run dev
```

## 🎯 Expected Results

After successful setup, you should see:

1. ✅ PostgreSQL running on localhost:5432
2. ✅ Database "tododb" created
3. ✅ User "postgres" with password "adadeh"
4. ✅ Tables "users" and "todos" created
5. ✅ Application running on http://localhost:3000
6. ✅ Login working with credentials: admin / admin123
7. ✅ Todo functionality fully operational

## 🔄 Alternative: Keep SQLite

If PostgreSQL setup is problematic, the application will continue to work with SQLite:

```env
DATABASE_URL="file:./dev.sqlite"
```

SQLite is perfectly fine for development and testing purposes.

---

**📧 Need Help?**

Contact for additional PostgreSQL setup assistance or troubleshooting.

**🕐 Last Updated:** $(date '+%Y-%m-%d')"