# Laravel Forge Deployment Fix Instructions

## Problem
Forge deployment is failing due to divergent git branches. The deployment server has an old commit (`bad5625`) that conflicts with the current remote commit (`a01ad3c`).

## Solution Options

### Option 1: Update Forge Deployment Script (Recommended)
If you have access to Forge dashboard:

1. Go to your site in Forge dashboard
2. Click on "Deploy Script" tab
3. Replace the deployment script with the following:

```bash
cd /home/forge/banyanclaims.com
git fetch origin
git reset --hard origin/main
git clean -fd
npm install
npm run build
```

This will reset the git state before building, avoiding the divergent branches issue.

### Option 2: SSH into Server (If you have SSH access)
Run these commands on the Forge server:

```bash
cd /home/forge/banyanclaims.com
git fetch origin
git reset --hard origin/main
git clean -fd
```

Then trigger a new deployment from Forge dashboard.

### Option 3: Update Node.js Version in Forge
Also ensure Node.js version is set to 20.x in Forge:
1. Go to site settings
2. Set Node.js version to 20.x (or 20.9.0+)
3. Save and redeploy

### Option 4: Disconnect and Reconnect Repository
1. Go to site settings in Forge
2. Disconnect the Git repository
3. Reconnect it
4. This will create a fresh clone and resolve the divergent branches

## Current Repository Status
- Repository is clean and correct
- All commits are properly pushed
- The issue is only on the deployment server's local git state

