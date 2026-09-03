#!/usr/bin/env node
/**
 * publish-ui.js — Cross-platform script to build and publish @myorg/ui to Verdaccio.
 *
 * Usage:
 *   node infrastructure/scripts/publish-ui.js          # Publish current version
 *   node infrastructure/scripts/publish-ui.js 0.2.0   # Publish specific version
 *
 * Prerequisites:
 *   - Verdaccio running at http://localhost:4873
 *   - ui-library dependencies installed (npm install in ui-library/)
 */

import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../../");
const UI_DIR = resolve(ROOT, "ui-library");
const REGISTRY = "http://localhost:4873";

function run(cmd, cwd = UI_DIR) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { cwd, stdio: "inherit" });
}

function readPackageJson(dir) {
  return JSON.parse(readFileSync(resolve(dir, "package.json"), "utf-8"));
}

function writePackageJson(dir, data) {
  writeFileSync(resolve(dir, "package.json"), JSON.stringify(data, null, 2) + "\n", "utf-8");
}

async function main() {
  const targetVersion = process.argv[2];

  console.log("═══════════════════════════════════════════════════");
  console.log("  @myorg/ui Publisher");
  console.log("═══════════════════════════════════════════════════\n");

  // Check Verdaccio is reachable
  try {
    const { default: http } = await import("http");
    await new Promise((resolve, reject) => {
      const req = http.get(`${REGISTRY}/-/ping`, (res) => {
        if (res.statusCode === 200) resolve(true);
        else reject(new Error(`Verdaccio returned ${res.statusCode}`));
      });
      req.on("error", reject);
      req.setTimeout(5000, () => {
        req.destroy(new Error("Timeout connecting to Verdaccio"));
      });
    });
    console.log(`✓ Verdaccio is reachable at ${REGISTRY}`);
  } catch (err) {
    console.error(`\n✗ Cannot reach Verdaccio at ${REGISTRY}`);
    console.error("  Make sure Verdaccio is running:");
    console.error("    docker compose up verdaccio");
    console.error("  Or via npx: npx verdaccio");
    process.exit(1);
  }

  const pkg = readPackageJson(UI_DIR);
  let version = targetVersion ?? pkg.version;

  if (targetVersion && targetVersion !== pkg.version) {
    console.log(`\n→ Updating package.json version: ${pkg.version} → ${targetVersion}`);
    pkg.version = targetVersion;
    writePackageJson(UI_DIR, pkg);
    version = targetVersion;
  }

  console.log(`\n→ Publishing @myorg/ui@${version} to ${REGISTRY}\n`);

  // Step 1: Install deps
  console.log("Step 1/3: Installing dependencies...");
  run("npm install");

  // Step 2: Build
  console.log("\nStep 2/3: Building library...");
  run("npm run build");

  // Step 3: Publish
  console.log("\nStep 3/3: Publishing to Verdaccio...");
  run(`npm publish --registry ${REGISTRY}`);

  console.log(`\n✓ Successfully published @myorg/ui@${version} to ${REGISTRY}`);
  console.log(`\nConsumers can install with:`);
  console.log(`  npm install @myorg/ui@${version}`);
  console.log(`\nView in Verdaccio: ${REGISTRY}/-/web/detail/@myorg/ui`);
}

main().catch((err) => {
  console.error("\n✗ Publish failed:", err.message);
  process.exit(1);
});
