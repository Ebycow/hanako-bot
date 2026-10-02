// SNS で共有したときの画像（OGP画像、public/assets/og-2.jpg）を作る。
// 背景はここで描き、左に透過のキャラ素材、右にロゴと説明の文字を重ねて 1200×630 にする。
//
// 使い方:
//     node tools/og-image/make-og.mjs [キャラの透過PNG] [出力先]
//
// 省略すると tools/og-image/character.png から public/assets/og-2.jpg を作る。
// 考え方とハマりどころは README.md を参照。
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const [src = join(here, 'character.png'), out = join(here, '../../public/assets/og-2.jpg')] = process.argv.slice(2);

const W = 1200;
const H = 630;

// キャラの置き場所。素材の下端（胸元で切れている）を画像の下端にそろえて、切れ目を見せない
const character = { height: 640, left: 30 };

// 文字の内容と置き場所。cx は文字の中央の x 座標、y は各行のベースライン
const cx = 925;
const logo = { text: 'Hanako', font: 'Black', size: 120, y: 290, fill: '#c4285f', stroke: 14 };
const lines = [
    { text: 'Discordのチャットを', font: 'Bold', size: 42, y: 368, fill: '#4a3640', stroke: 8 },
    { text: '読み上げるBot', font: 'Bold', size: 42, y: 424, fill: '#4a3640', stroke: 8 },
];

// サイトのロゴと同じ Zen Maru Gothic。手元になければ Google Fonts のリポジトリから取ってくる
const fontDir = join(here, 'fonts');
const loadFont = async (weight) => {
    const file = join(fontDir, `ZenMaruGothic-${weight}.ttf`);
    if (!existsSync(file)) {
        const url = `https://github.com/google/fonts/raw/main/ofl/zenmarugothic/ZenMaruGothic-${weight}.ttf`;
        console.log(`フォントを取得します: ${url}`);
        const res = await fetch(url);
        if (!res.ok) throw new Error(`フォントを取得できませんでした（${res.status}）`);
        mkdirSync(fontDir, { recursive: true });
        writeFileSync(file, Buffer.from(await res.arrayBuffer()));
    }
    return opentype.loadSync(file);
};
const fonts = { Black: await loadFont('Black'), Bold: await loadFont('Bold') };

// 文字をパスにする。SVG の <text> だと、sharp（librsvg）が指定したフォントを使わず別の書体で描いてしまう
const toPath = ({ text, font, size, y }) => {
    const f = fonts[font];
    const width = f.getAdvanceWidth(text, size);
    return f.getPath(text, cx - width / 2, y, size).toPathData(2);
};

// 白いふちを先に描いて、その上に文字を塗る
const textLayer = [logo, ...lines]
    .map((item) => {
        const d = toPath(item);
        return `<path d="${d}" fill="none" stroke="#fff" stroke-width="${item.stroke}" stroke-linejoin="round"/><path d="${d}" fill="${item.fill}"/>`;
    })
    .join('');

// 背景。サイトの CTA と同じ、淡いピンクのグラデーションに白い水玉。キャラの後ろだけ白く明るくする
const charCx = character.left + character.height * 0.42;
const background = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff0f6"/>
      <stop offset="0.6" stop-color="#ffd3e3"/>
      <stop offset="1" stop-color="#ffe2d4"/>
    </linearGradient>
    <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse">
      <circle cx="13" cy="13" r="2.5" fill="#fff" fill-opacity="0.7"/>
    </pattern>
    <radialGradient id="glow">
      <stop offset="0" stop-color="#fff" stop-opacity="0.95"/>
      <stop offset="0.6" stop-color="#fff" stop-opacity="0.5"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#dots)"/>
  <circle cx="${charCx}" cy="${H * 0.55}" r="340" fill="url(#glow)"/>
</svg>`;

// キャラ素材。体の不透明度がわずかに 255 未満なのを不透明にそろえ、ふちの外のごく薄いもやを消す
const { data, info } = await sharp(src).ensureAlpha().resize({ height: character.height }).raw().toBuffer({ resolveWithObject: true });
for (let i = 3; i < data.length; i += 4) {
    if (data[i] >= 240) data[i] = 255;
    else if (data[i] < 12) data[i] = 0;
}
// 画像より背が高いときは、はみ出した上の分を切る
const overflow = Math.max(0, info.height - H);
const chara = await sharp(data, { raw: info })
    .extract({ left: 0, top: overflow, width: Math.min(info.width, W - character.left), height: info.height - overflow })
    .png()
    .toBuffer();

await sharp(Buffer.from(background))
    .composite([
        { input: chara, left: character.left, top: H - (info.height - overflow) },
        { input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${textLayer}</svg>`) },
    ])
    .flatten({ background: '#ffffff' })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(out);

console.log(`書き出しました: ${out}`);
