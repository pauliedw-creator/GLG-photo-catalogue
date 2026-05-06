# GLG Photo Catalogue

Public catalogue of granite slab stock for Golden Leaf Granit Sp. z o.o.

**Live site:** https://katalog.goldenleafgranit.pl
**Architecture:** Static site (Astro) → GitHub Pages, with build-time data fetching from Google Sheets + Drive.

## How it works

```
Google Sheet (slab data)
        +
Google Drive (photos)
        ↓
GitHub Action (every 30 min, manual, or on push)
  → fetches sheet via service account
  → downloads & resizes photos (3 sizes)
  → applies watermark to full shots at large sizes
  → generates src/data/slabs.json
  → runs Astro build
  → deploys to GitHub Pages
        ↓
katalog.goldenleafgranit.pl
```

## Required GitHub Secrets

| Secret | Description |
|---|---|
| `GOOGLE_SERVICE_ACCOUNT_KEY` | Full JSON contents of the service account key file |
| `SHEET_ID` | Google Sheet ID (from the URL) |
| `DRIVE_ROOT_FOLDER_ID` | Drive folder ID for "GLG Slab Photos" root |
| `BULK_INBOX_FOLDER_ID` | Drive folder ID for `_bulk_inbox` |

## Folder layout

```
src/
  data/slabs.json        ← generated, NOT committed (in .gitignore)
  layouts/Base.astro     ← shared shell, header/footer, OG tags
  pages/
    index.astro          ← Polish catalogue (/)
    plyty/[slug].astro   ← Polish slab detail (/plyty/GLG-...)
    kontakt.astro        ← Polish contact form
    en/index.astro       ← English catalogue (/en/)
    en/slabs/[slug].astro
    en/contact.astro
  styles/global.css
  i18n.js                ← UI string table
  components/

public/
  assets/                ← logos, watermark, icons
  CNAME                  ← custom domain
  manifest.webmanifest   ← PWA
  photos/                ← generated, NOT committed
```

## Local development

```bash
# Install
npm install

# Fetch data (requires env vars set in .env)
npm run fetch-data

# Run dev server
npm run dev

# Production build
npm run build
```

For local fetch-data to work, create a `.env` file (do not commit it):

```
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
SHEET_ID=...
DRIVE_ROOT_FOLDER_ID=...
BULK_INBOX_FOLDER_ID=...
```

## Outstanding configuration before launch

These placeholders need replacing before going live:

- [ ] Phone number in `Base.astro` footer (`+48000000000`)
- [ ] Phone number in `kontakt.astro` and `en/contact.astro`
- [ ] Phone number in slab detail templates
- [ ] Web3Forms access key in contact pages
- [ ] hCaptcha sitekey in contact pages
- [ ] Address in contact pages (currently "Nowa Dębowa Wola, Polska")
- [ ] Email address (currently `biuro@goldenleafgranit.pl`)

## Slab data lifecycle

1. **New slab** captured via the capture app (separate repo) → writes row to Sheet, uploads photos to Drive folder `GLG-YYMMDD-NN/`
2. **Build** runs (scheduled or manual) → reads Sheet, processes photos, deploys
3. **Sold/reserved** → status updated in Sheet, slab still visible but greyed
4. **Hide** → flip `published` to FALSE in Sheet

## Bulk photo upload

Drop files in Drive `_bulk_inbox` named `GLG-YYMMDD-NN_full.jpg` etc. The build pipeline (TODO: not yet implemented) will move them into per-slab folders.
