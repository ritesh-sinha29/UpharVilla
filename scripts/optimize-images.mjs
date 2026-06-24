// ── Static Image Optimization Script ─────────────────────────────────────────
// Creates WebP versions of SVGs and PNGs alongside the originals.
// Originals are NOT deleted — they stay in public/ as fallback.
// JPGs are compressed in-place (backup saved to _originals/).
//
// Run: node scripts/optimize-images.mjs

import { readdir, stat, mkdir, copyFile, unlink, rename } from "fs/promises";
import { join, extname, basename } from "path";
import { existsSync } from "fs";

const sharp = (await import("sharp")).default;

const PUBLIC_DIR = join(process.cwd(), "public");
const BACKUP_DIR = join(PUBLIC_DIR, "_originals");

// Files to skip entirely (tiny icons that should stay as-is)
const SKIP_FILES = new Set([
  "facebook.svg",  // 1KB icon
  "favicon.ico",
  "icon.png",
  "apple-icon.png",
  "google.png",    // 18KB — already small
  "india.png",     // 18KB — already small
]);

const MIN_SIZE_BYTES = 20 * 1024; // 20KB

async function optimizeImages() {
  console.log("🔍 Scanning public/ for images to optimize...\n");

  if (!existsSync(BACKUP_DIR)) {
    await mkdir(BACKUP_DIR, { recursive: true });
  }

  const files = await readdir(PUBLIC_DIR);
  let totalOriginal = 0;
  let totalOptimized = 0;
  let processedCount = 0;

  for (const file of files) {
    if (SKIP_FILES.has(file)) continue;

    const filePath = join(PUBLIC_DIR, file);
    const fileStat = await stat(filePath);

    if (fileStat.isDirectory()) continue;
    if (fileStat.size < MIN_SIZE_BYTES) continue;

    const ext = extname(file).toLowerCase();
    const name = basename(file, ext);

    if (![".svg", ".png", ".jpg", ".jpeg"].includes(ext)) continue;

    console.log(`📦 Processing: ${file} (${(fileStat.size / 1024).toFixed(0)} KB)`);
    totalOriginal += fileStat.size;

    try {
      if (ext === ".svg" || ext === ".png") {
        // Create WebP version alongside original (original stays untouched)
        const webpPath = join(PUBLIC_DIR, `${name}.webp`);

        // Skip if WebP already exists
        if (existsSync(webpPath)) {
          const webpStat = await stat(webpPath);
          totalOptimized += webpStat.size;
          console.log(`   ⏭️  ${name}.webp already exists (${(webpStat.size / 1024).toFixed(0)} KB)`);
          processedCount++;
          continue;
        }

        await sharp(filePath)
          .resize({ width: 1200, withoutEnlargement: true })
          .webp({ quality: 82 })
          .toFile(webpPath);

        const newStat = await stat(webpPath);
        totalOptimized += newStat.size;

        const savings = ((1 - newStat.size / fileStat.size) * 100).toFixed(1);
        console.log(`   ✅ Created ${name}.webp (${(newStat.size / 1024).toFixed(0)} KB, -${savings}%) — original kept`);
      } else {
        // JPG/JPEG — compress in-place (backup original first)
        const backupPath = join(BACKUP_DIR, file);
        if (!existsSync(backupPath)) {
          await copyFile(filePath, backupPath);
        }

        const tempPath = join(PUBLIC_DIR, `_temp_${file}`);
        await sharp(filePath)
          .resize({ width: 1400, withoutEnlargement: true })
          .jpeg({ quality: 80, mozjpeg: true })
          .toFile(tempPath);

        const newStat = await stat(tempPath);
        if (newStat.size < fileStat.size * 0.9) {
          await unlink(filePath);
          await rename(tempPath, filePath);
          totalOptimized += newStat.size;
          const savings = ((1 - newStat.size / fileStat.size) * 100).toFixed(1);
          console.log(`   ✅ Compressed ${(fileStat.size / 1024).toFixed(0)} KB → ${(newStat.size / 1024).toFixed(0)} KB (-${savings}%)`);
        } else {
          await unlink(tempPath);
          totalOptimized += fileStat.size;
          console.log(`   ⏭️  Already optimal, kept original`);
        }
      }

      processedCount++;
    } catch (err) {
      console.error(`   ❌ Failed: ${err.message}`);
      totalOptimized += fileStat.size;
    }
  }

  console.log("\n" + "═".repeat(60));
  console.log("📊 Results:");
  console.log(`   Files processed: ${processedCount}`);
  if (totalOriginal > 0) {
    console.log(`   Original total:  ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   WebP/Opt total:  ${(totalOptimized / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Saved:           ${((totalOriginal - totalOptimized) / 1024 / 1024).toFixed(2)} MB (${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%)`);
  }
  console.log("═".repeat(60));
}

optimizeImages().catch(console.error);
