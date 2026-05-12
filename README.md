# LibrarEase Web

LibrarEase Web is the Next.js frontend for LibrarEase, a library management application for books, members, subscriptions, borrows, reviews, collections, staff, and admin dashboards.

This guide is for developers who need to run the web app locally.

## Requirements

- Node.js 20 or newer
- Yarn classic, managed through the version pinned in `package.json`
- Redis, either local or hosted
- Firebase project with client configuration and an Admin service account
- Running LibrarEase API service, reachable from this app through `API_URL`

## Local Setup

### 1. Install dependencies

Enable Corepack so the pinned Yarn version is used:

```bash
corepack enable
yarn install --frozen-lockfile
```

If your Node installation does not include Corepack, install Yarn classic and then run `yarn install --frozen-lockfile`.

### 2. Create the environment file

Copy the example environment file:

```bash
cp .env.example .env.local
```

Fill these values before starting the app:

```bash
API_URL=http://localhost:<api-port>
NEXT_PUBLIC_APP_URL=http://localhost:3000

FIREBASE_API_KEY=<firebase-web-api-key>
FIREBASE_AUTH_DOMAIN=<firebase-auth-domain>
FIREBASE_PROJECT_ID=<firebase-project-id>

SESSION_COOKIE_NAME=<session-cookie-name>
REFRESH_TOKEN_COOKIE_NAME=<refresh-token-cookie-name>
LIBRARY_COOKIE_NAME=<library-cookie-name>
CLIENT_ID=<api-client-id>

GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/serviceAccountKey.json

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

`GOOGLE_APPLICATION_CREDENTIALS` must point to a Firebase Admin service account JSON file on your machine. Do not commit that file or any filled environment file.

The OpenTelemetry variables in `.env.example` are optional for local development.

### 3. Start Redis

With Homebrew on macOS:

```bash
brew install redis
brew services start redis
```

Or with Docker:

```bash
docker run --name librarease-redis -p 6379:6379 -d redis:7
```

Use the same host, port, password, and database in your environment file.

### 4. Start the backend API

Run the LibrarEase API service separately and set `API_URL` to its base URL, for example:

```bash
API_URL=http://localhost:8000
```

In local development, this app rewrites `/api/*` requests to `${API_URL}/api/*`.

### 5. Run the web app

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

To run the development server with local HTTPS:

```bash
yarn devs
```

## Verify Your Setup

Run these checks before opening a pull request:

```bash
yarn lint
yarn typecheck
yarn build
```

`yarn lint` runs Biome checks, `yarn typecheck` runs TypeScript, and `yarn build` creates a production Next.js build.

## Available Scripts

- `yarn dev`: start the Next.js dev server with Turbopack
- `yarn devs`: start the dev server with experimental local HTTPS
- `yarn devi`: start the dev server with the Node inspector enabled
- `yarn analyze`: run Next.js bundle analysis
- `yarn build`: create a production build
- `yarn start`: start the production server after a build
- `yarn lint`: run Biome checks
- `yarn format`: format code with Biome
- `yarn typegen`: generate Next.js route types and run TypeScript
- `yarn typecheck`: run TypeScript without emitting files

## Common Issues

### The app cannot reach API routes

Check that the backend API is running and that `API_URL` points to its base URL. The value should not include a trailing `/api`.

### Authentication fails locally

Confirm that the Firebase project values match the project used by the backend API. Also verify that the Admin service account path is absolute and readable from your shell.

### Redis connection fails

Confirm Redis is running on the host and port from your environment file. If you are using Docker, make sure the container is still running:

```bash
docker ps
```

### Metadata, sitemap, or absolute URLs look wrong

Set `NEXT_PUBLIC_APP_URL` to the URL where the web app is being served locally, usually `http://localhost:3000`.

## Production Build

To test the production path locally:

```bash
yarn build
yarn start
```

The Dockerfile builds a standalone Next.js server and exposes port `3000`.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for pull request expectations, code style, and contribution terms.

## License

This software is licensed under the PolyForm Noncommercial License 1.0.0. See [LICENSE](LICENSE) for terms. For commercial licensing inquiries, contact solidifyarmor@gmail.com.
