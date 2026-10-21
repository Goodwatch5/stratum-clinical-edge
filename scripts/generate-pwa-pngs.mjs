import fs from "fs";
import zlib from "zlib";

function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type);
  const toCrc = Buffer.concat([typeBuf, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(toCrc), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function createPng(width, height, isMaskable = false) {
  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type: RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdr = makeChunk("IHDR", ihdrData);

  // Generate pixel data
  // Color palette:
  // Background: #1a1a1a (26, 26, 26)
  // Accent gold: #c5a27d (197, 162, 125)
  // Shield fill: #24252b (36, 37, 43)
  // White: #FAF7F2 (250, 247, 242)

  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * (isMaskable ? 0.40 : 0.46);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // filter type 0 (None)

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Default background: dark slate #1a1a1a
      let r = 26, g = 26, b = 26, a = 255;

      // Outer gold circle/shield boundary
      if (Math.abs(dist - radius) <= width * 0.02) {
        r = 197; g = 162; b = 125; // gold
      } else if (dist < radius) {
        // Inside shield area
        r = 36; g = 37; b = 43;

        // Draw cross inside shield
        const crossW = width * 0.08;
        const crossH = width * 0.32;
        const inVert = Math.abs(dx) <= crossW && Math.abs(dy) <= crossH;
        const inHoriz = Math.abs(dy) <= crossW && Math.abs(dx) <= crossH;

        if (inVert || inHoriz) {
          r = 197; g = 162; b = 125; // gold cross
        }
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idat = makeChunk("IDAT", compressedData);
  const iend = makeChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([header, ihdr, idat, iend]);
}

const p192 = createPng(192, 192, false);
fs.writeFileSync("public/icon-192.png", p192);

const p512 = createPng(512, 512, false);
fs.writeFileSync("public/icon-512.png", p512);

const pMaskable = createPng(512, 512, true);
fs.writeFileSync("public/icon-maskable-512.png", pMaskable);

const appleIcon = createPng(180, 180, false);
fs.writeFileSync("public/apple-touch-icon.png", appleIcon);

console.log("PWA PNG icon assets generated successfully in public/.");
