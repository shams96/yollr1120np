# Yollr V6 Launch Checklist

## 1. Database & Auth
- [ ] Create Supabase Project.
- [ ] Run `supabase/schema.sql`.
- [ ] Enable Phone Auth provider.
- [ ] Create `moments` and `heists` storage buckets (public).

## 2. Configuration
- [ ] Update `.env.local` with real keys.
- [ ] Update `next.config.ts` with Supabase image domain.
- [ ] Configure Firebase Cloud Messaging credentials.

## 3. Seeding
- [ ] Insert initial campuses into `campuses` table.
- [ ] Create a test "Active Heist" in the `heists` table for the seed campus.

## 4. Deploy
- [ ] Push to GitHub.
- [ ] Connect to Netlify.
- [ ] Add Environment Variables in Netlify.
- [ ] Verify PWA installability.
