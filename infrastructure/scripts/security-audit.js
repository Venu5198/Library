#!/usr/bin/env node
/**
 * security-audit.js — Runs npm audit on all projects.
 *
 * Usage:
 *   node infrastructure/scripts/security-audit.js
 */

import { execSync } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../../");
const PROJECTS = ["ui-library", "frontend", "backend"];

console.log("═══════════════════════════════════════════════════");
console.log("  Security Audit");
console.log("═══════════════════════════════════════════════════\n");

let anyFailed = false;

for (const project of PROJECTS) {
  console.log(`\n→ Auditing ${project}...`);
  const projectDir = resolve(ROOT, project);
  try {
    execSync("npm audit --audit-level=high", { cwd: projectDir, stdio: "inherit" });
    console.log(`  ✓ ${project}: No high/critical vulnerabilities`);
  } catch {
    console.error(`  ✗ ${project}: Vulnerabilities found — run 'npm audit' for details`);
    anyFailed = true;
  }
}

console.log();
if (anyFailed) {
  console.error("✗ Security audit found vulnerabilities. Review and fix before deploying.\n");
  process.exit(1);
} else {
  console.log("✓ All security audits passed.\n");
}
