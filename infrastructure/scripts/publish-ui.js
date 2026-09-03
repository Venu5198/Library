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
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../../");
const UI_DIR = resolve(ROOT, "ui-library");
const REGISTRY = process.env.NPM_REGISTRY_URL || "http://127.0.0.1:4873";

function run(cmd, cwd = UI_DIR) {
  console.log(`\n> ${cmd}`);
  try {
    const output = execSync(cmd, { cwd, stdio: "pipe" });
    process.stdout.write(output);
    return output.toString();
  } catch (err) {
    const output = (err.stdout ? err.stdout.toString() : "") + (err.stderr ? err.stderr.toString() : "");
    process.stderr.write(output);
    err.outputCombined = output;
    throw err;
  }
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
  const { default: http } = await import("http");
  function checkUrl(url) {
    return new Promise((resolve) => {
      const req = http.get(`${url}/-/ping`, (res) => {
        resolve(res.statusCode === 200);
      });
      req.on("error", () => resolve(false));
      req.setTimeout(3000, () => {
        req.destroy();
        resolve(false);
      });
    });
  }

  let activeRegistry = null;
  for (const candidate of [REGISTRY, "http://127.0.0.1:4873", "http://localhost:4873"]) {
    if (await checkUrl(candidate)) {
      activeRegistry = candidate;
      break;
    }
  }

  if (!activeRegistry) {
    console.error(`\n✗ Cannot reach Verdaccio at ${REGISTRY}`);
    console.error("  Make sure Verdaccio is running:");
    console.error("    docker compose up verdaccio");
    console.error("  Or via npx: npx verdaccio");
    process.exit(1);
  }
  console.log(`✓ Verdaccio is reachable at ${activeRegistry}`);

  const pkg = readPackageJson(UI_DIR);
  let version = targetVersion ?? pkg.version;

  if (targetVersion && targetVersion !== pkg.version) {
    console.log(`\n→ Updating package.json version: ${pkg.version} → ${targetVersion}`);
    pkg.version = targetVersion;
    writePackageJson(UI_DIR, pkg);
    version = targetVersion;
  }

  console.log(`\n→ Publishing @myorg/ui@${version} to ${REGISTRY}\n`);

  // Step 1: Install deps (if needed)
  if (!existsSync(resolve(UI_DIR, "node_modules"))) {
    console.log("Step 1/3: Installing dependencies with npm ci...");
    run("npm ci");
  } else {
    console.log("Step 1/3: Dependencies already installed. Skipping.");
  }

  // Step 2: Build
  console.log("\nStep 2/3: Building library...");
  run("npm run build");

  // Step 3: Publish
  console.log(`\nStep 3/3: Publishing to ${activeRegistry}...`);
  try {
    run(`npm publish --registry ${activeRegistry}`);
    console.log(`\n✓ Successfully published @myorg/ui@${version} to ${activeRegistry}`);
  } catch (err) {
    const errorOutput = (err.outputCombined || "") + (err.stdout?.toString() || "") + (err.stderr?.toString() || "") + (err.message || "");
    if (errorOutput.includes("previously published") || errorOutput.includes("already published") || errorOutput.includes("EPUBLISHCONFLICT") || errorOutput.includes("409")) {
      console.log(`\n✓ @myorg/ui@${version} is already published or registered in ${activeRegistry}`);
    } else {
      console.error(`\n✗ Genuine publish failure:\n${errorOutput}`);
      throw err;
    }
  }
  console.log(`\nConsumers can install with:`);
  console.log(`  npm install @myorg/ui@${version}`);
  console.log(`\nView in Verdaccio: ${REGISTRY}/-/web/detail/@myorg/ui`);
}

main().catch((err) => {
  console.error("\n✗ Publish failed:", err.message);
  process.exit(1);
});
