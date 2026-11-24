// internet-1800-01 — one sentence for a traveler from 1800.
//
// The program writes a single sentence to entry.txt in the output
// directory. The sentence pictures the modern internet for a reader
// from the year 1800, using only words and pictures from that
// reader's own time: a post office, a library, a road, letters,
// a friend across the sea. No word coined after 1800 appears in it.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: one sentence, at most 200 characters, no trailing newline.
const ENTRY =
  "It is a post office and library joined to every house by one road, where letters arrive the instant they are written and a friend across the sea speaks as though beside you.";

// Words coined after 1800 that a reader from that year could not know.
// The sentence must contain none of them (case-insensitive, whole word).
const FORBIDDEN = [
  "internet",
  "computer",
  "phone",
  "telephone",
  "electricity",
  "electric",
  "television",
  "digital",
  "online",
  "website",
  "web",
  "email",
  "screen",
  "software",
  "hardware",
  "server",
  "wifi",
  "wireless",
  "radio",
  "robot",
  "video",
  "pixel",
  "data",
  "cyber",
  "smartphone",
  "modem",
  "satellite",
  "airplane",
  "automobile",
  "keyboard",
  "monitor",
  "download",
  "upload",
  "browser",
  "password",
  "machine",
  "engine",
  "app",
  "code",
];

function fail(message: string): never {
  throw new Error(`internet-1800-01: ${message}`);
}

function validateEntry(text: string): void {
  const chars = [...text].length;
  if (chars < 1 || chars > 200) {
    fail(`entry must be 1 to 200 characters, got ${chars}`);
  }
  if (text.trim().length === 0) {
    fail("entry must not be only white space");
  }
  if (text.includes("\n") || text.includes("\r")) {
    fail("entry must be a single line with no newline inside it");
  }
  if (!text.endsWith(".")) {
    fail("entry must be one sentence ending with a full stop");
  }
  if (text !== text.trim()) {
    fail("entry must not start or end with white space");
  }
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(text)) {
    fail("entry must not contain control characters (only printable text allowed)");
  }
  for (const word of FORBIDDEN) {
    const pattern = new RegExp(`\\b${word}\\b`, "i");
    if (pattern.test(text)) {
      fail(`entry must not use the word "${word}", coined after 1800`);
    }
  }
}

function main(): void {
  validateEntry(ENTRY);

  const outDir =
    process.env.MAKEFUN_OUTPUT_DIR || process.env.OUTPUT_DIR || "/output";
  if (outDir === ".") {
    fail('output directory must not be "."');
  }
  mkdirSync(outDir, { recursive: true });

  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, ENTRY, "utf8");

  const back = readFileSync(outPath, "utf8");
  if (back !== ENTRY) {
    fail("read-back mismatch: entry.txt does not hold the entry text");
  }

  console.log(ENTRY);
}

main();
