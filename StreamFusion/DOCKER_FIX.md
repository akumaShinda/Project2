# ?? Docker Build Error - Fix Guide

## ? Error You're Seeing
```
"/bin/sh -c npm ci" did not complete successfully: exit code: 1
```

## ? Solutions (Try These)

### **Solution 1: Rebuild with Updated Dockerfile (RECOMMENDED)**

I've already fixed your Dockerfile! Now run:

```sh
cd C:\Users\luciu\Documents\my-stuff\Project2\StreamFusion

# Clean everything
docker-compose down -v
docker system prune -a

# Rebuild and run
docker-compose up --build -d
```

### **Solution 2: If Still Failing, Use npm install Instead**

Edit `docker-compose.yml` and change the build context:

```yaml
services:
  streamfusion:
    build:
      context: .
      dockerfile: Dockerfile.dev
```

Create `Dockerfile.dev`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies with npm install (more forgiving)
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source
COPY . .

# Build
RUN npm run build

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["npm", "start"]
```

Then run:
```sh
docker-compose up --build -d
```

### **Solution 3: Manual Fixes**

```sh
# Remove node_modules locally
rm -r node_modules

# Regenerate package-lock.json
npm install

# Commit changes
git add package-lock.json
git commit -m "Update package-lock.json"

# Then try Docker
docker-compose up --build -d
```

---

## ?? What I Fixed

Your Dockerfile was missing:

```dockerfile
# MISSING - This was removed!
FROM node:18-alpine

# Also added legacy peer deps flag
RUN npm ci --legacy-peer-deps
```

---

## ?? Expected Timeline After Fix

```
1. docker-compose up --build -d
   ?? Starts build process

2. Building image... (first time ~2 minutes)
   ?? Pulling base image
   ?? Installing npm packages (~1 min)
   ?? Building Next.js (~45 sec)
   ?? Creating image

3. Container starts
   ?? Health check waits 60 seconds
   ?? Verifies app is running
   ?? Should show "healthy"

4. Success! ?
   ?? Visit http://localhost:3000
```

---

## ? Verify the Fix

### **Check Dockerfile**
```sh
# Should now have FROM node:18-alpine at top
cat StreamFusion/Dockerfile
```

### **Rebuild Docker**
```sh
cd StreamFusion
docker-compose down -v
docker-compose up --build -d
```

### **Monitor Build**
```sh
docker-compose logs -f
```

### **Check Health**
```sh
docker-compose ps
# Should show: STATUS: Up X minutes (healthy)
```

---

## ?? Quick Checklist

- [ ] Run `docker-compose down -v`
- [ ] Run `docker system prune -a`
- [ ] Verify Dockerfile has `FROM node:18-alpine`
- [ ] Run `docker-compose up --build -d`
- [ ] Wait 2-3 minutes for build
- [ ] Visit http://localhost:3000
- [ ] Check status: `docker-compose ps`

---

## ?? If You Still Get Errors

### **Error: "Cannot find module"**
```sh
docker-compose down
docker-compose up --build -d --force-recreate
```

### **Error: "npm ERR!"**
```sh
# Clear npm cache in Docker
docker-compose exec streamfusion npm cache clean --force
docker-compose restart
```

### **Error: "Port 3000 in use"**
```sh
# Find and kill the process
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Then try again
docker-compose up -d
```

### **Error: "Health check failed"**
```sh
# Wait longer
docker-compose logs -f
# Wait until you see "compiled client and server successfully"
```

---

## ? Once Fixed

```sh
# Stop
docker-compose down

# Start
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps

# Access
http://localhost:3000/admin
Username: Akuma
Password: SkylineR30
```

---

## ?? You're All Set!

The Dockerfile is now fixed. Just run:

```sh
docker-compose up --build -d
```

And wait for it to complete! ?

