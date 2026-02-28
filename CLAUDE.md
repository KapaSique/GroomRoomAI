# CLAUDE.md

This file provides guidance for AI assistants when working with code in this repository.

## Project Overview

GroomRoomAI — веб-приложение для управления заявками на услуги груминга домашних животных. Next.js 15+ с TypeScript, Prisma ORM, SQLite, JWT аутентификация.

## Common Commands

```bash
# Development
npm run dev              # Start dev server on localhost:3000
npm run build            # Production build
npm run start            # Run production build
npm run lint             # Run ESLint

# Database
npx prisma db push       # Apply schema changes to SQLite
npx prisma studio        # Open Prisma Studio GUI
node prisma/seed.js      # Seed database with test data
npx prisma generate      # Regenerate Prisma Client after schema changes
```

## Architecture

### Authentication Flow

JWT tokens stored in httpOnly cookies (7 days expiration). All protected routes use `getUserFromCookies()` from `src/lib/auth.ts` to verify authentication.

- `createToken(userId, role)` — generates JWT
- `verifyToken(token)` — validates JWT
- `getUserFromCookies()` — extracts and validates user from request cookies

Cookie is set with `httpOnly`, `secure` (production), `sameSite: 'strict'`.

### API Route Pattern

All API routes in `src/app/api/` follow Next.js App Router conventions:
- `route.ts` exports named functions: `GET`, `POST`, `PATCH`, `DELETE`
- Authentication check at start of each protected endpoint
- Return `NextResponse.json()` with appropriate status codes
- File uploads handled via `request.formData()`

### Role-Based Access Control

Two roles: `USER` and `ADMIN` (stored in User.role field).

- **USER**: can view own requests, create requests, delete own "Новая" requests, add reviews
- **ADMIN**: can view all requests, change status, upload "after" photos

Check role via `user.role === 'ADMIN'` after `getUserFromCookies()`.

### Request Status Workflow

Three statuses (stored as strings in Russian):
1. `"Новая"` — initial status, can be deleted by user
2. `"Обработка данных"` — in progress, admin only
3. `"Услуга оказана"` — completed, user can add review

Status transitions are one-way (no rollback logic).

### File Upload Handling

Photos stored in `public/uploads/` directory. Filenames use timestamp + original name pattern.

- Accepted formats: JPEG, BMP
- Max size: 2MB
- `beforePhoto` — uploaded by user on request creation
- `afterPhoto` — uploaded by admin when completing request

File validation happens in API routes before saving to disk.

### Client Components

Interactive components require `"use client"` directive:
- Forms (LoginForm, RegisterForm)
- Dashboard clients (DashboardClient, AdminClient)
- Animated components (ReviewCarousel, AnimatedCard)

Server components handle data fetching and authentication checks.

### Database Schema

Two models: `User` and `Request` (one-to-many relationship).

Key fields:
- `User.login` — unique, used for authentication
- `User.role` — "USER" or "ADMIN"
- `Request.status` — "Новая", "Обработка данных", "Услуга оказана"
- `Request.userId` — foreign key to User

Prisma Client singleton exported from `src/lib/db.ts`.

## Important Patterns

### Prisma Client Usage

Always import from `src/lib/db.ts`:
```typescript
import { prisma } from '@/lib/db';
```

Never instantiate PrismaClient directly to avoid connection issues.

### API Error Handling

Standard pattern:
```typescript
try {
  // operation
  return NextResponse.json({ success: true });
} catch (error) {
  return NextResponse.json({ error: 'Message' }, { status: 500 });
}
```

### Protected Route Check

```typescript
const user = await getUserFromCookies();
if (!user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

### Environment Variables

Required: `JWT_SECRET` in `.env` file (fallback exists but should not be used in production).

## Testing Credentials

After running `node prisma/seed.js`:
- Admin: login `admin`, password `admin123`
- User: login `ivan-ivanov`, password `password123`
