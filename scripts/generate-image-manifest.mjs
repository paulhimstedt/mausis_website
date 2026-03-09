import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

import sharp from "sharp";

const SOURCE_DIR = path.join(process.cwd(), "public", "images", "laura-anniversary");
const OUTPUT_DIR = path.join(
  process.cwd(),
  "public",
  "images",
  "laura-anniversary-optimized",
);
const MANIFEST_PATH = path.join(process.cwd(), "content", "image-manifest.json");

const SUPPORTED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".heic",
  ".heif",
]);

const COLLATOR = new Intl.Collator("de", { numeric: true, sensitivity: "base" });

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

async function listSourceFiles() {
  const entries = await fs.readdir(SOURCE_DIR, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => SUPPORTED_EXTENSIONS.has(path.extname(name).toLowerCase()))
    .sort((a, b) => COLLATOR.compare(a, b));

  return files;
}

async function buildSignature(files) {
  const stats = await Promise.all(
    files.map(async (name) => {
      const filePath = path.join(SOURCE_DIR, name);
      const stat = await fs.stat(filePath);
      return {
        name,
        size: stat.size,
        mtimeMs: stat.mtimeMs,
      };
    }),
  );

  return createHash("sha1").update(JSON.stringify(stats)).digest("hex");
}

async function readExistingManifest() {
  try {
    const raw = await fs.readFile(MANIFEST_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function generateAssets(files, signature) {
  await fs.rm(OUTPUT_DIR, { recursive: true, force: true });
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const images = [];

  for (const [index, fileName] of files.entries()) {
    const inputPath = path.join(SOURCE_DIR, fileName);
    const parsed = path.parse(fileName);
    const safeStem = slugify(parsed.name) || `image-${index + 1}`;
    const baseName = `${String(index + 1).padStart(3, "0")}-${safeStem}`;

    const heroFile = `${baseName}.webp`;
    const thumbFile = `${baseName}-thumb.webp`;

    await sharp(inputPath)
      .rotate()
      .resize({
        width: 1700,
        height: 1700,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 76, effort: 5 })
      .toFile(path.join(OUTPUT_DIR, heroFile));

    await sharp(inputPath)
      .rotate()
      .resize({
        width: 720,
        height: 720,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 68, effort: 4 })
      .toFile(path.join(OUTPUT_DIR, thumbFile));

    images.push({
      id: baseName,
      originalName: fileName,
      originalSrc: `/images/laura-anniversary/${encodeURIComponent(fileName)}`,
      heroSrc: `/images/laura-anniversary-optimized/${heroFile}`,
      thumbSrc: `/images/laura-anniversary-optimized/${thumbFile}`,
    });
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    signature,
    count: images.length,
    images,
  };

  await fs.writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  return manifest;
}

async function main() {
  await fs.mkdir(path.dirname(MANIFEST_PATH), { recursive: true });

  const files = await listSourceFiles();

  if (files.length === 0) {
    await fs.rm(OUTPUT_DIR, { recursive: true, force: true });
    const emptyManifest = {
      generatedAt: new Date().toISOString(),
      signature: "",
      count: 0,
      images: [],
    };
    await fs.writeFile(
      MANIFEST_PATH,
      `${JSON.stringify(emptyManifest, null, 2)}\n`,
      "utf8",
    );
    console.log("No source images found in public/images/laura-anniversary");
    return;
  }

  const signature = await buildSignature(files);
  const existingManifest = await readExistingManifest();

  if (
    existingManifest?.signature === signature &&
    typeof existingManifest?.count === "number" &&
    existingManifest.count === files.length
  ) {
    try {
      await fs.access(OUTPUT_DIR);
      console.log(`Image manifest is up to date (${files.length} images).`);
      return;
    } catch {
      // Continue with regeneration if output directory is missing.
    }
  }

  const result = await generateAssets(files, signature);
  console.log(
    `Generated ${result.count} optimized images in public/images/laura-anniversary-optimized.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
