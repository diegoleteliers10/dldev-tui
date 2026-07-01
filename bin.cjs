#!/usr/bin/env node
const { spawn, execSync } = require("child_process");
const path = require("path");

let hasBun = false;
try {
  execSync("bun --version", { stdio: "ignore" });
  hasBun = true;
} catch {}

if (hasBun) {
  const scriptPath = path.join(__dirname, "dist", "index.js");
  const child = spawn("bun", [scriptPath, ...process.argv.slice(2)], {
    stdio: "inherit"
  });
  child.on("exit", (code) => {
    process.exit(code ?? 0);
  });
} else {
  console.error("\n\x1b[31mError: dlsdev requires Bun to run (due to native OpenTUI FFI rendering).\x1b[0m");
  console.error("Please install Bun on your system by running:");
  console.error("  curl -fsSL https://bun.sh/install | bash");
  console.error("\nAfter installing Bun, you can run this command again!");
  process.exit(1);
}
