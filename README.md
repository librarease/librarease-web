## LibrarEase Web

A Next.js app for LibrarEase. This repo uses Yarn.

**Prereqs**

- Node.js 18+ (or 20+ recommended)
- Yarn (classic) — packageManager is set in `package.json`
- Redis (local or hosted)
- Firebase project (client SDK + Admin credentials)

## Quick Setup

1. Install deps

```bash
yarn install
```

2. Configure environment

Copy the example and fill required values:

```bash
cp .env.example .env
# or create .env.local in development
```

Required variables (see `.env.example` for the full list):

- Firebase client: `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_PROJECT_ID`
- Firebase Admin: `GOOGLE_APPLICATION_CREDENTIALS` (absolute path to the service account JSON)
- Redis: `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` (optional), `REDIS_DB`
- App URLs: `API_URL`, `NEXT_PUBLIC_APP_URL`

3. Start Redis

On macOS (Homebrew):

```bash
brew install redis
brew services start redis
# default host: localhost, port: 6379
```

Or via Docker:

```bash
docker run -p 6379:6379 --name redis -d redis:7
```

4. Run the app

```bash
yarn dev
# build & run production
yarn build && yarn start
```

Open http://localhost:3000 to view.

## Scripts

- `yarn dev`: Next.js dev server (Turbopack)
- `yarn build`: Production build
- `yarn start`: Start production server
- `yarn lint`: ESLint
- `yarn format`: Prettier format
- `yarn typecheck`: TypeScript type checking

## Firebase Notes

- Create a Firebase project and enable Authentication as needed
- Place the Admin service account JSON and point `GOOGLE_APPLICATION_CREDENTIALS` to it
- Client keys go in `FIREBASE_*` variables; do not commit secrets

## Observability (optional)

If using OpenTelemetry, configure `OTEL_*` variables per `.env.example`.

## License

This software is licensed under the PolyForm Noncommercial License 1.0.0. See the `LICENSE` file for terms. For commercial licensing inquiries, contact: solidifyarmor@gmail.com.
