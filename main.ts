// Gate for the one-line review of a boring object.
//
// The review lives in line.txt next to this script. This program loads it,
// checks that it is exactly one sentence of at most 200 characters, and
// publishes it unchanged as entry.txt in the output folder. The file is
// written with no trailing newline so its bytes match line.txt exactly.

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const MAX_REVIEW_CHARS = 200;
const SENTENCE_SPLIT = /[.!?]/;

function sentenceChunkCount(review: string): number {
  return review.split(SENTENCE_SPLIT).filter((chunk) => chunk.length > 0).length;
}

function loadReview(): string {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const reviewFile = path.join(scriptDir, "line.txt");
  const raw = fs.readFileSync(reviewFile, "utf8");
  return raw.trim();
}

function isWithinLimit(review: string): boolean {
  return review.length > 0 && review.length <= MAX_REVIEW_CHARS;
}

function checkReview(review: string): void {
  if (!isWithinLimit(review)) {
    throw new Error("review line must be 1-200 characters");
  }
  if (sentenceChunkCount(review) !== 1) {
    throw new Error("review line must be a single sentence");
  }
}

function publishReview(review: string): void {
  const destination = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  fs.mkdirSync(destination, { recursive: true });
  const target = path.join(destination, "entry.txt");
  fs.writeFileSync(target, review);
}

const reviewText = loadReview();
checkReview(reviewText);
publishReview(reviewText);
console.log(reviewText);
