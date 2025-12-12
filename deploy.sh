#!/bin/bash
set -e

# Configure git to handle divergent branches by merging
git config pull.rebase false
git config pull.ff false

# Fetch latest changes
git fetch origin

# Try to pull with merge strategy (this will create a merge commit if needed)
git pull origin main --no-rebase || {
    # If pull fails due to divergent branches, reset to origin
    echo "Divergent branches detected. Resetting to origin/main..."
    git reset --hard origin/main
}

# Clean any untracked files
git clean -fd

# Install dependencies
npm install

# Build the application
npm run build

echo "Deployment complete"

