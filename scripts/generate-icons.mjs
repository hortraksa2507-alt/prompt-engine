/**
 * Generates all required iOS App Store icon sizes from icon-512.png
 * Run: node scripts/generate-icons.mjs
 */
import sharp from "sharp";
import { existsSync, mkdirSync } from "fs";
import { writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "public", "icon-512.png");
const XCASSETS = path.join(ROOT, "ios", "App", "App", "Assets.xcassets", "AppIcon.appiconset");
const PUBLIC = path.join(ROOT, "public");

// All required iOS icon sizes
const IOS_ICONS = [
  // iPhone
  { size: 20, scale: 2, idiom: "iphone", filename: "icon-20@2x.png" },
  { size: 20, scale: 3, idiom: "iphone", filename: "icon-20@3x.png" },
  { size: 29, scale: 2, idiom: "iphone", filename: "icon-29@2x.png" },
  { size: 29, scale: 3, idiom: "iphone", filename: "icon-29@3x.png" },
  { size: 40, scale: 2, idiom: "iphone", filename: "icon-40@2x.png" },
  { size: 40, scale: 3, idiom: "iphone", filename: "icon-40@3x.png" },
  { size: 60, scale: 2, idiom: "iphone", filename: "icon-60@2x.png" },
  { size: 60, scale: 3, idiom: "iphone", filename: "icon-60@3x.png" },
  // iPad
  { size: 20, scale: 1, idiom: "ipad", filename: "icon-20.png" },
  { size: 20, scale: 2, idiom: "ipad", filename: "icon-20-ipad@2x.png" },
  { size: 29, scale: 1, idiom: "ipad", filename: "icon-29.png" },
  { size: 29, scale: 2, idiom: "ipad", filename: "icon-29-ipad@2x.png" },
  { size: 40, scale: 1, idiom: "ipad", filename: "icon-40.png" },
  { size: 40, scale: 2, idiom: "ipad", filename: "icon-40-ipad@2x.png" },
  { size: 76, scale: 1, idiom: "ipad", filename: "icon-76.png" },
  { size: 76, scale: 2, idiom: "ipad", filename: "icon-76@2x.png" },
  { size: 83.5, scale: 2, idiom: "ipad", filename: "icon-83.5@2x.png" },
  // App Store
  { size: 1024, scale: 1, idiom: "ios-marketing", filename: "icon-1024.png" },
];

// PWA sizes (skip 512 — source file is already icon-512.png)
const PWA_ICONS = [
  { size: 180, filename: "icon-180.png" },
  { size: 192, filename: "icon-192.png" },
];

async function generate() {
  console.log("🎨 Generating iOS app icons from", SRC);

  for (const icon of IOS_ICONS) {
    const px = Math.round(icon.size * icon.scale);
    const dest = path.join(XCASSETS, icon.filename);
    await sharp(SRC)
      .resize(px, px, { fit: "cover" })
      .png()
      .toFile(dest);
    console.log(`  ✓ ${icon.filename} (${px}×${px})`);
  }

  console.log("\n🌐 Generating PWA icons...");
  for (const icon of PWA_ICONS) {
    const dest = path.join(PUBLIC, icon.filename);
    await sharp(SRC)
      .resize(icon.size, icon.size, { fit: "cover" })
      .png()
      .toFile(dest);
    console.log(`  ✓ ${icon.filename} (${icon.size}×${icon.size})`);
  }

  // Generate Contents.json for Xcode
  const contents = {
    images: IOS_ICONS.map((icon) => ({
      filename: icon.filename,
      idiom: icon.idiom,
      scale: `${icon.scale}x`,
      size: `${icon.size}x${icon.size}`,
    })),
    info: { author: "xcode", version: 1 },
  };

  writeFileSync(
    path.join(XCASSETS, "Contents.json"),
    JSON.stringify(contents, null, 2)
  );
  console.log("\n✅ Contents.json updated");
  console.log("✅ All icons generated successfully!\n");
}

generate().catch(console.error);
