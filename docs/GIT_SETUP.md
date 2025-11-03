# Git Push Setup - Quick Reference

This guide helps you configure Git to push automatically without entering credentials each time.

## Quick Setup (One-Time)

### Option 1: Interactive Setup Script

Run the setup script:

```bash
./setup-git-push.sh
```

When prompted, enter your GitHub Personal Access Token.

### Option 2: Manual Setup

```bash
# Replace YOUR_TOKEN with your actual token
git remote set-url origin https://YOUR_TOKEN@github.com/andybui0408-wq/FRC-Stats-Website.git
```

### Option 3: Using Environment Variable

```bash
# Set token as environment variable
export GITHUB_TOKEN="your_token_here"

# Run setup script (it will use the environment variable)
./setup-git-push.sh
```

## Getting a GitHub Personal Access Token

If you need a new token:

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name (e.g., "FRC Website Push")
4. Select scope: `repo` (full control)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again!)

## After Setup

Once configured, you can push changes with simple commands:

```bash
# Stage changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub (no authentication needed!)
git push origin main
```

## How It Works

The setup script embeds your GitHub Personal Access Token in the Git remote URL (stored in `.git/config`). This allows Git to authenticate automatically without prompting for credentials.

## Security Note

⚠️ **Important**: 
- Your token is stored in `.git/config` (local to your repository)
- Never commit `.git/config` to the repository
- Keep this repository secure
- Don't share your `.git/config` file
- If using a shared computer, consider using SSH keys instead

## Verify Setup

Check your remote URL (token will be partially visible):
```bash
git remote -v
```

## Troubleshooting

### If `git push` still asks for credentials:

1. **Check remote URL:**
   ```bash
   git remote get-url origin
   ```

2. **Re-run setup:**
   ```bash
   ./setup-git-push.sh
   ```

3. **Manual fix:**
   ```bash
   git remote set-url origin https://YOUR_TOKEN@github.com/andybui0408-wq/FRC-Stats-Website.git
   ```

### If GitHub blocks the push (secret detected):

GitHub may detect tokens in commits. If this happens:
- The token in files will be flagged
- Use the setup script to enter token interactively (not in files)
- Or use environment variables

## Alternative: SSH Keys (More Secure)

For a more secure option, use SSH keys:

```bash
# Generate SSH key (if you don't have one)
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to GitHub: https://github.com/settings/ssh/new

# Update remote to use SSH
git remote set-url origin git@github.com:andybui0408-wq/FRC-Stats-Website.git
```

---

**Ready to go!** 🚀

After setup, you can push changes with just `git push origin main` - no authentication prompts!