#!/usr/bin/env node
const path = require("path");

const isAlreadyBun = typeof Bun !== "undefined" || Boolean(process.versions && process.versions.bun);
const scriptPath = path.join(__dirname, "dist", "index.js");

if (isAlreadyBun) {
  // Directly execute in the current Bun process to preserve TTY, stdin, and resize signals
  require(scriptPath);
} else {
  const { spawnSync, spawn } = require("child_process");
  let hasBun = false;
  try {
    const check = spawnSync("bun", ["--version"], { stdio: "ignore" });
    hasBun = check.status === 0;
  } catch {}

  if (hasBun) {
    const child = spawn("bun", [scriptPath, ...process.argv.slice(2)], {
      stdio: "inherit",
      env: process.env,
    });
    child.on("exit", (code) => {
      process.exit(code ?? 0);
    });
  } else {
    console.error("\n\x1b[31mError: dlsdev requires Bun to run (native OpenTUI terminal rendering).\x1b[0m");
    console.error("Please install Bun by running:");
    console.error("  curl -fsSL https://bun.sh/install | bash");
    console.error("\nThen run 'npx dlsdev' or 'bunx dlsdev' again!");
    process.exit(1);
  }
}

