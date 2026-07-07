# Loan Repayment Portal (1Pay Assignment)

End-to-end loan repayment web application for ABC Bank — identity verification, encrypted loan details, simulated 1Pay payment gateway, and receipt generation.

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | Supabase (PostgreSQL) |
| Hosting | Vercel (frontend) + Render (backend) |

## Project structure

```
Frontend/     React SPA
Backend/      Express API + Supabase scripts
```

## Local setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run `Backend/supabase/migrations/001_initial_schema.sql` in SQL Editor
3. Run `npm run db:seed-demo` from `Backend/` (or paste `Backend/supabase/seed-demo-customers.sql`)

### 2. Backend

```bash
cd Backend
cp .env.example .env
# Fill SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, JWT_SECRET, ENCRYPTION_SECRET
npm install
npm run dev
```

API runs at `http://localhost:3001`

### 3. Frontend

```bash
cd Frontend
cp .env.example .env.local
# Set VITE_API_BASE_URL=http://localhost:3001
npm install
npm run dev
```

App runs at `http://localhost:5173`

## Demo logins

| Customer | Mobile | Card last 4 | Notes |
|----------|--------|-------------|-------|
| Goutam Patel | 9123456780 | 4821 | Default test account |


**Simulated 1Pay OTP:** `1562` (success)

## Environment variables

See `Backend/.env.example` and `Frontend/.env.example`. Never commit `.env` or `.env.local`.

## Scripts

```bash
# Backend
npm run dev              # Start API
npm run db:seed-demo     # Seed demo customers
npm run db:reset-demo    # Reset Goutam Patel balances
npm run db:check         # List customers & loans
```

## Deployment

- **Backend (Render):** Root directory `Backend`, build `npm install && npm run build`, start `npm start`
- **Frontend (Vercel):** Root directory `Frontend`, framework Vite
- Set `FRONTEND_URL` on Render to your Vercel URL for CORS
- Set `VITE_API_BASE_URL` on Vercel to your Render API URL

## License

Private — Business Analyst hiring assignment.
