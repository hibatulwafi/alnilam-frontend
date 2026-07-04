# Deployment — Alnilam Frontend

## Deploy Targets

| Environment | Platform | URL |
|---|---|---|
| **Dev** | Local | `http://127.0.0.1:5173` |
| **Staging** | Vercel Preview | `alnilam-frontend-git-*.vercel.app` |
| **Production** | Vercel | `alnilam.id` (custom domain) |

## Vercel Deployment

### Prerequisites
- GitHub account
- Vercel account (https://vercel.com — signup pakai GitHub)
- Repo `alnilam-frontend` di-push ke GitHub
- Backend sudah deploy dulu (butuh `VITE_API_URL`)

### Step 1: Import Project

1. Buka https://vercel.com/new
2. "Import Git Repository"
3. Authorize + pilih `alnilam-frontend`
4. Framework preset: **Vite** (auto-detect)

### Step 2: Environment Variables

Klik "Environment Variables":

```
VITE_API_URL=https://alnilam-api-production.up.railway.app/api
```

**Note:** Vite env di-bake at build time — ubah env = wajib rebuild.

### Step 3: Deploy

Klik "Deploy" — Vercel build + deploy dalam 1-2 menit.

Domain otomatis: `alnilam-frontend.vercel.app`

### Step 4: Update Backend CORS

Backend perlu whitelist Vercel domain:

```
# Di Railway backend
FRONTEND_URL=https://alnilam-frontend.vercel.app
SANCTUM_STATEFUL_DOMAINS=alnilam-frontend.vercel.app
```

Redeploy backend.

## SPA Configuration

`vercel.json` sudah setup untuk Vue Router history mode:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Kenapa:** Vue Router pakai HTML5 History API. Tanpa rewrite, refresh page `/catalog` = 404.

Security headers juga di `vercel.json`:
```json
"headers": [
  {
    "source": "/assets/(.*)",
    "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
  },
  {
    "source": "/(.*)",
    "headers": [
      { "key": "X-Content-Type-Options", "value": "nosniff" },
      { "key": "X-Frame-Options", "value": "DENY" }
    ]
  }
]
```

## Custom Domain

### Step 1: Add di Vercel
1. Project → Settings → Domains → Add
2. Input: `alnilam.id` atau `www.alnilam.id`
3. Vercel akan guide DNS setup

### Step 2: DNS Setup

Untuk root domain (`alnilam.id`):

| Type | Name | Target |
|---|---|---|
| A | @ | 76.76.21.21 (Vercel) |
| CNAME | www | cname.vercel-dns.com |

Untuk subdomain (`app.alnilam.id`):

| Type | Name | Target |
|---|---|---|
| CNAME | app | cname.vercel-dns.com |

### Step 3: SSL

Vercel auto-provision SSL (Let's Encrypt) dalam 5-10 menit.

## Preview Deployments

Vercel auto-deploy setiap:
- **PR** — dapat URL `alnilam-frontend-git-<branch>-<team>.vercel.app`
- **Push ke branch** — same

Preview link posted ke PR comment (kalau GitHub App enabled).

## Cache Strategy

### Static Assets

Vite output hash di filename (`index-abc123.js`) → cache indefinite:
```
Cache-Control: public, max-age=31536000, immutable
```

### HTML

Never cache:
```
Cache-Control: no-store
```

Sudah di-handle default Vercel + `vercel.json`.

## Build Configuration

`vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm ci",
  "framework": "vite"
}
```

Vite output ke `dist/` — Vercel deploy dari sini.

## Performance Optimization

### 1. Code Splitting

Already active via router lazy imports:
```typescript
component: () => import('@/pages/Catalog.vue')
```

Setiap route dapat chunk terpisah.

### 2. Image Optimization

Vercel gratis image optimization via `next/image` — tapi kita Vue, jadi:

**Option A:** Pakai CDN external (Cloudinary, Bunny, Imgix)
**Option B:** Static image di `/public` + manual optimize (WebP)
**Option C:** Component wrapper — Phase 2+

### 3. Font Loading

Kalau pakai Google Fonts atau self-host:
```html
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
```

### 4. Prefetch

Vue Router prefetch on hover (default enabled).

## Monitoring

### Vercel Analytics

Enable di dashboard — free untuk Hobby tier:
- Real user monitoring (RUM)
- Core Web Vitals (LCP, FID, CLS)
- Traffic per country

### Error Tracking

Add Sentry (Phase 2+):

```bash
npm install @sentry/vue
```

```typescript
// main.ts
import * as Sentry from '@sentry/vue'

Sentry.init({
  app,
  dsn: import.meta.env.VITE_SENTRY_DSN,
  tracesSampleRate: 0.1,
  release: __APP_VERSION__,
})
```

## Rollback

### Vercel Dashboard
1. Project → Deployments
2. Pilih deployment lama
3. Klik "..." → "Promote to Production"

Instant rollback tanpa rebuild.

## CI/CD Custom (kalau tidak pakai Vercel)

`.github/workflows/deploy-frontend.yml`:

```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install
        run: npm ci

      - name: Build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
        run: npm run build

      - name: Deploy to Cloudflare Pages (alternative)
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
          accountId: ${{ secrets.CF_ACCOUNT_ID }}
          projectName: alnilam
          directory: dist
```

## Cost Estimate

### Vercel Hobby (Free)
- Bandwidth: 100 GB/bulan
- Build minutes: 6000/bulan
- Deployments: unlimited
- Preview per PR: yes

**Cocok untuk:** MVP, demo, personal project

### Vercel Pro ($20/user/month)
- Bandwidth: 1 TB
- Team collaboration
- Password protection
- Analytics
- Priority support

**Cocok untuk:** Production dengan traffic > 100rb/bulan

## Alternative Hosting

Kalau tidak mau Vercel:

| Platform | Cost | Note |
|---|---|---|
| **Cloudflare Pages** | Free (unlimited bandwidth) | Rekomendasi untuk cost |
| **Netlify** | Free tier + $19/month | Similar Vercel |
| **AWS S3 + CloudFront** | Variable | Enterprise-grade |
| **GitHub Pages** | Free | Static only, no env vars runtime |

Untuk Alnilam Y1: **Cloudflare Pages** — free tier generous, CDN global.

## Security Checklist Pre-Production

- [ ] `VITE_API_URL` production correct
- [ ] `.env.local` tidak commit ke git
- [ ] Security headers set (X-Frame-Options, CSP)
- [ ] HTTPS enforced (Vercel auto)
- [ ] No hardcoded API tokens
- [ ] Console.log removed dari production build
- [ ] Source map upload ke Sentry (jangan expose public)
- [ ] Analytics ID benar
- [ ] Font & asset lazy load

## Related

- [ARCHITECTURE.md](ARCHITECTURE.md) — Frontend design
- [DEVELOPMENT.md](DEVELOPMENT.md) — Local dev workflow
- [alnilam-backend/docs/DEPLOYMENT.md](../../alnilam-backend/docs/DEPLOYMENT.md) — Backend deploy
- [alnilam-demo/DEPLOYMENT.md](../../alnilam-demo/DEPLOYMENT.md) — Combined deploy
