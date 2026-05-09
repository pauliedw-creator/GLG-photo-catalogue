/**
 * GLG Slab Catalogue — data fetch and image processing pipeline
 *
 * Reads:  Google Sheet "Slabs" tab + Drive folder "GLG Slab Photos"
 * Writes: src/data/slabs.json + public/photos/<slab_id>/{full,detail,edge,wet}-{400,1200,2400}.webp
 *
 * Required env vars (set as GitHub Secrets):
 *   GOOGLE_SERVICE_ACCOUNT_KEY  — full JSON contents of the service account key
 *   SHEET_ID                    — Google Sheet ID
 *   DRIVE_ROOT_FOLDER_ID        — root folder containing per-slab sub-folders + _bulk_inbox + _rejected
 *   BULK_INBOX_FOLDER_ID        — _bulk_inbox folder (parsed before per-slab read)
 */

import { google } from 'googleapis';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const SHEET_ID = process.env.SHEET_ID;
const DRIVE_ROOT = process.env.DRIVE_ROOT_FOLDER_ID;
const BULK_INBOX = process.env.BULK_INBOX_FOLDER_ID;
const KEY_RAW = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

if (!SHEET_ID || !DRIVE_ROOT || !BULK_INBOX || !KEY_RAW) {
  console.error('Missing required env vars: SHEET_ID, DRIVE_ROOT_FOLDER_ID, BULK_INBOX_FOLDER_ID, GOOGLE_SERVICE_ACCOUNT_KEY');
  process.exit(1);
}

const credentials = JSON.parse(KEY_RAW);

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets.readonly',
    'https://www.googleapis.com/auth/drive.readonly'
  ]
});

const sheets = google.sheets({ version: 'v4', auth });
const drive = google.drive({ version: 'v3', auth });

// ---------- enums (Polish source → English presentation) ----------
const FINISH_MAP = {
  'polerowany':     { pl: 'Polerowany',     en: 'Polished' },
  'szczotkowany':  { pl: 'Szczotkowany',   en: 'Brushed' },
  'płomieniowany': { pl: 'Płomieniowany', en: 'Flamed' },
  'piaskowany':     { pl: 'Piaskowany',     en: 'Sandblasted' },
  'surowy':          { pl: 'Surowy',          en: 'Raw' }
};
const EDGE_MAP = {
  'cięty':      { pl: 'Cięty',     en: 'Cut' },
  'naturalny': { pl: 'Naturalny', en: 'Natural' }
};
const STATUS_MAP = {
  'dostępny':        { pl: 'Dostępny',        en: 'Available' },
  'zarezerwowany': { pl: 'Zarezerwowany', en: 'Reserved' },
  'sprzedany':        { pl: 'Sprzedany',        en: 'Sold' }
};
const ORIGIN_MAP = {
  'Indie': 'India', 'Chiny': 'China', 'Brazylia': 'Brazil',
  'RPA': 'South Africa', 'Norwegia': 'Norway', 'Włochy': 'Italy',
  'Hiszpania': 'Spain', 'Inne': 'Other'
};
const STONE_TYPE_MAP = {
  'granit':   { pl: 'Granit',   en: 'Granite' },
  'kwarcyt': { pl: 'Kwarcyt', en: 'Quartzite' }
};
const COLOUR_MAP = {
  'czarny':        { pl: 'Czarny',        en: 'Black' },
  'biały':          { pl: 'Biały',          en: 'White' },
  'szary':          { pl: 'Szary',          en: 'Grey' },
  'czerwony':      { pl: 'Czerwony',      en: 'Red' },
  'brązowy':       { pl: 'Brązowy',       en: 'Brown' },
  'beżowy':        { pl: 'Beżowy',        en: 'Beige' },
  'zielony':       { pl: 'Zielony',       en: 'Green' },
  'niebieski':     { pl: 'Niebieski',     en: 'Blue' },
  'złoty':          { pl: 'Złoty',          en: 'Gold' },
  'wielobarwny':  { pl: 'Wielobarwny',  en: 'Multicoloured' }
};

// ---------- helpers ----------
async function fetchSheet() {
  console.log('Fetching sheet rows...');
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: 'Slabs!A1:R3000'
  });
  const rows = res.data.values || [];
  if (rows.length < 2) {
    console.warn('Sheet has no data rows.');
    return [];
  }
  const headers = rows[0];
  const records = rows.slice(1)
    .filter(r => r[0] && r[0].toString().trim()) // skip rows without slab_id
    .map(r => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ''])));
  console.log(`  ${records.length} data rows in sheet`);
  return records;
}

function normaliseRow(r) {
  // Coerce strings to correct types and apply enum mapping
  const truthy = v => v === true || v === 'TRUE' || v === 'true' || v === 1 || v === '1';
  return {
    slab_id: String(r.slab_id).trim(),
    material_pl: r.material_name_pl || '',
    material_en: r.material_name_en || r.material_name_pl || '',
    stone_type: STONE_TYPE_MAP[r.stone_type] || (r.stone_type ? { pl: r.stone_type, en: r.stone_type } : null),
    colour: COLOUR_MAP[r.colour] || (r.colour ? { pl: r.colour, en: r.colour } : null),
    length_cm: Number(r.length_cm) || 0,
    width_cm: Number(r.width_cm) || 0,
    thickness_cm: Number(r.thickness_cm) || 0,
    area_sqm: Number(r.area_sqm) || 0,
    finish: FINISH_MAP[r.finish] || { pl: r.finish || '', en: r.finish || '' },
    edge: EDGE_MAP[r.edge_condition] || { pl: r.edge_condition || '', en: r.edge_condition || '' },
    origin_pl: r.origin_country || '',
    origin_en: ORIGIN_MAP[r.origin_country] || r.origin_country || '',
    status: STATUS_MAP[r.status] || { pl: r.status || '', en: r.status || '' },
    date_received: r.date_received || '',
    notes_pl: r.notes_pl || '',
    notes_en: r.notes_en || r.notes_pl || '',
    published: truthy(r.published)
  };
}

async function listChildFolders(parentId) {
  // Shared drives may behave differently — for personal Drive, q + parents + name works
  const res = await drive.files.list({
    q: `'${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id, name)',
    pageSize: 1000
  });
  return res.data.files || [];
}

async function listFilesInFolder(folderId) {
  const res = await drive.files.list({
    q: `'${folderId}' in parents and mimeType contains 'image/' and trashed=false`,
    fields: 'files(id, name, mimeType)',
    pageSize: 100
  });
  return res.data.files || [];
}

async function downloadFile(fileId) {
  const res = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'arraybuffer' }
  );
  return Buffer.from(res.data);
}

// Identify shot type from filename (e.g. "full.jpg", "detail-2.jpg", "GLG-251105-01_edge.jpg")
function classifyPhoto(filename) {
  const lower = filename.toLowerCase();
  if (lower.includes('full'))   return 'full';
  if (lower.includes('detail')) return 'detail';
  if (lower.includes('edge'))   return 'edge';
  if (lower.includes('wet'))    return 'wet';
  return null;
}

// Watermark SVG (the company-name pill from earlier work)
async function loadWatermarkBuffer() {
  const wmPath = path.join(ROOT, 'public/assets/glg-watermark.svg');
  return await fs.readFile(wmPath);
}

const SIZES = [400, 1200, 2400]; // thumbnail, medium, full

async function processImage(buffer, slabId, shotType, index, watermarkBuf) {
  const baseName = index === 0 ? shotType : `${shotType}-${index + 1}`;
  const outDir = path.join(ROOT, 'public/photos', slabId);
  await fs.mkdir(outDir, { recursive: true });

  for (const size of SIZES) {
    let pipeline = sharp(buffer).rotate().resize({ width: size, withoutEnlargement: true });

    // Apply watermark to all shot types at large sizes (1200+)
    if (size >= 1200) {
      // Materialise the resized output first so we know actual dimensions
      const outBuf = await pipeline.toBuffer();
      const outMeta = await sharp(outBuf).metadata();

      // Watermark width = 55% of actual output width, never wider than output
      const wmWidth = Math.min(
        Math.round(outMeta.width * 0.55),
        outMeta.width - 20
      );
      const wmResized = await sharp(watermarkBuf, { density: 300 })
        .resize({ width: wmWidth })
        .toBuffer();
      const wmMeta = await sharp(wmResized).metadata();

      // Clamp position so watermark never overflows the image
      const margin = Math.round(outMeta.width * 0.02);
      const top  = Math.max(0, outMeta.height - wmMeta.height - margin);
      const left = Math.max(0, outMeta.width  - wmMeta.width  - margin);

      await sharp(outBuf)
        .composite([{ input: wmResized, top, left }])
        .webp({ quality: 82 })
        .toFile(path.join(outDir, `${baseName}-${size}.webp`));
    } else {
      await pipeline
        .webp({ quality: 82 })
        .toFile(path.join(outDir, `${baseName}-${size}.webp`));
    }
  }
}

async function main() {
  console.log('=== GLG Catalogue Build ===');

  const watermarkBuf = await loadWatermarkBuffer();

  const rows = await fetchSheet();
  const slabs = rows.map(normaliseRow);

  // Fetch all slab folders once for lookup speed
  // Group by name to handle duplicate folders (race condition from capture app)
  console.log('Listing slab folders in Drive...');
  const allFolders = await listChildFolders(DRIVE_ROOT);
  const foldersByName = new Map();
  for (const f of allFolders) {
    if (f.name.startsWith('_')) continue; // skip _bulk_inbox, _rejected
    if (!foldersByName.has(f.name)) foldersByName.set(f.name, []);
    foldersByName.get(f.name).push(f);
  }
  console.log(`  ${foldersByName.size} slab folders found`);

  const processedSlabs = [];
  let processedCount = 0, skippedNoFolder = 0, skippedNoFull = 0, skippedUnpublished = 0;

  for (const slab of slabs) {
    if (!slab.published) {
      skippedUnpublished++;
      continue;
    }

    const folders = foldersByName.get(slab.slab_id) || [];
    const photos = { full: [], detail: [], edge: [], wet: [] };

    if (folders.length > 0) {
      // Merge files from all folders with this name (handles duplicate folder race condition)
      for (const folder of folders) {
        const files = await listFilesInFolder(folder.id);
        for (const file of files) {
          const type = classifyPhoto(file.name);
          if (type) photos[type].push(file);
        }
      }

      // Process each photo
      for (const [shotType, fileList] of Object.entries(photos)) {
        for (let i = 0; i < fileList.length; i++) {
          console.log(`  ${slab.slab_id}: processing ${fileList[i].name} as ${shotType}#${i + 1}`);
          const buf = await downloadFile(fileList[i].id);
          await processImage(buf, slab.slab_id, shotType, i, watermarkBuf);
        }
      }
    } else {
      skippedNoFolder++;
    }

    // Track slabs missing full-face photo, but include them with a placeholder flag
    const missingPhoto = photos.full.length === 0;
    if (missingPhoto) skippedNoFull++;

    processedSlabs.push({
      ...slab,
      missing_photo: missingPhoto,
      photos: {
        full:    photos.full.map((_, i)   => i === 0 ? 'full'   : `full-${i + 1}`),
        detail: photos.detail.map((_, i) => i === 0 ? 'detail' : `detail-${i + 1}`),
        edge:    photos.edge.map((_, i)   => i === 0 ? 'edge'   : `edge-${i + 1}`),
        wet:     photos.wet.map((_, i)    => i === 0 ? 'wet'    : `wet-${i + 1}`)
      }
    });
    processedCount++;
  }

  // Write data file
  const dataDir = path.join(ROOT, 'src/data');
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(
    path.join(dataDir, 'slabs.json'),
    JSON.stringify({ generated_at: new Date().toISOString(), slabs: processedSlabs }, null, 2)
  );

  console.log('=== Build summary ===');
  console.log(`Published slabs included:    ${processedCount}`);
  console.log(`Skipped (unpublished):       ${skippedUnpublished}`);
  console.log(`Skipped (no Drive folder):   ${skippedNoFolder}`);
  console.log(`Included with NO photo:      ${skippedNoFull}  ← will render with placeholder`);
}

main().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
