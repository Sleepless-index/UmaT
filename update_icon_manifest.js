#!/usr/bin/env node
// Regenerates icons/manifest.json from the actual files in icons/.
// Run this from the repo root after adding or removing any .webp/.png/.jpg
// files in icons/, then commit the updated manifest.json.
//
// Usage:
//   node update_icon_manifest.js

const fs = require("fs");
const path = require("path");

const ICONS_DIR = path.join(__dirname, "icons");
const MANIFEST_PATH = path.join(ICONS_DIR, "manifest.json");
const EXTENSIONS = [".webp", ".png", ".jpg", ".jpeg"];

if (!fs.existsSync(ICONS_DIR)) {
  console.error("icons/ directory not found next to this script.");
  process.exit(1);
}

const files = fs.readdirSync(ICONS_DIR)
  .filter(f => EXTENSIONS.includes(path.extname(f).toLowerCase()))
  .sort((a, b) => a.localeCompare(b));

fs.writeFileSync(MANIFEST_PATH, JSON.stringify(files, null, 2) + "\n");

console.log(`Wrote icons/manifest.json with ${files.length} file(s):`);
files.forEach(f => console.log(`  - ${f}`));
