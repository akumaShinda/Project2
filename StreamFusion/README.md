# StreamFusion - Advanced Streaming Platform

StreamFusion is a next-generation streaming platform that combines the best features of Flyx, zmov, and streamwatch2. Built with Next.js 16, TypeScript, and modern web technologies.

## ?? Key Features

### Core Functionality
- **12-Provider Registry**: Multi-source content aggregation with intelligent fallover
- **Live TV Support**: Stream live television channels
- **Anime Streaming**: Dedicated anime provider support
- **Cross-Device Sync**: Seamless synchronization across all your devices
- **Watch History**: Automatic tracking of your viewing progress
- **Favorites & Watchlist**: Personalized content management

### Advanced Features
- **Multi-Server Fallback**: Automatic provider failover if one goes down
- **Download Support**: Download content for offline viewing
- **Progressive Web App**: Install as a native app on your device
- **Clean UI**: Modern, responsive design with dark theme
- **Admin Panel**: Local admin controls for managing users and settings
- **Firebase Integration**: Real-time data synchronization
- **Cloudflare D1**: Secure database storage and caching

## ?? Project Structure

```
StreamFusion/
??? app/
?   ??? api/
?   ?   ??? auth/
?   ?   ?   ??? login/route.ts
?   ?   ?   ??? verify/route.ts
?   ?   ??? search/route.ts
?   ?   ??? extract/route.ts
?   ?   ??? sync/
?   ?       ??? history/route.ts
?   ?       ??? pull/route.ts
?   ?       ??? push/route.ts
?   ?       ??? favorites/route.ts
?   ?       ??? watchlist/route.ts
?   ??? admin/
?   ?   ??? page.tsx
?   ??? dashboard/
?   ?   ??? page.tsx
?   ??? login/
?   ?   ??? page.tsx
?   ??? watch/
?   ?   ??? [id]/page.tsx
?   ??? layout.tsx
?   ??? page.tsx
?   ??? globals.css
??? lib/
?   ??? auth.ts              # Authentication utilities
?   ??? providers.ts         # Provider registry with failover logic
?   ??? sync.ts              # Cross-device sync service
?   ??? store.ts             # Zustand state management
??? components/              # React components
??? package.json
??? tsconfig.json
??? next.config.js
??? tailwind.config.js
??? Dockerfile
??? docker-compose.yml
??? wrangler.ts              # Cloudflare Worker
??? wrangler.toml
??? README.md
```

## ?? Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose (optional)
- Firebase account (for real-time sync)
- Cloudflare account (for D1 and Workers)

### Installation

1. **Clone and install dependencies**:
```bash
cd StreamFusion
npm install
```

2. **Set up environment variables**:
```bash
cp .env.example .env.local
```

3. **Configure Firebase**:
- Create a Firebase project at https://firebase.google.com
- Add your credentials to `.env.local`

4. **Configure Cloudflare** (optional):
- Create a D1 database
- Create a KV namespace
- Update `wrangler.toml` with your IDs

5. **Run development server**:
```bash
npm run dev
```

Visit `http://localhost:3000`

## ?? Admin & User Management

### Local Admin Access
The platform includes a local admin panel accessible at `/admin`.

**Admin Credentials:**
- **Username**: `Akuma`
- **Password**: `SkylineR30`

### Public Link vs Local Link
- **Local Link** (`http://localhost:3000`): Admin controls, full system management
- **Public Link** (deployed URL): Regular user access with streaming features

### User Management
From the admin panel, you can:
- View all users
- Create new user accounts
- Modify user permissions
- Delete user accounts
- Configure system settings

## ?? Provider Failover Logic

The system implements intelligent failover through the `ProviderRegistry`:

```typescript
// Automatically tries providers in priority order
const result = await providerRegistry.extract(contentId, query);

// Get all available sources with fallbacks
const allResults = await providerRegistry.extractMultiple(contentId, query);
```

**8 Providers with Automatic Failover:**
1. FlyxTV (12-provider backend)
2. ZmovUI
3. StreamWatch2
4. AnimeStream
5. MovieStream
6. LiveTV
7. DocumentaryStream
8. SportStream

## ?? Cross-Device Sync Mechanism

### How It Works:
1. **Local Storage**: Initial data cached locally for offline access
2. **Firebase Realtime Database**: Real-time sync for active sessions
3. **Cloudflare D1**: Persistent storage for history and preferences
4. **Conflict Resolution**: Latest timestamp wins strategy

### Sync Points:
- Watch progress
- Favorites list
- Watchlist
- User preferences
- Stream history

### Sync Flow:
```
Device 1 Update ? Local Store ? Firebase ? D1 ? Device 2
```

## ?? API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Token verification

### Content
- `GET /api/search?q=query` - Search content
- `GET /api/extract?contentId=id` - Get stream links

### Synchronization
- `POST /api/sync/history` - Save watch history
- `GET /api/sync/pull?userId=id` - Pull sync data
- `POST /api/sync/push` - Push sync data
- `POST /api/sync/favorites` - Update favorites
- `POST /api/sync/watchlist` - Update watchlist

## ?? Docker Deployment

### Build and Run
```bash
# Build image
npm run docker:build

# Run container
npm run docker:run

# Or use docker-compose
docker-compose up
```

### Docker Compose
```bash
docker-compose up -d
```

Access at `http://localhost:3000`

## ?? Cloudflare Workers Deployment

### Setup
1. Install Wrangler: `npm install -g wrangler`
2. Authenticate: `wrangler login`
3. Configure `wrangler.toml`
4. Deploy: `wrangler publish`

### Features
- Global edge caching
- D1 database queries
- KV storage for cache
- Automatic CORS handling

## ?? Environment Variables

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project

# Cloudflare
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_token
CLOUDFLARE_D1_DB_ID=your_db_id

# Admin
ADMIN_USERNAME=Akuma
ADMIN_PASSWORD=SkylineR30

# JWT
JWT_SECRET=your_secret_key

# URLs
NEXT_PUBLIC_LOCAL_URL=http://localhost:3000
NEXT_PUBLIC_PUBLIC_URL=https://streamfusion.example.com
```

## ?? Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **State Management**: Zustand
- **Authentication**: JWT, bcryptjs
- **Database**: Firebase Realtime DB, Cloudflare D1
- **Edge**: Cloudflare Workers
- **Backend**: Next.js API Routes
- **Deployment**: Docker, Docker Compose

## ?? Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- CORS protection
- Token verification on sensitive endpoints
- Role-based access control (Admin/User)
- Secure environment variable handling

## ?? Performance Optimizations

- Provider response caching (TTL: 30 minutes)
- Local storage for offline access
- Edge caching via Cloudflare
- Lazy loading of components
- Image optimization
- Code splitting and tree shaking

## ??? Development

### Run Tests
```bash
npm run test
```

### Build for Production
```bash
npm run build
```

### Lint Code
```bash
npm run lint
```

## ?? Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run docker:build # Build Docker image
npm run docker:run   # Run Docker container
```

## ?? Troubleshooting

### Login Issues
- Clear browser cache and localStorage
- Verify admin credentials in `.env.local`
- Check JWT_SECRET is set

### Sync Not Working
- Verify Firebase credentials
- Check Cloudflare D1 connection
- Review browser console for errors

### Provider Failover
- Monitor provider status in admin panel
- Check network connectivity
- Verify provider URLs in `lib/providers.ts`

## ?? Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Cloudflare Docs](https://developers.cloudflare.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## ?? License

MIT License - See LICENSE file for details

## ?? Support

For issues, questions, or contributions:
1. Check existing documentation
2. Review API endpoint examples
3. Check browser console for errors
4. Review server logs

## ?? Roadmap

- [ ] Mobile app support
- [ ] Advanced search filters
- [ ] Recommendation engine
- [ ] Social features
- [ ] Quality auto-selection
- [ ] Subtitle management
- [ ] Multiple language support
- [ ] Advanced analytics

---

**StreamFusion v1.0.0** - Built with ?? for streaming enthusiasts
