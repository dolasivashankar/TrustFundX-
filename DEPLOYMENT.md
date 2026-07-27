# ⚡ TrustFundX – Deployment & Setup Guide

This guide covers complete deployment procedures for **TrustFundX** on local development, Docker, Vercel, Railway, Render, Supabase, and Neon.

---

## 🛠️ System Requirements

- **Node.js**: v20.0.0 or higher
- **Package Manager**: npm v10+ or pnpm v9+
- **Database**: PostgreSQL 15+ (local, Supabase, Neon, or Railway)
- **Algorand Node**: Algonode TestNet/MainNet API (free, no key required)
- **AI Provider**: Google Gemini API key ([Get API Key](https://aistudio.google.com/app/apikey))

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install
```bash
git clone https://github.com/dolasivashankar/stellar-crowdfunding-page.git TrustFundX
cd TrustFundX
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` in the root:
```bash
cp .env.example .env
```

Edit `.env` and configure your database string:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/trustfundx"
GEMINI_API_KEY="your-gemini-api-key"
```

### 3. Database Migration & Seed
```bash
# Push schema to database
npm run db:migrate

# Seed admin user & sample campaigns
cd packages/database && npm run db:seed
```

### 4. Run Development Servers
```bash
# Run both API and Web concurrently
npm run dev
```

- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:4000`
- **Swagger API Docs**: `http://localhost:4000/api-docs`

---

## 🐳 Docker Deployment

To run the entire stack (PostgreSQL + Express API + Next.js Web) in Docker:

```bash
docker-compose up -d --build
```

Access the app at `http://localhost:3000`.

---

## ☁️ Cloud Deployment Setup

### 1. Database (Supabase or Neon)
- Create a project on [Supabase](https://supabase.com) or [Neon](https://neon.tech).
- Copy the PostgreSQL connection URI.
- Set `DATABASE_URL` in your backend environment variables.
- Run `npx prisma db push` to initialize tables.

### 2. Backend API (Railway or Render)
- Connect repository to Railway / Render.
- Set Root Directory to `apps/api`.
- Set Environment Variables:
  - `DATABASE_URL`
  - `PORT=4000`
  - `JWT_SECRET`
  - `ALGORAND_NETWORK=testnet`
  - `X402_SECRET_KEY`
  - `GEMINI_API_KEY`

### 3. Frontend (Vercel)
- Import repo into [Vercel](https://vercel.com).
- Set Root Directory to `apps/web`.
- Set Environment Variables:
  - `NEXT_PUBLIC_API_URL=https://your-backend-api.up.railway.app`
  - `NEXT_PUBLIC_ALGORAND_NETWORK=testnet`
- Deploy!

---

## 🔐 Initial Admin Credentials

Default seed credentials:
- **URL**: `http://localhost:3000/admin`
- **Email**: `admin@trustfundx.com`
- **Username**: `admin`
- **Password**: `TrustFundX@2026`

> ⚠️ Change password immediately after initial login via Admin Settings.

---

## ⚡ Algorand Blockchain Configuration

To switch between TestNet and MainNet:
- Set `ALGORAND_NETWORK=mainnet` in backend `.env`
- Set `NEXT_PUBLIC_ALGORAND_NETWORK=mainnet` in frontend `.env`
