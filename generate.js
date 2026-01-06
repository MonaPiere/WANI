const fs = require("fs");
const path = require("path");

const imagesRoot = path.join(__dirname, "images");
const outJson = path.join(__dirname, "gallery.json");

const exts = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);

function isDir(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function listYears(root) {
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root)
    .map((name) => ({ name, full: path.join(root, name) }))
    .filter((e) => isDir(e.full))
    // "2024"みたいに数字のフォルダだけを年として扱う（必要ならここ外してOK）
    .filter((e) => /^\d{4}$/.test(e.name))
    // 新しい年が上に来るように降順
    .sort((a, b) => Number(b.name) - Number(a.name))
    .map((e) => e.name);
}

function listImagesForYear(year) {
  const dir = path.join(imagesRoot, year);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => exts.has(path.extname(f).toLowerCase()))
    // 新しいファイル名が上に来るように降順（好みで .sort() にしてもOK）
    .sort()
    .reverse()
    .map((f) => `images/${year}/${f}`);
}

const years = listYears(imagesRoot);

const data = {
  updatedAt: new Date().toISOString(),
  years,
  byYear: {},
};

for (const y of years) {
  data.byYear[y] = listImagesForYear(y);
}

fs.writeFileSync(outJson, JSON.stringify(data, null, 2), "utf-8");
console.log("✔ gallery.json updated:", outJson);
