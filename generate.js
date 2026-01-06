const fs = require('fs');
const path = require('path');

const imagesDir = './images';
const htmlPath = './index.html';

const files = fs.readdirSync(imagesDir)
  .filter(f => /\.(png|jpe?g|webp)$/i.test(f))
  .sort()
  .reverse();

let html = fs.readFileSync(htmlPath, 'utf-8');

const imgTags = files.map(f =>
  `  <img src="images/${f}" loading="lazy">`
).join('\n');

html = html.replace(
  /<div class="gallery">[\s\S]*?<\/div>/,
  `<div class="gallery">\n${imgTags}\n</div>`
);

fs.writeFileSync(htmlPath, html);
console.log('✔ gallery updated');
