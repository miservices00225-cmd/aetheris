# GitHub Setup & Publishing Guide

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Create repository: `aetheris` (or any name)
3. **DO NOT** initialize with README (we already have one)
4. Click "Create repository"
5. Copy the HTTPS URL: `https://github.com/YOUR-USERNAME/aetheris.git`

## Step 2: Initialize Git Locally & Connect to GitHub

Run these commands in your project root (`C:\Users\ONPHA-CI\Desktop\PROJETS\Journal_de_Trading`):

```bash
# Initialize git (if not already done)
git init

# Add all files (respects .gitignore)
git add .

# Verify what will be committed (should NOT include .env.local or secrets)
git status

# Initial commit
git commit -m "feat: scaffold aetheris project structure"

# Add remote (replace with YOUR repo URL)
git remote add origin https://github.com/YOUR-USERNAME/aetheris.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Publishing Changes via Copilot CLI

Once connected, you can ask Copilot to publish your code:

**Example requests:**
- "Push the latest changes to GitHub"
- "Commit and push the broker connector implementation"
- "Create a git commit with these changes and push to main"

**What Copilot will do:**
1. Review staged/unstaged changes
2. Create appropriate commit message
3. Push to GitHub main branch

**For feature branches:**
```bash
# Create feature branch locally first
git checkout -b feature/broker-sync

# Then ask Copilot:
# "Commit broker sync implementation and push to feature/broker-sync"
```

## What Gets Committed vs Ignored

### ✅ COMMITTED (Safe to push)
- `backend/` — Source code, tests, config (tsconfig, eslint, etc.)
- `frontend/` — React code, Vite config, styles
- `docs/` — ARCHITECTURE.md, PROJECT_PLAN.md, README.md
- `.github/workflows/ci.yml` — GitHub Actions CI/CD
- `.copilot/settings.local.json` — Copilot CLI settings
- `.copilot/mcp-config.json` — MCP server configuration
- `.copilot/skills/` — Custom skills
- `.gitignore`, `.npmrc`, `.prettierrc`, `.eslintrc.json`

### ❌ IGNORED (Never pushed)
- `.copilot/.env.local` — Supabase credentials, API keys
- `.copilot/.env.local.bak` — Backup credentials
- `node_modules/` — Dependencies (use npm install to restore)
- `dist/`, `build/` — Build artifacts
- `.env`, `.env.local` — Local environment variables
- `*.log`, `coverage/` — Logs and test coverage
- `.vscode/`, `.idea/` — IDE settings
- `package-lock.json` — Lock files (use npm ci instead)

## Security Checklist Before First Push

```bash
# Scan for any accidental secrets
git secrets --scan

# Verify .env.local is in .gitignore
git check-ignore .copilot/.env.local
# Expected output: .copilot/.env.local

# See what will be pushed (no secrets should appear)
git diff --cached
```

## After First Push: Enabling GitHub Actions

1. Go to your repo: https://github.com/YOUR-USERNAME/aetheris
2. Click "Actions" tab
3. You should see the CI/CD workflow run automatically on push
4. Verify lint + build pass ✅

## Troubleshooting

**"fatal: not a git repository"**
```bash
git init
git remote add origin https://github.com/YOUR-USERNAME/aetheris.git
```

**"refused to merge unrelated histories"**
```bash
git pull origin main --allow-unrelated-histories
```

**"Permission denied (publickey)"**
- Set up SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

**".env.local was committed by accident"**
```bash
# Remove it from history
git rm --cached .copilot/.env.local
git commit --amend -m "Remove sensitive .env.local"
```

## Asking Copilot for Git Operations

**Simple workflows:**
- "Commit this and push to main"
- "Create a commit for the health check endpoint"
- "Push the latest changes"

**Feature branches:**
- "Create and push a branch for broker integration"
- "Merge feature/broker-sync into main and push"

**Code review:**
- "Show me what's uncommitted"
- "What files changed since the last commit?"
- "Revert the last commit"

---

**Next:** Once connected to GitHub, you can ask Copilot things like:
- "Push Sprint 0 scaffolding to GitHub"
- "I've made changes to the broker sync, commit and push"
- "Create a PR branch for the metrics engine"
