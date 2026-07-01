import { exec } from "child_process"

export function openUrl(url: string) {
  const start =
    process.platform === "darwin"
      ? "open"
      : process.platform === "win32"
      ? "start"
      : "xdg-open";
  
  // Use spawn/exec safely or simply exec. For a simple URL it is standard.
  exec(`${start} "${url.replace(/"/g, '\\"')}"`);
}
