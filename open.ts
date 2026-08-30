import { spawn } from "child_process"

export function openUrl(url: string): void {
  try {
    const isDarwin = process.platform === "darwin"
    const isWin = process.platform === "win32"
    const cmd = isDarwin ? "open" : isWin ? "cmd.exe" : "xdg-open"
    const args = isWin ? ["/c", "start", '""', url] : [url]

    const child = spawn(cmd, args, { stdio: "ignore", detached: true })
    child.unref()
  } catch {
    // Fail silently in headless or restricted terminal environments
  }
}

