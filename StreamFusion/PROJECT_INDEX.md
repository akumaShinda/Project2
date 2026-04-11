# StreamFusion - Project Index

Complete reference guide for all files and components in the StreamFusion project.

## ?? Directory Structure

### Core Application (`app/`)
- **`layout.tsx`** - Root layout with metadata configuration
- **`page.tsx`** - Landing page with hero section and features
- **`globals.css`** - Global styles and tailwind imports
- **`error.tsx`** - Global error boundary
- **`not-found.tsx`** - 404 error page

### Authentication
- **`login/page.tsx`** - Login page with form validation
- **`api/auth/login/route.ts`** - Login API endpoint
- **`api/auth/verify/route.ts`** - Token verification endpoint

### Admin Panel (`admin/`)
- **`page.tsx`** - Main admin dashboard with user management
- **`layout.tsx`** - Admin layout wrapper
- **`users/create/page.tsx`** - Create user form
- **`users/[id]/page.tsx`** - Edit user page
- **`api/admin/users/create/route.ts`** - Create user API
- **`api/admin/users/[id]/route.ts`** - Get/update user API

### User Dashboard (`dashboard/`)
- **`page.tsx`** - Main dashboard with search and history
- **`layout.tsx`** - Dashboard layout

### Video Player (`watch/`)
- **`[id]/page.tsx`** - Video player with progress tracking
- **`layout.tsx`** - Watch layout

### API Routes (`api/`)

#### Search & Extract
- **`search/route.ts`** - Search content across providers
- **`extract/route.ts`** - Extract stream links with failover

#### Synchronization
- **`sync/history/route.ts`** - Save watch progress
- **`sync/pull/route.ts`** - Pull sync data from server
- **`sync/push/route.ts`** - Push sync data to server
- **`sync/favorites/route.ts`** - Update favorites
- **`sync/watchlist/route.ts`** - Update watchlist

### Library Files (`lib/`)

#### Core Services
- **`auth.ts`** - Authentication and user management
  - `hashPassword()` - Password hashing
  - `verifyPassword()` - Password verification
  - `generateToken()` - JWT token generation
  - `verifyToken()` - Token verification
  - `authenticateUser()` - Login logic
  - `createUser()` - User creation
  - User management functions

- **`providers.ts`** - Content provider registry
  - `ProviderRegistry` - Main orchestrator
  - `FlyxProvider` - 12-provider backend
  - `ZmovProvider` - Clean UI provider
  - `StreamWatch2Provider` - Multi-server provider
  - `AnimeProvider` - Anime streaming
  - `MovieProvider` - Movies
  - `LiveTVProvider` - Live TV
  - `DocumentaryProvider` - Documentaries
  - `SportProvider` - Sports
  - Provider failover logic
  - Cache management

- **`sync.ts`** - Cross-device synchronization
  - `SyncService` class with methods:
    - `syncWatchHistory()` - Sync watch progress
    - `pullSync()` - Pull data from server
    - `pushSync()` - Push data to server
    - `listenForUpdates()` - Real-time updates

- **`store.ts`** - Zustand state management
  - `useHistoryStore` hook with:
    - Watch history management
    - Favorites management
    - Watchlist management
    - User preferences
    - Local persistence

#### Utilities
- **`utils.ts`** - Common utility functions
  - `formatDate()` - Date formatting
  - `formatTime()` - Time formatting
  - `calculateProgress()` - Progress calculation
  - `debounce()` - Debounce function
  - `throttle()` - Throttle function
  - `getErrorMessage()` - Error handling
  - `isValidEmail()` - Email validation
  - `generateId()` - ID generation
  - `truncateText()` - Text truncation
  - Cookie management functions

- **`api-client.ts`** - HTTP client with interceptors
  - `ApiClient` class with:
    - `get()`, `post()`, `put()`, `delete()`
    - Request/response interceptors
    - Auto token injection
    - Error handling

- **`storage.ts`** - Local storage management
  - `LocalStorageManager` class with:
    - `set()`, `get()`, `remove()`, `clear()`
    - Expiration support
    - Type safety

- **`logger.ts`** - Logging utility
  - `Logger` class with:
    - Multiple log levels
    - Log filtering
    - Log export
    - Memory-efficient storage

- **`components.tsx`** - Reusable React components
  - `ProtectedRoute` - Auth check wrapper
  - `Skeleton` - Loading placeholder
  - `ErrorBoundary` - Error handler
  - `ResponsiveGrid` - Responsive layout
  - `Modal` - Dialog component
  - `Badge` - Label component
  - `Toast` - Notification component

## ?? Configuration Files

- **`package.json`** - Dependencies and scripts
- **`tsconfig.json`** - TypeScript configuration
- **`next.config.js`** - Next.js configuration
- **`tailwind.config.js`** - Tailwind CSS configuration
- **`postcss.config.js`** - PostCSS configuration
- **`.env.example`** - Environment variables template
- **`.env.local`** - Local environment variables
- **`.eslintrc.json`** - ESLint configuration
- **`.eslintignore`** - ESLint ignore patterns
- **`.gitignore`** - Git ignore patterns

## ?? Deployment

- **`Dockerfile`** - Docker container configuration
- **`docker-compose.yml`** - Docker Compose orchestration
- **`wrangler.ts`** - Cloudflare Worker code
- **`wrangler.toml`** - Cloudflare configuration

## ?? Documentation

- **`README.md`** - Main documentation
- **`QUICKSTART.md`** - Quick start guide
- **`ARCHITECTURE.md`** - System architecture
- **`API.md`** - API reference
- **`DEPLOYMENT.md`** - Deployment guide
- **`PROJECT_INDEX.md`** - This file

## ?? Admin Credentials

```
Username: Akuma
Password: SkylineR30
```

## ?? Quick Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Docker
npm run docker:build     # Build Docker image
npm run docker:run       # Run Docker container
docker-compose up        # Start with Docker Compose

# Deployment
wrangler publish         # Deploy to Cloudflare
```

## ?? Architecture Overview

```
???????????????????????????????????
?     Next.js 16 Frontend         ?
?  (React 19, TypeScript, UI)     ?
???????????????????????????????????
?     API Routes & Services       ?
?  (Authentication, Search, Sync) ?
???????????????????????????????????
?  Provider Registry + Failover   ?
?  (8 Providers with Smart Cache) ?
???????????????????????????????????
?  Firebase + Cloudflare D1       ?
?  (Real-time Sync & Storage)     ?
???????????????????????????????????
```

## ?? Data Flow

### Authentication Flow
```
Login Form ? POST /api/auth/login ? Verify Password ? Generate JWT ? Store Token
```

### Content Search Flow
```
Search Query ? POST /api/search ? Provider Registry ? Multi-provider Failover ? Cache ? Response
```

### Sync Flow
```
Local Update ? localStorage ? API ? Firebase + D1 ? All Devices Sync
```

## ?? Security

- JWT-based authentication
- Password hashing with bcryptjs (10 rounds)
- Token expiration (7 days)
- Role-based access control
- Protected API routes
- CORS configuration
- Environment variable isolation

## ?? Features by Route

| Route | Feature | Auth Required |
|-------|---------|---------------|
| `/` | Landing page | No |
| `/login` | User login | No |
| `/dashboard` | Main dashboard | Yes |
| `/watch/[id]` | Video player | Yes |
| `/admin` | Admin panel | Yes (Admin) |
| `/admin/users/create` | Create user | Yes (Admin) |
| `/admin/users/[id]` | Edit user | Yes (Admin) |

## ?? API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/verify` | Token verification |
| GET | `/api/search` | Search content |
| GET | `/api/extract` | Get stream links |
| POST | `/api/sync/history` | Save watch progress |
| GET | `/api/sync/pull` | Pull sync data |
| POST | `/api/sync/push` | Push sync data |
| POST | `/api/sync/favorites` | Update favorites |
| POST | `/api/sync/watchlist` | Update watchlist |

## ?? State Management

- **Zustand**: Global state with `useHistoryStore`
- **localStorage**: Local persistence
- **Firebase**: Real-time sync
- **Cloudflare D1**: Database storage

## ?? UI Components

- Responsive grid layouts
- Dark theme (Tailwind CSS)
- Loading skeletons
- Error boundaries
- Protected routes
- Modal dialogs
- Badge labels
- Toast notifications

## ?? Testing Strategy

- API endpoint testing
- Authentication flow
- Provider failover
- Sync mechanisms
- UI component testing
- Error handling

## ?? Performance Metrics

- Provider cache TTL: 30 minutes
- API timeout: 10 seconds
- JWT expiration: 7 days
- Max localStorage logs: 1000
- Debounce delay: 300ms

## ?? Version Control

- Git-based workflow
- `.gitignore` configured
- Environment variables separated
- Docker builds tracked

## ?? Support Resources

- See [README.md](./README.md) for full documentation
- See [QUICKSTART.md](./QUICKSTART.md) for setup help
- See [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- See [API.md](./API.md) for endpoint details
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment steps

---

**Last Updated**: 2024
**Version**: 1.0.0
**Status**: Production Ready
