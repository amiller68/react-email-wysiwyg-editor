# GitHub Pages Deployment Guide

This guide explains how to deploy the React Email Builder to GitHub Pages.

## Prerequisites

- GitHub repository for this project
- GitHub account with Pages access

## Setup Instructions

### 1. Update Repository Name in Config

If your repository name is **not** `react-email-editor`, update the base path in `vite.config.ts`:

```typescript
base: process.env.GITHUB_PAGES === 'true' ? '/your-repo-name/' : '/',
```

Replace `/your-repo-name/` with `/your-actual-repo-name/`.

### 2. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select:
   - Source: **GitHub Actions**

That's it! No need to select a branch manually.

### 3. Push Your Code

The deployment will trigger automatically when you push to the `main` branch:

```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main
```

### 4. Monitor Deployment

1. Go to the **Actions** tab in your GitHub repository
2. You'll see the "Deploy to GitHub Pages" workflow running
3. Once complete (green checkmark), your site is live!

### 5. Access Your Site

Your site will be available at:
```
https://your-username.github.io/your-repo-name/
```

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
