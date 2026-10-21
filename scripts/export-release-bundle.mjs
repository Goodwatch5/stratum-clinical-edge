#!/usr/bin/env node
/**
 * Stratum Clinical Edge - Export & Standalone Release Packager
 * Packages the clean repository into a production release tarball / zip
 * excluding node_modules, cache, and build artifacts.
 */

import { execSync } from "child_process";
import { existsSync, mkdirSync } from "fs";
import path from "path";

const releaseDir = path.join(process.cwd(), "release-bundle");
if (!existsSync(releaseDir)) {
  mkdirSync(releaseDir, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const tarballName = `stratum-clinical-edge-release-${timestamp}.tar.gz`;
const tarballPath = path.join(releaseDir, tarballName);

console.log("==================================================================");
console.log("       STRATUM CLINICAL EDGE - PRODUCTION RELEASE PACKAGER        ");
console.log("==================================================================");
console.log(`Packaging target: ${tarballPath}`);

try {
  // Use git archive if in a git repo to ensure 100% clean, pristine files
  execSync(`git archive --format=tar.gz -o "${tarballPath}" HEAD`, { stdio: "inherit" });
  console.log(`\n✔ Release bundle successfully created at: ${tarballPath}`);
  console.log(`Bundle size: ${(execSync(`du -h "${tarballPath}"`).toString().trim().split("\t")[0])}`);
  console.log("\nTo deploy this bundle on any external server or machine:");
  console.log("  1. Extract: tar -xzf " + tarballName);
  console.log("  2. Install: npm ci");
  console.log("  3. Build:   npm run build");
  console.log("  4. Start:   npm start (or docker compose up --build)");
  console.log("==================================================================");
} catch (error) {
  console.error("Failed to create git archive:", error.message);
  process.exit(1);
}
