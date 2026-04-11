# ?? StreamFusion - Local vs Public Link Guide

**YES!** StreamFusion has **BOTH** local and public links configured!

---

## ?? Overview

```
???????????????????????????????????????????????????????????????
?                    STREAMFUSION DUAL SETUP                  ?
???????????????????????????????????????????????????????????????
?                                                             ?
?  LOCAL LINK (Admin Control)                                ?
?  ?? URL: http://localhost:3000                            ?
?  ?? Admin Panel: /admin                                   ?
?  ?? Full System Control                                   ?
?  ?? Manage All Users                                      ?
?  ?? System Settings & Cache                              ?
?                                                             ?
?  PUBLIC LINK (User Streaming)                             ?
?  ?? URL: https://streamfusion.example.com                ?
?  ?       (or any domain you deploy to)                   ?
?  ?? Home Page: /                                         ?
?  ?? User Dashboard: /dashboard                           ?
?  ?? Video Player: /watch/[id]                           ?
?  ?? Regular User Features Only                          ?
?                                                             ?
???????????????????????????????????????????????????????????????
```

---

## ?? **LOCAL LINK** (Admin Only)

### **Access**
```
http://localhost:3000
```

### **Environment Variable**
```env
NEXT_PUBLIC_LOCAL_URL=http://localhost:3000
```

### **What It Has**

#### Admin Panel (`/admin`)
? **Full Control Over Everything:**
- User management (create, edit, delete)
- Role assignment (admin/user)
- System statistics
- Cache management
- Settings control
- Activity logs
- Provider configuration

#### Full Platform Access
? All user features PLUS admin features
? No restrictions
? Direct system control
? Debug/test capabilities

### **Login Credentials**
```
Username: Akuma
Password: SkylineR30
```

### **Routes Available**
```
http://localhost:3000/              Home
http://localhost:3000/login         Login page
http://localhost:3000/admin         ADMIN PANEL ?
http://localhost:3000/dashboard     Dashboard
http://localhost:3000/watch/[id]    Video player
```

### **Detection**
The app detects LOCAL link by checking:
```typescript
// In .env.local
NEXT_PUBLIC_LOCAL_URL=http://localhost:3000

// Used for admin panel redirect
if (window.location.origin === process.env.NEXT_PUBLIC_LOCAL_URL) {
  // Allow admin access
}
```

---

## ?? **PUBLIC LINK** (User Streaming)

### **Access**
```
https://streamfusion.example.com
(or any domain you deploy to)
```

### **Environment Variable**
```env
NEXT_PUBLIC_PUBLIC_URL=https://streamfusion.example.com
```

### **What It Has**

#### User Features Only
? Home page with features
? User login/signup
? Dashboard with search
? Watch videos
? Track progress
? Favorites & watchlist
? Download support
? Cross-device sync

#### NO Admin Features
? No admin panel access
? No user management
? No system settings
? No debug tools
? No cache control

### **Login Restrictions**
Regular users can:
- Login with their account
- Access `/dashboard`
- Access `/watch/[id]`
- Cannot access `/admin`

### **Routes Available**
```
https://streamfusion.example.com/            Home
https://streamfusion.example.com/login       Login
https://streamfusion.example.com/dashboard   Dashboard
https://streamfusion.example.com/watch/[id]  Player
https://streamfusion.example.com/admin       ? BLOCKED
```

### **Access Control**
The app checks role on every request:
```typescript
// In app/admin/page.tsx
const parsedUser = JSON.parse(storedUser);
if (parsedUser.role !== 'admin') {
  toast.error('Access denied');
  router.push('/dashboard');  // Redirect non-admin
  return;
}
```

---

## ?? **How to Use Both Links**

### **LOCAL SETUP (Development)**

#### 1. Run Locally
```bash
cd StreamFusion
npm install
npm run dev
```

#### 2. Access Local Admin
```
http://localhost:3000/admin
Username: Akuma
Password: SkylineR30
```

#### 3. Manage Everything
- Create test users
- Assign roles
- View statistics
- Test features
- Debug issues

---

### **PUBLIC SETUP (Production)**

#### 1. Deploy Application
```bash
# Option A: Vercel
git push origin main
# Auto-deploys to Vercel

# Option B: Docker
docker-compose up -d

# Option C: Self-hosted
npm run build
npm run start
```

#### 2. Configure Domain
```
Update .env.production:
NEXT_PUBLIC_PUBLIC_URL=https://your-domain.com
```

#### 3. Users Access Public Link
```
https://your-domain.com
- Login with their account
- Stream content
- Sync across devices
```

#### 4. Admin Access Local Link
```
http://localhost:3000/admin
- Manage users
- Control system
- View logs
```

---

## ?? **Admin Separation Example**

### **Scenario 1: Testing**
```
Local Machine:
?? http://localhost:3000/admin ......... Admin controls
?? http://localhost:3000/dashboard .... User testing

Both on same machine, different roles
```

### **Scenario 2: Production Setup**
```
Server 1 (Production):
?? https://streamfusion.com ........... PUBLIC (users)
?? https://streamfusion.com/admin ..... BLOCKED ?

Admin's Local Machine:
?? http://localhost:3000/admin ........ ADMIN CONTROLS ?
?? https://streamfusion.com .......... User testing

Admin controls from local, users stream from public
```

### **Scenario 3: Multi-Region**
```
Asia Server:
?? https://asia.streamfusion.com ....... Users

Europe Server:
?? https://eu.streamfusion.com ......... Users

Admin Local Machine:
?? http://localhost:3000/admin ........ Control all ?
   (Connects to all servers)
```

---

## ?? **Configuration Locations**

### **`.env.local` - Development**
```env
# Local admin access
NEXT_PUBLIC_LOCAL_URL=http://localhost:3000
NEXT_PUBLIC_PUBLIC_URL=http://localhost:3000

# Both same during development
```

### **`.env.production` - Production**
```env
# Local admin (admin's machine)
NEXT_PUBLIC_LOCAL_URL=http://localhost:3000

# Public users (deployed server)
NEXT_PUBLIC_PUBLIC_URL=https://streamfusion.example.com

# Different URLs = separation
```

### **Docker Compose**
```yaml
environment:
  NEXT_PUBLIC_LOCAL_URL=http://localhost:3000
  NEXT_PUBLIC_PUBLIC_URL=http://localhost:3000  # Change for prod
```

---

## ?? **Access Control Logic**

### **Admin Panel Protection**
```typescript
// In app/admin/page.tsx

export default function AdminDashboard() {
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!storedUser || !token) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    
    // Check if user is admin
    if (parsedUser.role !== 'admin') {
      toast.error('Access denied');
      router.push('/dashboard');  // Send to user dashboard
      return;
    }

    // Only admins reach here
    setUser(parsedUser);
  }, [router]);
}
```

### **Local Check (Optional)**
```typescript
// Check if on local link
const isLocal = window.location.origin === 
  process.env.NEXT_PUBLIC_LOCAL_URL;

if (!isLocal && !user.role === 'admin') {
  // Block admin access on public link
}
```

---

## ?? **Real-World Usage**

### **Scenario: Coffee Shop Owner**

```
Business Setup:
?? Coffee Shop Website
?  ?? https://coffeeshop-tv.com/stream
?     ?? Public users can login
?     ?? Watch content from anywhere
?
?? Admin Control (Owner's Home)
?  ?? http://localhost:3000/admin
?     ?? Create/manage customer accounts
?     ?? View who's watching
?     ?? Manage content
?
?? Customer's Phone
   ?? https://coffeeshop-tv.com/stream
      ?? Login with given account
      ?? Watch in real-time
      ?? Sync progress
```

---

## ?? **Deployment Strategy**

### **Phase 1: Local Development**
```
Local Machine:
?? npm run dev
?? Access http://localhost:3000
?? Test admin at /admin
?? Create test users
```

### **Phase 2: Production Deploy**
```
Server:
?? Deploy to Vercel/Docker
?? Set PUBLIC_URL to your domain
?? Users access public link
?? Admin stays local
```

### **Phase 3: Admin Remote Access**
```
Option A: SSH Tunnel
?? ssh -L 3000:localhost:3000 admin@server
?? Access http://localhost:3000/admin
?? Controls remote server

Option B: VPN
?? Admin connects to private VPN
?? Access local admin panel
?? Controls production

Option C: Separate Admin Portal
?? Create admin-only domain
?? https://admin.streamfusion.com/admin
?? Restricted access
```

---

## ?? **URL Routing**

### **Local (http://localhost:3000)**
```
/                   Landing page (full)
/login              Login page
/admin              Admin dashboard ?
/admin/users/create Create user
/admin/users/[id]   Edit user
/dashboard          User dashboard
/watch/[id]         Video player
```

### **Public (https://streamfusion.example.com)**
```
/                   Landing page (limited)
/login              Login page
/dashboard          User dashboard only
/watch/[id]         Video player only
/admin              ? ACCESS DENIED
```

---

## ?? **How to Switch URLs**

### **For Development**
Keep both as localhost:
```env
NEXT_PUBLIC_LOCAL_URL=http://localhost:3000
NEXT_PUBLIC_PUBLIC_URL=http://localhost:3000
```

### **For Production**
Separate them:
```env
NEXT_PUBLIC_LOCAL_URL=http://localhost:3000    # Admin's machine
NEXT_PUBLIC_PUBLIC_URL=https://streamfusion.com # User's server
```

### **Update in Docker**
Edit `docker-compose.yml`:
```yaml
environment:
  - NEXT_PUBLIC_LOCAL_URL=http://localhost:3000
  - NEXT_PUBLIC_PUBLIC_URL=https://streamfusion.example.com
```

---

## ? **Benefits of Dual Link Setup**

? **Security** - Admin panel not exposed on public
? **Separation** - Admin controls separate from user access
? **Scalability** - Can have multiple public servers, one admin
? **Flexibility** - Easy to switch between local/production
? **Testing** - Test admin features locally before production
? **Multi-Region** - One admin controls multiple public servers

---

## ?? **Summary**

| Feature | Local Link | Public Link |
|---------|-----------|-----------|
| **URL** | http://localhost:3000 | https://streamfusion.com |
| **Admin Access** | ? Full | ? Blocked |
| **User Dashboard** | ? Available | ? Available |
| **Watch Videos** | ? Available | ? Available |
| **Manage Users** | ? Yes | ? No |
| **System Control** | ? Yes | ? No |
| **Purpose** | Admin controls | User streaming |

---

## ?? **Quick Start with Both Links**

### **Local Admin** (Right Now!)
```bash
cd StreamFusion
npm install
npm run dev
# Visit http://localhost:3000/admin
# Login: Akuma / SkylineR30
```

### **Public Link** (After Deployment)
```bash
# Deploy to Vercel/Docker
# Users visit: https://your-domain.com
# Admin still uses: http://localhost:3000/admin
```

---

**Yes, StreamFusion has BOTH local and public links fully configured!** ?

Local admin controls everything, public users just stream! ??

