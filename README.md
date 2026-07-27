# ⚡ TrustFundX – AI-Powered Emergency Relief & Disaster Funding Network

![TrustFundX Banner](https://images.unsplash.com/photo-1547683905-f686c993aae5?w=1200)

**TrustFundX** is a production-ready, luxury-designed disaster relief funding network that combines **Artificial Intelligence**, the **Algorand Blockchain**, and the **x402 Protocol** to provide transparent, fast, secure, and verifiable emergency funding for natural disaster victims worldwide.

---

## 🌟 Key Features

- **🏆 Luxury Gold Design System**: Deep black aesthetics with gold gradients (`#FFD700`, `#B8860B`), glassmorphism, Framer Motion animations, and responsive layouts.
- **🤖 AI Disaster Verification**: Powered by Google Gemini API to verify disaster authenticities, analyze satellite/damage imagery, detect fake or duplicate campaigns, compute risk and urgency scores, and alert admins.
- **⛓️ Algorand Blockchain Donations**: Direct donor-to-beneficiary transfers with instant finality (~4.5s), near-zero fees, and verifiable transaction records linked to Pera Wallet Explorer.
- **⚡ x402 Protocol Integration**: Native HTTP 402 payment handshake generating cryptographically signed receipts (HMAC-SHA256) for every on-chain donation.
- **👑 Dual Interface Architecture**:
  1. **User Portal**: Wallet connection (Pera, Defly, WalletConnect), campaign discovery, interactive donation wizard, donation history tracking.
  2. **Admin Suite**: Metric cards, campaign creation/editing, disaster location mapping, AI intelligence dashboard, transaction table, export capabilities, security logs.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI & Styling**: React 19, Tailwind CSS (Custom Gold Theme), Framer Motion, shadcn/ui, Lucide Icons
- **State & Data**: Zustand, React Query (TanStack Query v5), Axios
- **Form Handling**: React Hook Form, Zod Validation

### Backend & Database
- **Server**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT, bcrypt, Role-Based Access Control (RBAC)
- **API Documentation**: Swagger / OpenAPI 3.0

### Blockchain & Payments
- **Blockchain**: Algorand (TestNet & MainNet)
- **SDKs**: `algosdk` v3, `@txnlab/use-wallet-react`
- **Wallets**: Pera Wallet, Defly Wallet, WalletConnect
- **Payments**: Custom Algorand-native x402 Protocol implementation

---

## 📁 Repository Structure

```text
TrustFundX/
├── apps/
│   ├── api/                  # Express TypeScript Backend REST API
│   │   ├── src/
│   │   │   ├── controllers/  # Auth, Campaign, Donation, Admin, AI Controllers
│   │   │   ├── middleware/   # Auth, RBAC, Rate Limiting, Audit Logs, Error Handler
│   │   │   ├── routes/       # API Route definitions & Swagger docs
│   │   │   ├── services/     # Algorand, x402, AI (Gemini), Email Services
│   │   │   └── utils/        # Logger, JWT, Crypto helpers
│   └── web/                  # Next.js 15 Frontend Web Application
│       ├── src/
│       │   ├── app/          # Next.js App Router (Landing, Auth, User & Admin Dashboards)
│       │   ├── components/   # Luxury Gold Components (Hero, Stats, AI, Wallet, Admin)
│       │   ├── hooks/        # Custom hooks
│       │   ├── lib/          # API client, Algorand & x402 helpers
│       │   └── store/        # Zustand state management
├── packages/
│   ├── database/             # Prisma Schema & Client Singleton
│   └── shared-types/         # Zod schemas & shared TypeScript types
├── docker-compose.yml        # Complete Docker multi-container stack
├── DEPLOYMENT.md             # Full setup and cloud deployment guide
├── turbo.json                # Turborepo build pipeline
└── package.json              # Monorepo root configuration
```

---

## 🚀 Quick Setup

Refer to [DEPLOYMENT.md](file:///c:/Users/G%20.%20GOWTHAM%20KUMAR/Desktop/AlgorandProjects/TrustFundX/DEPLOYMENT.md) for full instructions.

```bash
# 1. Install dependencies
npm install

# 2. Set environment variables
cp .env.example .env

# 3. Migrate and seed database
npm run db:migrate
cd packages/database && npm run db:seed

# 4. Start development servers
npm run dev
```

- **App**: `http://localhost:3000`
- **API**: `http://localhost:4000`
- **Swagger Docs**: `http://localhost:4000/api-docs`

---

## 🛡️ Default Admin Account

- **Email**: `admin@trustfundx.com`
- **Username**: `admin`
- **Password**: `TrustFundX@2026`

---

## 📜 License

MIT License. Designed for humanitarian disaster relief.
