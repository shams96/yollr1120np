# Yollr V6

The campus-native reality-game social app.

## 🚀 Quick Start

### 1. Setup Environment
```bash
cp .env.example .env.local
# Fill in Supabase and Firebase keys
```

### 2. Install & Run
```bash
npm install
npm run dev
```

## 📱 Features
- **Single Feed**: Infinite scroll of Heists, Polls, and Moments.
- **Time to Fun**: < 30s onboarding flow (Phone -> Campus -> Feed).
- **Campus Heists**: Weekly event cycle (Submission -> Voting -> Execution).
- **Moments**: 24h ephemeral video content.

## 🛠️ Deployment
- **Database**: Run `supabase/schema.sql` in your Supabase SQL Editor.
- **Hosting**: Deploy to Netlify.
- **PWA**: Fully configured with `manifest.json` and `service-worker.js`.
