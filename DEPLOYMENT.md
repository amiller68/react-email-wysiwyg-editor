# GitHub Pages Deployment Guide

This guide explains how to deploy the React Email Builder to GitHub Pages.

> **🚨 Getting "Get Pages site failed" error?** Jump to [Common Setup Issues](#️-common-setup-issues--solutions)

## Prerequisites

- GitHub repository for this project
- GitHub account with Pages access

## Quick Start

**Most important step:** Enable GitHub Pages **BEFORE** running the workflow!

1. Go to your repo → **Settings** → **Pages**
2. Set **Source** to **"GitHub Actions"**
3. Push your code to trigger deployment

See detailed steps below.

## Setup Instructions

### Step 1: Create GitHub Repository (if not done)

If you haven't created the repository yet:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: React Email WYSIWYG Editor"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git branch -M main
git push -u origin main
```

### Step 2: Update Repository Name in Config

If your repository name is **not** `react-email-editor`, update the base path in `vite.config.ts`:

```typescript
base: process.env.GITHUB_PAGES === 'true' ? '/your-repo-name/' : '/',
```

Replace `/your-repo-name/` with `/your-actual-repo-name/`.

### Step 3: Enable GitHub Pages

**⚠️ IMPORTANT: Do this BEFORE pushing the workflow**

1. Go to your repository on GitHub: `https://github.com/YOUR-USERNAME/YOUR-REPO-NAME`
2. Click **Settings** (top navigation)
3. Click **Pages** (left sidebar, under "Code and automation")
4. Under **Build and deployment**:
   - **Source**: Select **GitHub Actions** from the dropdown
   - (NOT "Deploy from a branch")
5. You should see a message: "GitHub Actions is now configured to deploy your site"

**That's it!** No need to select a branch manually.

### Step 4: Push Your Code

Now push your code (or push again if you already pushed):

```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main
```

### Step 5: Monitor Deployment

1. Go to the **Actions** tab in your GitHub repository
2. You'll see the "Deploy to GitHub Pages" workflow running
3. Once complete (green checkmark), your site is live!

### Step 6: Access Your Site

Your site will be available at:
```
https://your-username.github.io/your-repo-name/
```

---

## ⚠️ Common Setup Issues & Solutions

### Error: "Get Pages site failed" or "HttpError: Not Found"

**This means GitHub Pages is not enabled yet!**

**Solution (do this NOW):**

1. **Go to your GitHub repository**
   - Navigate to: `https://github.com/YOUR-USERNAME/YOUR-REPO-NAME`

2. **Click "Settings"** (top menu bar)

3. **Click "Pages"** (left sidebar under "Code and automation")

4. **Under "Build and deployment":**
   - Find the **Source** dropdown
   - Select **"GitHub Actions"**
   - ❌ Do NOT select "Deploy from a branch"

5. **Save/Confirm** - You should see: "GitHub Actions is now configured to deploy your site"

6. **Re-run the failed workflow:**
   - Go to **Actions** tab
   - Click on the failed "Deploy to GitHub Pages" workflow
   - Click **"Re-run all jobs"** button

**Alternative:** Push a new commit to trigger deployment:
```bash
git commit --allow-empty -m "Trigger deployment after enabling Pages"
git push
```

### Other Common Issues

**Repository is private but you don't have GitHub Pro?**
- GitHub Pages on private repos requires GitHub Pro/Team/Enterprise
- Solution: Make repository public, or upgrade to GitHub Pro

**Wrong repository name in vite.config.ts?**
- If your repo is named `my-email-builder` but config says `/react-email-editor/`
- Update `vite.config.ts` line 7 to match your actual repo name
- Rebuild and push

---

## Manual Deployment (Alternative)

If you prefer to deploy manually from your local machine:

```bash
pnpm deploy
```

This will:
1. Build the project with GitHub Pages configuration
2. Deploy the `dist` folder to the `gh-pages` branch
3. GitHub Pages will serve from that branch automatically

**Note:** For manual deployment, you need to set Pages source to:
- Source: **Deploy from a branch**
- Branch: **gh-pages** / **/ (root)**

## Continuous Deployment

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically deploys on:

- **Every push to `main` branch** - Automatic deployment
- **Manual trigger** - Go to Actions → Deploy to GitHub Pages → Run workflow

### Workflow Features

✅ Uses pnpm for fast, efficient installs
✅ Caches dependencies for faster builds
✅ Sets correct base path automatically
✅ Optimized build for production
✅ Proper permissions for Pages deployment

## Troubleshooting

### Build Fails

**Check the Actions logs:**
1. Go to **Actions** tab
2. Click on the failed workflow run
3. Expand the failed step to see error details

**Common issues:**
- TypeScript errors - Fix type issues in your code
- Missing dependencies - Ensure `pnpm-lock.yaml` is committed
- Build timeout - Large projects may need optimization

### Site Not Loading / 404 Errors

**Check base path:**
- Ensure `vite.config.ts` has the correct repository name
- Base path must match: `https://username.github.io/REPO-NAME/`

**Verify GitHub Pages settings:**
- Settings → Pages → Source should be "GitHub Actions"
- Wait a few minutes after deployment completes

### Assets Not Loading (CSS/JS)

This is usually a base path issue. Make sure:
1. `vite.config.ts` has correct `base` path
2. Rebuild: `pnpm build:gh-pages`
3. Redeploy

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file in the `public` folder with your domain:
   ```
   yourdomain.com
   ```

2. Configure DNS at your domain registrar:
   - Add CNAME record pointing to: `your-username.github.io`
   - Or A records for GitHub Pages IPs

3. In GitHub Settings → Pages → Custom domain, enter your domain

4. Enable "Enforce HTTPS"

## Environment Variables

The build uses `GITHUB_PAGES=true` environment variable to set the base path.

To test locally with GitHub Pages paths:
```bash
GITHUB_PAGES=true pnpm dev
```

## Local Preview of Production Build

To preview the production build locally:

```bash
pnpm build:gh-pages
pnpm preview
```

Note: The preview will use root path, not the GitHub Pages path.

## Deployment Scripts

Available npm scripts:

- `pnpm build` - Standard build for local/other hosting
- `pnpm build:gh-pages` - Build with GitHub Pages base path
- `pnpm deploy` - Manual deployment to gh-pages branch
- `pnpm preview` - Preview production build locally

## Questions?

- **GitHub Pages Docs**: https://docs.github.com/en/pages
- **Vite Deployment Guide**: https://vitejs.dev/guide/static-deploy.html
- **pnpm Documentation**: https://pnpm.io/

---

**Your site will be live at:**
```
https://[your-username].github.io/react-email-editor/
```

Replace `[your-username]` with your GitHub username and `react-email-editor` with your repo name if different.
