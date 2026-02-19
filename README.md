# LoadDrop

AI-powered marketplace for bulk inventory. One listing, every channel.

## Stack

- **Monorepo**: npm workspaces
- **Web**: Next.js 15, Tailwind CSS, Shadcn/UI, Framer Motion, NextAuth
- **Mobile**: Expo SDK 52, Expo Router, React Native
- **API**: Node.js, Apollo GraphQL, Prisma, PostgreSQL
- **Auth**: JWT + NextAuth (Credentials + OAuth ready)
- **Payments**: Stripe Connect (checkout flow scaffolded)
- **AI**: Service layer for description generation and quality scoring (Claude/GPT-4V ready)

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment**
   - Copy `.env.example` to `.env` in the repo root and in `apps/api` if you run API separately.
   - Set `DATABASE_URL` (PostgreSQL), `NEXTAUTH_SECRET`, `JWT_SECRET`, `JWT_REFRESH_SECRET`.
   - Optional: `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, Stripe keys, AWS S3, SendGrid.

3. **Database**
   ```bash
   cd apps/api && npx prisma generate && npx prisma db push
   ```

4. **Run**
   - API: `cd apps/api && npm run dev` (port 4000)
   - Web: `cd apps/web && npm run dev` (port 3000)
   - Mobile: `cd apps/mobile && npx expo start`

## Mobile assets

Add to `apps/mobile/assets/`:

- `icon.png` (1024x1024)
- `splash-icon.png` (splash screen)
- `adaptive-icon.png` (Android, 1024x1024)
- `favicon.png` (web)

Or run `npx expo prebuild` and replace assets before building.

## Features (implemented)

- Auth: sign up, sign in, JWT + NextAuth, session
- Listings: create (multi-step wizard), list, detail, categories, condition grades
- AI: generate title/description from category and condition (stub; wire Claude for production)
- Checkout: create checkout session (Stripe placeholder), transaction list
- Auctions: placeBid mutation (proxy bid ready)
- Dashboard: bento-style stats and quick actions
- Theme: dark/light toggle, glassmorphic UI, command palette (Cmd+K)
- Mobile: Expo app with tabs (Explore, Dashboard, Profile)

## Deployment

- **Web**: Vercel (`apps/web`)
- **API**: Node on AWS/Railway/Fly (`apps/api`), set `DATABASE_URL` and secrets
- **Mobile**: EAS Build (`cd apps/mobile && eas build`)

## Security

- Use strong `NEXTAUTH_SECRET`, `JWT_SECRET`, `JWT_REFRESH_SECRET` in production.
- Enable 2FA and rate limiting in production (see Phase 10 plan).
- Never commit `.env` or secrets.
