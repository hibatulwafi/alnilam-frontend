# Alnilam Mockups — Dolby-Inspired Dark Premium

HTML mockup untuk template Alnilam sebelum implement ke Vue 3.

**Tema:** Dolby.com-inspired — Dark, Premium, Bold, dengan Gold accent.

## Pages (13 total)

### Public Website (6)
| File | Description |
|---|---|
| [`index.html`](index.html) | Homepage — hero + kategori + featured + how-it-works |
| [`catalog.html`](catalog.html) | Product listing dengan sidebar filter |
| [`product-detail.html`](product-detail.html) | Service detail + sticky pricing sidebar |
| [`creator-profile.html`](creator-profile.html) | Creator public page dengan portfolio |
| [`login.html`](login.html) | Login page (split layout) |
| [`register.html`](register.html) | Register dengan role picker |

### Admin Panel (7)
| File | Description |
|---|---|
| [`admin/login.html`](admin/login.html) | Admin login dengan 2FA |
| [`admin/dashboard.html`](admin/dashboard.html) | KPI dashboard + charts + activity |
| [`admin/products.html`](admin/products.html) | Products table dengan filter |
| [`admin/product-form.html`](admin/product-form.html) | Add/Edit product form |
| [`admin/users.html`](admin/users.html) | Users management |
| [`admin/orders.html`](admin/orders.html) | Orders dengan KPI + tabs |
| [`admin/settings.html`](admin/settings.html) | Platform settings |

### Preview
- [`preview.html`](preview.html) — landing page untuk buka semua mockup

## Cara Preview

**Double-click** file `preview.html` di file explorer — akan buka di browser default.

Atau serve via local HTTP:
```bash
cd d:/project/alnilam/alnilam-frontend/mockups
python -m http.server 8080
# Buka: http://localhost:8080/preview.html
```

## Design System

**Colors:**
- `#000000` — Primary background (pure black)
- `#0A0A0A` — Secondary background
- `#0F0F0F` — Card background
- `#C9A66B` — Accent primary (muted gold)
- `#FFFFFF` — Primary text
- `#A8A8A8` — Secondary text
- `#10B981` — Success
- `#EF4444` — Danger

**Typography:**
- **Heading:** Helvetica Neue / Inter Bold, tracking tight (-0.02em)
- **Display:** Sizes 5rem-7rem, extra bold (800), tight line-height (0.95)
- **Body:** Inter Regular, 16-18px, line-height 1.6

**Spacing:**
- Full-bleed sections
- Container max-w 1400px
- Generous padding: `.section` = 6rem, `.section-lg` = 8rem

**Interactions:**
- Subtle hover glow untuk cards
- Border animate on hover (gold accent)
- Underline animation di nav links
- Smooth scroll

## Struktur Files

```
mockups/
├── index.html                  # Homepage
├── catalog.html
├── product-detail.html
├── creator-profile.html
├── login.html
├── register.html
├── preview.html                # Landing untuk preview
├── admin/
│   ├── login.html
│   ├── dashboard.html
│   ├── products.html
│   ├── product-form.html
│   ├── users.html
│   ├── orders.html
│   └── settings.html
├── assets/
│   └── css/
│       └── theme.css           # Semua styling (single file)
└── README.md
```

## Next Steps: Convert ke Vue

Setelah mockup di-approve klien:

1. **Extract components** dari HTML jadi Vue SFC:
   - `Nav.vue` — top navigation
   - `Footer.vue` — footer
   - `ProductCard.vue` — reusable product card
   - `CategoryCard.vue`
   - `AdminSidebar.vue`
   - `KpiCard.vue`
   - `DataTable.vue`

2. **Convert `theme.css`** — jadi Tailwind config extend, atau keep as scoped CSS.

3. **Migrate data** — replace hardcoded content dengan API calls ke `alnilam-backend`.

4. **Add interactivity:**
   - Router transitions
   - Form validation
   - Real API integration
   - State management (Pinia)

5. **Test responsive** — mobile, tablet, desktop.

## Design Reference

Inspirasi dari [dolby.com](https://www.dolby.com):
- Full-bleed hero dengan gradient overlay
- Bold typography dengan generous whitespace
- Dark theme premium dengan gold accent
- Minimalist navigation, hover animations subtle
- Cards dengan hover glow
- Number-driven design (statistic prominent)

**Yang di-adopt untuk Alnilam:**
- ✅ Dark premium theme
- ✅ Bold hero + typography
- ✅ Gold accent (`#C9A66B`)
- ✅ Border-based CTAs
- ✅ Grid-based layouts

**Yang di-adapt untuk Alnilam (bukan Dolby copy):**
- Marketplace-specific components (product card, filter, pricing)
- Admin panel dengan sidebar navigation
- Indonesian language & currency
- Business-focused (bukan consumer tech showcase)

## License

Copyright © [NAMA_VENDOR] & [NAMA_KLIEN]. All rights reserved. Confidential.

**Untuk review internal only** — jangan share ke pihak eksternal tanpa persetujuan.
