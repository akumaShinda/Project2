# Deployment Guide

Complete guide for deploying StreamFusion to production.

## Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Cloudflare account
- Firebase account
- GitHub account (for CI/CD)

## Local Development Deployment

### 1. Setup Environment

```bash
cd StreamFusion
npm install
cp .env.example .env.local
```

### 2. Configure `.env.local`

```env
# Firebase Setup
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Admin Credentials
ADMIN_USERNAME=Akuma
ADMIN_PASSWORD=SkylineR30

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_min_32_chars

# URLs
NEXT_PUBLIC_LOCAL_URL=http://localhost:3000
NEXT_PUBLIC_PUBLIC_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

Access at: `http://localhost:3000`

Admin panel: `http://localhost:3000/admin`
- Username: `Akuma`
- Password: `SkylineR30`

## Docker Deployment

### Single Container

```bash
# Build image
npm run docker:build

# Run container
npm run docker:run
```

### Docker Compose

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Environment Override**:
```bash
ADMIN_USERNAME=Akuma ADMIN_PASSWORD=SkylineR30 docker-compose up
```

## Production Deployment

### Option 1: Vercel

1. **Push to GitHub**:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel**:
   - Visit https://vercel.com
   - Import repository
   - Add environment variables
   - Deploy

3. **Add Environment Variables** in Vercel dashboard:
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
ADMIN_USERNAME=Akuma
ADMIN_PASSWORD=SkylineR30
JWT_SECRET=your_secret_key
```

### Option 2: Self-Hosted with Docker

1. **Build and Push Image**:
```bash
docker build -t myregistry/streamfusion:latest .
docker push myregistry/streamfusion:latest
```

2. **Deploy on Server**:
```bash
# Pull latest image
docker pull myregistry/streamfusion:latest

# Run with environment
docker run -d \
  -p 3000:3000 \
  -e ADMIN_USERNAME=Akuma \
  -e ADMIN_PASSWORD=SkylineR30 \
  -e JWT_SECRET=your_secret \
  --restart always \
  myregistry/streamfusion:latest
```

3. **Setup Nginx Reverse Proxy**:
```nginx
server {
    listen 80;
    server_name streamfusion.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 3: Kubernetes

1. **Create ConfigMap**:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: streamfusion-config
data:
  ADMIN_USERNAME: "Akuma"
  NEXT_PUBLIC_LOCAL_URL: "https://streamfusion.example.com"
  NEXT_PUBLIC_PUBLIC_URL: "https://streamfusion.example.com"
```

2. **Create Secret**:
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: streamfusion-secret
type: Opaque
stringData:
  ADMIN_PASSWORD: "SkylineR30"
  JWT_SECRET: "your_secret_key"
  FIREBASE_API_KEY: "your_key"
```

3. **Create Deployment**:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: streamfusion
spec:
  replicas: 3
  selector:
    matchLabels:
      app: streamfusion
  template:
    metadata:
      labels:
        app: streamfusion
    spec:
      containers:
      - name: streamfusion
        image: myregistry/streamfusion:latest
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: streamfusion-config
        - secretRef:
            name: streamfusion-secret
        livenessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
        resources:
          requests:
            cpu: 250m
            memory: 512Mi
          limits:
            cpu: 500m
            memory: 1Gi
```

4. **Create Service**:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: streamfusion-service
spec:
  type: LoadBalancer
  selector:
    app: streamfusion
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
```

5. **Deploy**:
```bash
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```

## Cloudflare Workers Setup

### 1. Install Wrangler

```bash
npm install -g wrangler
```

### 2. Authenticate

```bash
wrangler login
```

### 3. Configure `wrangler.toml`

```toml
name = "streamfusion-worker"
main = "wrangler.ts"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "streamfusion"
database_id = "your_d1_id"

[[kv_namespaces]]
binding = "CACHE"
id = "your_kv_id"
preview_id = "your_preview_kv_id"
```

### 4. Create D1 Database

```bash
wrangler d1 create streamfusion
```

### 5. Deploy

```bash
wrangler publish
```

## Firebase Setup

### 1. Create Firebase Project

- Go to https://console.firebase.google.com
- Create new project
- Enable Authentication (Email/Password)
- Enable Realtime Database
- Enable Cloud Firestore (optional)

### 2. Get Credentials

- Project Settings ? Service Accounts
- Copy web SDK credentials

### 3. Configure Database Rules

**Realtime Database Rules**:
```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid",
        "watchHistory": {
          ".indexOn": ["timestamp"]
        }
      }
    }
  }
}
```

## SSL/TLS Certificate

### Let's Encrypt with Certbot

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d streamfusion.example.com

# Setup auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

## Monitoring & Logging

### Application Logs

```bash
# Docker Compose
docker-compose logs -f streamfusion

# Kubernetes
kubectl logs -f deployment/streamfusion

# Vercel Dashboard
https://vercel.com/dashboard
```

### Performance Monitoring

1. **Cloudflare Analytics**:
   - Dashboard ? Analytics
   - Monitor requests, errors, performance

2. **Firebase Console**:
   - Authentication ? Sign-in methods
   - Realtime Database ? Usage
   - Cloud Functions ? Logs

3. **Application Metrics**:
```typescript
// Add to your API routes
console.time('api-request');
// ... request handling ...
console.timeEnd('api-request');
```

## Backup & Recovery

### Database Backups

```bash
# D1 Backup
wrangler d1 backup create streamfusion

# Firebase Backup
# Automated daily backups in Firebase Console
```

### Restore from Backup

```bash
# D1 Restore
wrangler d1 backup restore streamfusion <backup-id>
```

## Scaling

### Horizontal Scaling

```bash
# Docker Compose - Increase replicas
docker-compose up -d --scale streamfusion=3

# Kubernetes - Scale deployment
kubectl scale deployment streamfusion --replicas=5
```

### Load Balancing

**Nginx Configuration**:
```nginx
upstream streamfusion {
    server localhost:3000;
    server localhost:3001;
    server localhost:3002;
}

server {
    listen 80;
    server_name streamfusion.example.com;

    location / {
        proxy_pass http://streamfusion;
        proxy_buffering off;
    }
}
```

## Health Checks

```bash
# Check application health
curl http://localhost:3000/api/auth/verify

# Database connectivity
curl http://localhost:3000/api/search?q=test

# Sync service
curl http://localhost:3000/api/sync/pull?userId=test
```

## Security Hardening

### 1. Environment Variables
- Use `.env.local` for development
- Use secret management in production (Vercel Secrets, Kubernetes Secrets, AWS Secrets Manager)

### 2. HTTPS Only
```nginx
# Force HTTPS
server {
    listen 80;
    server_name streamfusion.example.com;
    return 301 https://$server_name$request_uri;
}
```

### 3. CORS Configuration
```typescript
// In API routes
const cors = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_PUBLIC_URL,
  'Access-Control-Allow-Methods': 'GET, POST',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
```

### 4. Rate Limiting
```bash
# Install rate-limit middleware
npm install express-rate-limit

# Configure in API routes
import rateLimit from 'express-rate-limit';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Docker Issues
```bash
# Clear Docker cache
docker system prune -a

# Rebuild image
docker build --no-cache -t streamfusion:latest .
```

### Deployment Failures

1. Check environment variables
2. Verify Firebase/Cloudflare credentials
3. Review application logs
4. Check network connectivity

## Rollback

### Docker Image Rollback
```bash
# Tag previous version
docker tag streamfusion:current streamfusion:v1.0.0

# Switch to previous version
docker run -d -p 3000:3000 streamfusion:v1.0.0
```

### Kubernetes Rollback
```bash
# Check deployment history
kubectl rollout history deployment/streamfusion

# Rollback to previous version
kubectl rollout undo deployment/streamfusion

# Rollback to specific revision
kubectl rollout undo deployment/streamfusion --to-revision=2
```

---

For more information, see [README.md](./README.md)
