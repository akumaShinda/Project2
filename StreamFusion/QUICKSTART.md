# Quick Start Guide

Get StreamFusion up and running in 5 minutes!

## 1. Installation

```bash
cd StreamFusion
npm install
```

## 2. Environment Setup

```bash
cp .env.example .env.local
```

The `.env.local` file already has pre-configured values for local development.

## 3. Start Development Server

```bash
npm run dev
```

## 4. Access the Application

- **Home Page**: http://localhost:3000
- **Login Page**: http://localhost:3000/login
- **Admin Panel**: http://localhost:3000/admin
- **Dashboard**: http://localhost:3000/dashboard

## 5. Default Admin Credentials

```
Username: Akuma
Password: SkylineR30
```

## Project Structure

```
StreamFusion/
??? app/                    # Next.js App Router
?   ??? api/               # API routes
?   ??? admin/             # Admin panel pages
?   ??? dashboard/         # User dashboard
?   ??? watch/             # Video player page
?   ??? login/             # Login page
??? lib/                   # Shared utilities
?   ??? auth.ts           # Authentication
?   ??? providers.ts      # Provider registry
?   ??? sync.ts           # Sync service
?   ??? store.ts          # State management
??? components/           # React components
??? public/               # Static files
??? package.json         # Dependencies
```

## Available Scripts

```bash
npm run dev              # Start dev server (hot reload)
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run docker:build     # Build Docker image
npm run docker:run       # Run Docker container
```

## Key Features to Try

### 1. Login
- Navigate to http://localhost:3000/login
- Use admin credentials or create a new user account

### 2. Search Content
- Search for movies or shows from the dashboard
- The system tries multiple providers automatically

### 3. Watch Video
- Click on a search result to watch
- Progress is automatically saved
- Add to favorites or watchlist

### 4. Admin Panel
- Access at http://localhost:3000/admin (admin only)
- Manage users
- View system statistics
- Configure settings

### 5. Cross-Device Sync
- Your watch history syncs across devices
- Favorites and preferences are saved to the cloud

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -i :3000          # macOS/Linux
netstat -ano | grep 3000  # Windows
```

### Dependencies Issues
```bash
rm -rf node_modules
npm install
```

### Clear Cache
```bash
rm -rf .next
npm run dev
```

## Next Steps

1. **Configure Firebase**:
   - Update `NEXT_PUBLIC_FIREBASE_*` in `.env.local`
   - Enable Realtime Database in Firebase Console

2. **Setup Cloudflare** (optional):
   - Create D1 database
   - Create KV namespace
   - Update `wrangler.toml`

3. **Deploy to Production**:
   - See [DEPLOYMENT.md](./DEPLOYMENT.md)
   - Vercel, Docker, or Kubernetes

## Documentation

- [README.md](./README.md) - Full documentation
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [API.md](./API.md) - API reference
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide

## Support

For issues:
1. Check browser console for errors
2. Review server logs in terminal
3. Check `.env.local` configuration
4. See troubleshooting in README

---

**Happy Streaming! ??**
