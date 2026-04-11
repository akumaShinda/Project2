# StreamFusion Architecture Guide

## System Overview

StreamFusion is built on a multi-layered architecture designed for scalability, reliability, and user experience.

```
???????????????????????????????????????????????????????????????
?                    User Interface Layer                      ?
?  (Next.js Frontend - React 19, TypeScript, Tailwind CSS)     ?
???????????????????????????????????????????????????????????????
                   ?
???????????????????????????????????????????????????????????????
?                  API Layer                                   ?
?  (Next.js Routes - Authentication, Search, Sync)             ?
???????????????????????????????????????????????????????????????
                   ?
        ???????????????????????
        ?          ?          ?
?????????????? ??????????? ?????????????????
?  Provider  ? ? Sync    ? ? Admin Panel   ?
?  Registry  ? ? Service ? ? & Auth        ?
?????????????? ??????????? ?????????????????
        ?         ?          ?
????????????????????????????????????????????
?           Edge & Database Layer           ?
?  (Cloudflare Workers, D1, Firebase)       ?
????????????????????????????????????????????
```

## Component Deep Dive

### 1. Authentication System

**File**: `lib/auth.ts`

**Features**:
- Username/password authentication
- JWT token generation and verification
- Password hashing with bcryptjs
- In-memory user store (can be replaced with database)
- Admin user initialization

**Flow**:
```typescript
User Input ? hashPassword() ? verifyPassword() ? generateToken() ? Client Storage
```

**Security**:
- Passwords hashed with 10 salt rounds
- JWT tokens expire after 7 days
- Server-side token verification required
- Role-based access control (admin/user)

### 2. Provider Registry

**File**: `lib/providers.ts`

**Architecture**:
```
ProviderRegistry (Main Orchestrator)
??? FlyxProvider (12-provider backend)
??? ZmovProvider (Clean UI)
??? StreamWatch2Provider (Multi-server)
??? AnimeProvider
??? MovieProvider
??? LiveTVProvider
??? DocumentaryProvider
??? SportProvider
```

**Failover Logic**:
```typescript
// Tries providers in priority order until successful
for (const provider of providers) {
  try {
    const result = await provider.extract(contentId, query);
    if (result) return result; // Success - return immediately
  } catch (error) {
    continue; // Try next provider
  }
}
```

**Caching Strategy**:
- TTL: 30 minutes (configurable)
- Cache key: `{ProviderName}:{contentId}`
- Automatic cache invalidation after TTL

### 3. Cross-Device Sync

**File**: `lib/sync.ts`

**Sync Data Structure**:
```typescript
{
  userId: string;
  watchHistory: Array<{contentId, timestamp, progress}>;
  favorites: string[];
  watchlist: string[];
  settings: UserPreferences;
  lastSyncTime: number;
}
```

**Sync Mechanism**:

1. **Write Path**:
   ```
   Client Update ? Local Storage ? Firebase ? D1 ? All Devices
   ```

2. **Read Path**:
   ```
   /api/sync/pull ? Check D1 ? Return Latest ? Client Cache
   ```

3. **Real-time**:
   ```
   Firebase.onValue() ? Listen for Changes ? Update UI
   ```

**Conflict Resolution**:
- Last-write-wins strategy
- Timestamp-based comparison
- Device-level priority rules

### 4. State Management

**File**: `lib/store.ts`

**Zustand Store Structure**:
```typescript
{
  history: WatchHistoryItem[];        // Watch history
  favorites: string[];                // Favorite content IDs
  watchlist: string[];                // Content to watch later
  preferences: UserPreferences;       // User settings
  userId: string | null;              // Current user ID
}
```

**Actions**:
- `addToHistory()` - Add or update watch history
- `addToFavorites()` - Add to favorites
- `addToWatchlist()` - Add to watchlist
- `updatePreferences()` - Update user settings
- `loadFromSync()` - Load from server sync

### 5. API Routes

#### Authentication Routes
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/verify` - Verify JWT token

#### Search & Extract
- `GET /api/search?q=query` - Search with provider failover
- `GET /api/extract?contentId=id` - Get all available streams

#### Synchronization
- `POST /api/sync/history` - Save watch progress
- `GET /api/sync/pull` - Get synced data
- `POST /api/sync/push` - Save all sync data
- `POST /api/sync/favorites` - Update favorites
- `POST /api/sync/watchlist` - Update watchlist

## Database Schema (D1)

```sql
-- User table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME
);

-- Sync data table
CREATE TABLE user_sync (
  user_id TEXT PRIMARY KEY,
  data JSON NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Watch history
CREATE TABLE watch_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  content_id TEXT NOT NULL,
  progress INTEGER,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Cloudflare Worker Edge Logic

**File**: `wrangler.ts`

**Features**:
- Global request handling
- D1 database queries
- KV cache storage
- CORS management
- Request routing

**Edge Cache Strategy**:
```
Client Request
    ?
Worker (Check KV Cache)
    ?? Cache Hit ? Return cached response
    ?? Cache Miss
        ?
    Query Database/API
        ?
    Store in KV (1-hour TTL)
        ?
    Return response
```

## Component Hierarchy

```
App/
??? Layout (Root)
?   ??? Header
?   ??? Page Router
?   ??? Footer
??? Pages
?   ??? Login
?   ?   ??? LoginForm
?   ?   ??? BrandingSection
?   ??? Dashboard
?   ?   ??? SearchBar
?   ?   ??? ContinueWatching
?   ?   ??? Favorites
?   ?   ??? Recommendations
?   ??? Watch
?   ?   ??? VideoPlayer
?   ?   ??? ProgressBar
?   ?   ??? QualitySelector
?   ?   ??? DownloadButton
?   ??? Admin
?       ??? UserTable
?       ??? StatsPanel
?       ??? SettingsPanel
??? API Routes (Backend)
```

## Data Flow Examples

### Watch History Flow
```
User clicks video
    ?
Video Player mounted
    ?
onProgress() triggered every 1s
    ?
useHistoryStore.addToHistory()
    ?
Local Storage updated
    ?
SyncService.syncWatchHistory()
    ?
POST /api/sync/history
    ?
Firebase update + D1 insert
```

### Provider Extraction Flow
```
User searches "Movie Name"
    ?
GET /api/search?q=Movie+Name
    ?
providerRegistry.extract()
    ?
Loop through 8 providers
    ?? FlyxTV.extract() ? try providers 1-12
    ?? ZmovUI.extract() ? fallback
    ?? StreamWatch2.extract() ? fallback
    ?? ... (other providers)
    ?
First successful provider returns
    ?
Cache result (30 min TTL)
    ?
Return to client
```

### Admin Control Flow
```
Admin Login
    ?
POST /api/auth/login (Akuma/SkylineR30)
    ?
verifyPassword() ? bcrypt compare
    ?
generateToken() ? JWT signed
    ?
Token + User data returned
    ?
Stored in localStorage
    ?
Redirect to /admin
    ?
Admin Dashboard loads
    ?
Fetch user list
    ?
Display management interface
```

## Performance Considerations

### Caching Layers
1. **Browser Cache**: localStorage for instant access
2. **Provider Cache**: In-memory, 30-minute TTL
3. **Edge Cache**: Cloudflare KV, 1-hour TTL
4. **Database Cache**: D1 persistent storage

### Optimization Strategies
- Lazy load components
- Image optimization with Next.js Image
- Code splitting by route
- Gzip compression
- CDN distribution via Cloudflare

### Monitoring
- Provider response times
- Cache hit/miss ratios
- Sync error tracking
- API latency metrics

## Scalability Path

### Phase 1 (Current)
- Single server deployment
- Local admin
- Firebase + D1

### Phase 2
- Multiple server instances
- Load balancing
- Redis for distributed cache
- Kubernetes orchestration

### Phase 3
- Multi-region deployment
- Advanced caching strategies
- Microservices architecture
- Real-time analytics

## Security Architecture

```
Request
    ?
Middleware (Auth check)
    ?
Route Handler
    ?? Verify JWT token
    ?? Check user role
    ?? Validate input
    ?? Execute logic
    ?
Response (Secure headers)
```

**Security Headers**:
- `Content-Security-Policy`
- `X-Frame-Options`
- `X-Content-Type-Options`
- `Strict-Transport-Security`

## Deployment Architecture

```
Development
    ?
Docker Build
    ?
Docker Registry
    ?
Deployment
?? Docker Compose (Development)
?? Kubernetes (Production)
?? Vercel (Edge)
    ?
Cloudflare Workers
    ?
Global CDN
```

---

For more information, see [README.md](./README.md)
