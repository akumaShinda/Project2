# StreamFusion - Complete Setup & Configuration Guide

## ?? Project Overview

**StreamFusion** is a Next.js 16-based streaming platform that combines features from Flyx, zmov, and streamwatch2. It includes:

- ? 12-provider content registry with intelligent failover
- ? Live TV and anime streaming support
- ? Cross-device synchronization
- ? Admin panel with user management (local)
- ? Public user dashboard with watch history
- ? Multi-server fallback support
- ? Download capability
- ? Progressive Web App support
- ? Firebase real-time sync
- ? Cloudflare D1 database integration

## ?? Default Admin Account

```
Username: Akuma
Password: SkylineR30
```

This admin account controls all users on both **Local Link** (admin panel) and **Public Link** (streaming platform).

## ?? Installation

### Step 1: Install Dependencies

```bash
cd StreamFusion
npm install
```

### Step 2: Configure Environment

The `.env.local` file is pre-configured for local development:

```env
ADMIN_USERNAME=Akuma
ADMIN_PASSWORD=SkylineR30
JWT_SECRET=dev_secret_key_123456789
NEXT_PUBLIC_LOCAL_URL=http://localhost:3000
NEXT_PUBLIC_PUBLIC_URL=http://localhost:3000
```

### Step 3: Start Development Server

```bash
npm run dev
```

Access the application:
- **Home**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Dashboard**: http://localhost:3000/dashboard
- **Login**: http://localhost:3000/login

## ??? Project Architecture

### Three Access Levels

#### 1. **Public Access** (No Login)
- Home page with features overview
- Login page
- Sign up information

#### 2. **User Access** (Login Required)
- Personal dashboard (`/dashboard`)
- Search content
- Watch videos (`/watch/[id]`)
- View watch history
- Manage favorites and watchlist
- Cross-device sync

#### 3. **Admin Access** (Admin Login Required)
- Admin dashboard (`/admin`) - Local only
- User management
- Create/edit/delete users
- System settings
- Statistics and analytics

### Authentication System

**Local Link Admin Controls**:
- Access at: `http://localhost:3000/admin`
- Default credentials: `Akuma` / `SkylineR30`
- Manages all accounts on local and public instances
- Full system control

**Public Link User Access**:
- Access at: `https://streamfusion.example.com`
- Regular user accounts created by admin
- Streaming and watch history features
- No admin panel access

## ?? Provider Failover System

The platform includes 8 content providers with automatic failover:

1. **FlyxTV** (12-provider backend)
2. **ZmovUI** (Clean interface)
3. **StreamWatch2** (Multi-server)
4. **AnimeProvider** (Anime)
5. **MovieProvider** (Movies)
6. **LiveTVProvider** (Live TV)
7. **DocumentaryProvider** (Documentaries)
8. **SportProvider** (Sports)

**How it works**:
- User searches for content
- System tries providers in priority order
- First successful provider returns results
- Results cached for 30 minutes
- If provider fails, automatically tries next one

## ?? Synchronization System

### Real-time Sync Mechanism

```
Device 1 Update
    ?
Local Storage (immediate)
    ?
Firebase Realtime (seconds)
    ?
Cloudflare D1 (persistent)
    ?
Device 2 Pulls Latest Data
```

**Synced Data**:
- Watch history with progress
- Favorites list
- Watchlist
- User preferences (quality, theme, language)
- Last sync timestamp

## ?? File Organization

### Core Directories

```
StreamFusion/
??? app/                 # Next.js App Router
?   ??? api/            # API routes
?   ??? admin/          # Admin panel
?   ??? dashboard/      # User dashboard
?   ??? watch/          # Video player
?   ??? login/          # Login page
?   ??? layout.tsx      # Root layout
??? lib/                # Utilities and services
?   ??? auth.ts         # Authentication
?   ??? providers.ts    # Provider registry
?   ??? sync.ts         # Synchronization
?   ??? store.ts        # State management
?   ??? utils.ts        # Helpers
?   ??? logger.ts       # Logging
?   ??? storage.ts      # Local storage
?   ??? api-client.ts   # HTTP client
?   ??? components.tsx  # Reusable components
??? public/             # Static files
??? docker-compose.yml  # Docker setup
??? wrangler.ts         # Cloudflare Worker
```

## ?? Development Workflow

### 1. Local Development

```bash
npm run dev
```

- Hot reload enabled
- API routes work locally
- Logs displayed in terminal

### 2. Building for Production

```bash
npm run build
npm run start
```

### 3. Linting Code

```bash
npm run lint
```

## ?? Docker Deployment

### Single Container

```bash
npm run docker:build
npm run docker:run
```

### Docker Compose

```bash
docker-compose up -d
```

Access at: http://localhost:3000

## ?? Production Deployment

### Option 1: Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Auto-deploys on push

### Option 2: Self-Hosted

```bash
docker build -t streamfusion:latest .
docker run -d -p 3000:3000 streamfusion:latest
```

### Option 3: Kubernetes

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full K8s setup

## ?? Environment Variables

### Required for Development
```env
ADMIN_USERNAME=Akuma
ADMIN_PASSWORD=SkylineR30
JWT_SECRET=your_secret_key_min_32_chars
```

### Optional for Production
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
CLOUDFLARE_ACCOUNT_ID=your_id
CLOUDFLARE_API_TOKEN=your_token
```

## ?? API Reference

### Authentication

**Login**:
```bash
POST /api/auth/login
{
  "username": "Akuma",
  "password": "SkylineR30"
}
```

**Verify Token**:
```bash
POST /api/auth/verify
{
  "token": "jwt_token_here"
}
```

### Content

**Search**:
```bash
GET /api/search?q=Inception&type=movie
```

**Extract**:
```bash
GET /api/extract?contentId=movie-inception
```

### Sync

**Save Progress**:
```bash
POST /api/sync/history
{
  "userId": "user-001",
  "contentId": "movie-inception",
  "progress": 50
}
```

Full API docs: See [API.md](./API.md)

## ?? Common Tasks

### Create a New User

1. Login as admin at `/admin`
2. Click "Add User"
3. Fill in username, email, password
4. Select role (user or admin)
5. Click "Create User"

### Search for Content

1. Go to `/dashboard`
2. Enter search query
3. Results appear with provider info
4. Click to watch

### Watch Video

1. Click video from search results
2. Video player opens
3. Click play button
4. Progress auto-saves
5. Add to favorites if desired

### Check Watch History

1. Go to `/dashboard`
2. "Continue Watching" section shows recent videos
3. Progress bar indicates how far you watched
4. Click to resume

### Sync Across Devices

1. Login with same account on different device
2. Your watch history automatically appears
3. Favorites sync in real-time
4. Settings apply everywhere

## ?? Security Best Practices

1. **Change Default Password**:
   - Login as Akuma
   - Go to settings
   - Change password immediately

2. **Use HTTPS in Production**:
   - Never deploy without SSL/TLS
   - Use Let's Encrypt for free certificates

3. **Secure Environment Variables**:
   - Never commit `.env.local`
   - Use secret management tools
   - Rotate JWT secret regularly

4. **Admin Panel Access**:
   - Only accessible on local link
   - Protected by role-based access
   - Audit all admin actions

## ?? Troubleshooting

### Port 3000 Already in Use
```bash
lsof -i :3000        # Find process
kill -9 <PID>        # Kill process
```

### Build Fails
```bash
rm -rf node_modules .next
npm install
npm run build
```

### Sync Not Working
- Check Firebase credentials in `.env.local`
- Verify Cloudflare D1 connection
- Check browser console for errors

### Provider Not Working
- Check network connectivity
- Verify provider URLs in `lib/providers.ts`
- System auto-retries with next provider

## ?? Performance Optimization

- Provider cache: 30 minutes
- Database queries: Indexed
- API responses: Gzipped
- Images: Optimized with next/image
- Code splitting: By route
- Edge caching: Via Cloudflare

## ?? Documentation Index

- **[README.md](./README.md)** - Main documentation
- **[QUICKSTART.md](./QUICKSTART.md)** - 5-minute setup
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System design
- **[API.md](./API.md)** - API endpoints
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production setup
- **[PROJECT_INDEX.md](./PROJECT_INDEX.md)** - File reference
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - This file

## ?? Contributing

1. Create feature branch
2. Make changes
3. Run tests: `npm run test`
4. Submit pull request

## ?? License

MIT License - See LICENSE file

## ?? Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Cloudflare Docs](https://developers.cloudflare.com)

## ?? Getting Help

1. **Check Documentation**: Start with README.md
2. **Review Logs**: Check browser console and terminal
3. **Verify Configuration**: Ensure .env.local is correct
4. **Test Connectivity**: Try API endpoints manually
5. **Review Code**: Check relevant source files

## ?? You're All Set!

Your StreamFusion instance is ready to use. Start by:

1. Visiting http://localhost:3000
2. Logging in with admin credentials
3. Creating a test user
4. Searching for content
5. Playing a video

Enjoy streaming! ??

---

**StreamFusion v1.0.0** | Built with ?? for streaming enthusiasts | 2024
