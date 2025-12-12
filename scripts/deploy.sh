#!/bin/bash
# Deployment script that handles git pull with divergent branches
set -e

echo "Fetching latest changes..."
git fetch origin

echo "Resetting to origin/main..."
git reset --hard origin/main

echo "Cleaning any untracked files..."
git clean -fd

echo "Deployment preparation complete."

