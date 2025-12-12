# Laravel Forge Deployment Fix Instructions

## ⚠️ URGENT: This Must Be Fixed in Forge Dashboard

**You cannot fix this from GitHub.** The Forge server has a local git state that conflicts with the remote repository. Someone with Forge access must update the deployment script.

## Problem
Forge deployment is failing due to divergent git branches. The deployment server's `git pull` command fails because:
- Server has commit `bad5625` locally
- Remote has different commits (force push after amending)
- Git doesn't know how to reconcile them

**Error:** `fatal: Need to specify how to reconcile divergent branches`

## ✅ Solution: Update Forge Deployment Script (REQUIRED)

### Step 1: Access Forge Dashboard
1. Log into Laravel Forge
2. Select your site: **banyanclaims.com**
3. Click on the **"Deploy Script"** tab

### Step 2: Replace the Deployment Script
**Copy the script from `FORGE_DEPLOY_SCRIPT.txt` in this repository**, or use:

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

### Option 3: Update Node.js Version in Forge (REQUIRED)
**This must be done manually in Forge dashboard:**
1. Go to site settings in Forge
2. Find "Node Version" or "Node.js Version" setting
3. Set Node.js version to **20.x** (or latest 20.x available)
4. Save settings
5. Redeploy

**Note:** Repository files (`.nvmrc`, `.node-version`, `package.json` engines) are already configured, but Forge may still require manual dashboard configuration.

### Option 4: Disconnect and Reconnect Repository
1. Go to site settings in Forge
2. Disconnect the Git repository
3. Reconnect it
4. This will create a fresh clone and resolve the divergent branches

## Current Repository Status
- Repository is clean and correct
- All commits are properly pushed
- The issue is only on the deployment server's local git state

