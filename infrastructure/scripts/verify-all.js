#!/usr/bin/env node
/**
 * verify-all.js — Cross-platform CI verification script.
 *
 * Runs: typecheck + lint + format:check + test + build
 * for each of: ui-library, frontend, backend
 *
 * Usage:
 *   node infrastructure/scripts/verify-all.js
 *   node infrastructure/scripts/verify-all.js ui-library
 *   node infrastructure/scripts/verify-all.js frontend backend
 */

import { execSync } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../../");

const PROJECTS = ["ui-library", "frontend", "backend"];
const STEPS = ["typecheck", "lint", "format:check", "test", "build"];

const targets = process.argv.slice(2).length
  ? process.argv.slice(2)
  : PROJECTS;

const results = [];

function run(step, cwd) {
  execSync(`npm run ${step}`, { cwd, stdio: "inherit" });
}

console.log("═══════════════════════════════════════════════════");
console.log("  MyPlatform — Full Verification Suite");
console.log("═══════════════════════════════════════════════════\n");

for (const project of targets) {
  const projectDir = resolve(ROOT, project);

  if (!existsSync(projectDir)) {
    console.warn(`⚠ Skipping '${project}' — directory not found`);
    continue;
  }

  if (project !== "backend" && !existsSync(resolve(projectDir, "node_modules"))) {
    console.log(`→ Installing dependencies for ${project}...`);
    execSync("npm install", { cwd: projectDir, stdio: "inherit" });
  }

  console.log(`\n┌─────────────────────────────────────────┐`);
  console.log(`│  Verifying: ${project.padEnd(27)} │`);
  console.log(`└─────────────────────────────────────────┘`);

  const projectResult = { project, steps: {} };
  let projectFailed = false;

  if (project === "backend") {
    process.stdout.write(`  ✦ ${"pytest".padEnd(20)}`);
    try {
      execSync("python -m pytest tests", { cwd: projectDir, stdio: "inherit" });
      process.stdout.write(" ✓\n");
      projectResult.steps["pytest"] = "pass";
    } catch {
      process.stdout.write(" ✗ FAILED\n");
      projectResult.steps["pytest"] = "fail";
      projectFailed = true;
    }
  } else {
    for (const step of STEPS) {
      process.stdout.write(`  ✦ ${step.padEnd(20)}`);
      try {
        run(step, projectDir);
        process.stdout.write(" ✓\n");
        projectResult.steps[step] = "pass";
      } catch {
        process.stdout.write(" ✗ FAILED\n");
        projectResult.steps[step] = "fail";
        projectFailed = true;
        // Continue to check remaining steps but mark failure
      }
    }
  }

  projectResult.status = projectFailed ? "FAILED" : "PASSED";
  results.push(projectResult);
}

// ── Summary ────────────────────────────────────────────────────────────

console.log("\n═══════════════════════════════════════════════════");
console.log("  Summary");
console.log("═══════════════════════════════════════════════════");

let anyFailed = false;
for (const result of results) {
  const icon = result.status === "PASSED" ? "✓" : "✗";
  console.log(`  ${icon} ${result.project}: ${result.status}`);
  if (result.status !== "PASSED") anyFailed = true;
}

console.log();
if (anyFailed) {
  console.error("✗ Verification FAILED — fix the errors above before committing.\n");
  process.exit(1);
} else {
  console.log("✓ All projects verified successfully!\n");
}
