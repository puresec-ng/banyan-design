#!/bin/bash
set -e

# Configure git to handle divergent branches
git config pull.rebase false || true
git config pull.ff false || true

# Fetch and reset to origin/main to fix any divergent branches
git fetch origin
git reset --hard origin/main || true

echo "Git setup complete"

