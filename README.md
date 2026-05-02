# ReadyMiix Store

Boutique en ligne premium de cocktails ReadyMiix — Guyane française.

## Stack
- Next.js 14 · TypeScript · Tailwind CSS
- Prisma (PostgreSQL) · Zustand · Lucide React

## Variables d'environnement (Vercel)
```
DATABASE_URL=postgresql://...  (Neon)
ADMIN_PASSWORD=...
ADMIN_SECRET=...
NEXT_PUBLIC_WHATSAPP=594...
```

## Initialisation de la base
```bash
npx prisma db push
npx tsx prisma/seed.ts
```
