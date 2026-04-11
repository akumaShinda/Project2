# ?? StreamFusion - Batch Files Guide

I've created 6 batch files to make running StreamFusion super easy on Windows!

---

## ?? All Batch Files

| File | What It Does |
|------|-------------|
| **run.bat** | Start StreamFusion (main one) |
| **run-stop.bat** | Stop the container |
| **run-restart.bat** | Restart the container |
| **run-logs.bat** | View live logs |
| **run-status.bat** | Check container status |
| **run-clean.bat** | Complete cleanup |

---

## ?? **Quick Start**

### **Method 1: Double-Click (Easiest!)**

1. Navigate to: `C:\Users\luciu\Documents\my-stuff\Project2\StreamFusion`
2. **Double-click `run.bat`**
3. Wait for it to complete (~60 seconds)
4. Browser opens automatically to admin panel
5. Login with: `Akuma` / `SkylineR30`

### **Method 2: Command Line**

```cmd
cd C:\Users\luciu\Documents\my-stuff\Project2\StreamFusion
run.bat
```

---

## ?? What Each Batch File Does

### **1. run.bat** (START)
```cmd
run.bat
```

**Does:**
- ? Checks if Docker is installed
- ? Checks if Docker Desktop is running
- ? Cleans up old containers
- ? Builds and starts Docker
- ? Waits for health check (healthy)
- ? Opens browser to admin panel
- ? Shows you all the URLs

**Output:**
```
====================================================
  SUCCESS! StreamFusion is starting...
====================================================

Home Page:      http://localhost:3000
Admin Panel:    http://localhost:3000/admin
Dashboard:      http://localhost:3000/dashboard

Login Credentials:
  Username: Akuma
  Password: SkylineR30
```

---

### **2. run-stop.bat** (STOP)
```cmd
run-stop.bat
```

**Does:**
- ? Stops all containers
- ? Removes volumes

**Use when:**
- You want to shut down the app
- You're done working for the day
- You need to free up resources

---

### **3. run-restart.bat** (RESTART)
```cmd
run-restart.bat
```

**Does:**
- ? Restarts the Docker container
- ? Keeps data intact
- ? Much faster than stopping and starting

**Use when:**
- App is acting weird
- You made code changes
- You need to refresh everything

---

### **4. run-logs.bat** (VIEW LOGS)
```cmd
run-logs.bat
```

**Does:**
- ? Shows real-time Docker logs
- ? Helps debug issues
- ? Press Ctrl+C to exit

**Use when:**
- App is crashing
- Something isn't working
- You want to see what's happening inside Docker
- You see errors in browser

**Example log output:**
```
streamfusion  | > streamfusion@1.0.0 start
streamfusion  | > next start
streamfusion  | 
streamfusion  | > ready - started server on 0.0.0.0:3000, url: http://localhost:3000
streamfusion  | ? Next.js 16.0.0
```

---

### **5. run-status.bat** (CHECK STATUS)
```cmd
run-status.bat
```

**Does:**
- ? Shows if container is running
- ? Shows container status (healthy/exited)
- ? Shows Docker version

**Output:**
```
Container Status:

NAME              STATUS              PORTS
streamfusion      Up 5 minutes        0.0.0.0:3000->3000/tcp (healthy)
```

---

### **6. run-clean.bat** (FULL CLEANUP)
```cmd
run-clean.bat
```

**Does:**
- ? Stops all containers
- ? Removes all volumes
- ? Removes unused images
- ? Complete fresh start

**Use when:**
- You want a completely fresh start
- You're experiencing persistent errors
- You want to free up disk space

**WARNING:** This removes everything, so you'll need to rebuild next time!

---

## ?? **Common Workflows**

### **Workflow 1: Start Fresh (First Time)**
```cmd
run.bat
```
Wait ~60 seconds, browser opens. Done! ?

### **Workflow 2: Daily Use**
```cmd
# Morning - Start app
run.bat

# ... use app ...

# Evening - Stop app
run-stop.bat
```

### **Workflow 3: Troubleshooting**
```cmd
# Something wrong?
run-logs.bat
# Read logs, find error
# Press Ctrl+C

# Restart
run-restart.bat

# Check if fixed
# If not, try clean restart:
run-clean.bat
run.bat
```

### **Workflow 4: Check Everything**
```cmd
run-status.bat
```

---

## ?? **File Locations**

All batch files are in:
```
C:\Users\luciu\Documents\my-stuff\Project2\StreamFusion\
```

You can also access them from:
- File Explorer - Navigate to folder, double-click `.bat`
- Command Prompt - `cd` to folder and run
- Windows Terminal - Same as Command Prompt

---

## ?? **Troubleshooting**

### **Issue: "Docker is not installed"**
```
ERROR: Docker is not installed or not in PATH
```

**Fix:**
1. Download: https://www.docker.com/products/docker-desktop
2. Install Docker Desktop
3. Restart your computer
4. Run `run.bat` again

---

### **Issue: "Docker Desktop is not running"**
```
ERROR: Docker Desktop is not running
```

**Fix:**
1. Open Docker Desktop application
2. Wait for it to start (show icon in system tray)
3. Run `run.bat` again

---

### **Issue: Container won't start**
```
ERROR: Docker container failed to start
```

**Fix:**
1. Run `run-logs.bat` to see what's wrong
2. Run `run-clean.bat` for fresh start
3. Run `run.bat` again

---

### **Issue: Port 3000 already in use**
```
Error response from daemon: Ports are not available
```

**Fix:**
1. Run `run-stop.bat` to stop StreamFusion
2. Find what else uses port 3000:
   ```cmd
   netstat -ano | findstr :3000
   ```
3. Kill that process:
   ```cmd
   taskkill /PID <PID> /F
   ```
4. Run `run.bat` again

---

## ?? **Pro Tips**

### **Create Shortcut for Easy Access**
1. Right-click `run.bat`
2. Send to ? Desktop (create shortcut)
3. Now just double-click desktop icon to start!

### **Pin to Quick Access**
1. In File Explorer, go to StreamFusion folder
2. Right-click ? Pin to Quick Access
3. Easier to find next time

### **Autostart on Boot** (Optional)
1. Create shortcut to `run.bat`
2. Press Win+R, type: `shell:startup`
3. Paste shortcut into Startup folder
4. StreamFusion starts automatically when you boot!

---

## ?? **Next Steps**

### **Right Now:**
```cmd
cd C:\Users\luciu\Documents\my-stuff\Project2\StreamFusion
run.bat
```

### **When Prompted:**
- Browser opens automatically
- Login: `Akuma` / `SkylineR30`
- Explore the admin panel

### **To Stop Later:**
```cmd
run-stop.bat
```

### **Tomorrow:**
```cmd
run.bat
```

---

## ?? **File Contents**

All batch files are:
- ? Simple and easy to understand
- ? Error-checked (handles Docker errors)
- ? Auto-open browser when ready
- ? Show helpful messages
- ? Press any key to exit

---

## ? **Summary**

You now have:

| Command | Purpose |
|---------|---------|
| `run.bat` | Start everything |
| `run-stop.bat` | Stop everything |
| `run-restart.bat` | Restart quickly |
| `run-logs.bat` | Debug/see logs |
| `run-status.bat` | Check if running |
| `run-clean.bat` | Full cleanup |

**Just double-click `run.bat` and you're done!** ??

---

**No more complex commands. Just click and go!** ?
