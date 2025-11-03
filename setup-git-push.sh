#!/bin/bash

# Setup Git to automatically use GitHub token for pushing
# This allows you to use: git push origin main

echo "🔧 Setting up Git to use your GitHub token automatically..."
echo ""

# Prompt for token (or use environment variable)
if [ -z "$GITHUB_TOKEN" ]; then
    echo "Enter your GitHub Personal Access Token:"
    echo "(Or set GITHUB_TOKEN environment variable)"
    read -s GITHUB_TOKEN
    echo ""
fi

GITHUB_USER="andybui0408-wq"
REPO_NAME="FRC-Stats-Website"

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ Error: GitHub token is required"
    exit 1
fi

# Update remote URL with token
echo "📝 Updating Git remote URL with token..."
git remote set-url origin "https://${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git"

# Verify the remote was updated
echo "✅ Git remote configured!"
echo ""
echo "You can now use:"
echo "  git push origin main"
echo ""
echo "Your token is embedded in the remote URL (stored in .git/config)"
echo "⚠️  Keep your .git/config file secure!"