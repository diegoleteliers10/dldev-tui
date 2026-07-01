import { useState, useEffect } from "react"
import { t, bold, fg, dim } from "@opentui/core"
import { useTheme, type Theme } from "../data"
import os from "os"

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / (3600 * 24))
  const h = Math.floor((seconds % (3600 * 24)) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)

  const parts = []
  if (d > 0) parts.push(`${d}d`)
  if (h > 0) parts.push(`${h}h`)
  if (m > 0) parts.push(`${m}m`)
  parts.push(`${s}s`)
  return parts.join(" ")
}

function makeProgressBar(percentage: number, theme: Theme, width: number = 20): string {
  const filled = Math.round((percentage / 100) * width)
  const empty = width - filled
  return "\u2588".repeat(filled) + "\u2591".repeat(empty)
}

interface SystemInfo {
  platform: string
  release: string
  arch: string
  hostname: string
  cpuModel: string
  cpuCores: number
  totalMemGB: number
  freeMemGB: number
  usedMemGB: number
  memPercentage: number
  uptimeSec: number
  loadAvg: number[]
  ipAddress: string
}

function getSystemInfo(): SystemInfo {
  const totalMem = os.totalmem()
  const freeMem = os.freemem()
  const usedMem = totalMem - freeMem

  const totalMemGB = totalMem / (1024 * 1024 * 1024)
  const freeMemGB = freeMem / (1024 * 1024 * 1024)
  const usedMemGB = usedMem / (1024 * 1024 * 1024)
  const memPercentage = (usedMem / totalMem) * 100

  const cpus = os.cpus()
  const cpuModel = cpus.length > 0 ? (cpus[0]?.model?.trim() ?? "Unknown CPU") : "Unknown CPU"

  // Get first external IPv4 address
  const interfaces = os.networkInterfaces()
  let ipAddress = "127.0.0.1"
  for (const name of Object.keys(interfaces)) {
    const netList = interfaces[name]
    if (netList) {
      for (const net of netList) {
        if (net.family === "IPv4" && !net.internal) {
          ipAddress = net.address
          break
        }
      }
    }
  }

  return {
    platform: os.platform(),
    release: os.release(),
    arch: os.arch(),
    hostname: os.hostname(),
    cpuModel,
    cpuCores: cpus.length,
    totalMemGB,
    freeMemGB,
    usedMemGB,
    memPercentage,
    uptimeSec: os.uptime(),
    loadAvg: os.loadavg(),
    ipAddress,
  }
}

export function SystemScreen() {
  const theme = useTheme()
  const [info, setInfo] = useState<SystemInfo>(getSystemInfo())

  useEffect(() => {
    const timer = setInterval(() => {
      setInfo(getSystemInfo())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <box style={{ flexDirection: "column", gap: 1, padding: 1, flexGrow: 1 }}>
      <box style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <text content={t`${bold(fg(theme.accent)("system status"))} ${dim("// diagnostics & resources")}`} />
        <text content={t`${fg(theme.muted)("host:")} ${fg(theme.fg)(info.hostname)}`} />
      </box>
      <text content={t`${dim("────────────────────────────────────────────────────────")}`} />

      {/* Main system layout */}
      <box style={{ flexDirection: "row", gap: 3, flexGrow: 1 }}>
        
        {/* Left Column: OS & Platform */}
        <box
          title=" OS Info "
          titleColor={theme.accent}
          style={{
            flexDirection: "column",
            gap: 1,
            flexGrow: 1,
            padding: 1,
            borderStyle: "rounded",
            borderColor: theme.border,
          }}
        >
          <text content={t`  ${fg(theme.muted)("platform")}  ${fg(theme.fg)(info.platform)}`} />
          <text content={t`  ${fg(theme.muted)("release")}   ${fg(theme.fg)(info.release.slice(0, 16))}`} />
          <text content={t`  ${fg(theme.muted)("arch")}      ${fg(theme.fg)(info.arch)}`} />
          <text content={t`  ${fg(theme.muted)("uptime")}    ${fg(theme.success)(formatUptime(info.uptimeSec))}`} />
          <text content={t`  ${fg(theme.muted)("ip addr")}   ${fg(theme.link)(info.ipAddress)}`} />
        </box>

        {/* Right Column: Hardware & Specs */}
        <box
          title=" Hardware & Resources "
          titleColor={theme.accent}
          style={{
            flexDirection: "column",
            gap: 1,
            flexGrow: 2,
            padding: 1,
            borderStyle: "rounded",
            borderColor: theme.border,
          }}
        >
          <text content={t`  ${fg(theme.muted)("CPU")}  ${fg(theme.fg)(info.cpuModel)}`} />
          <text content={t`  ${fg(theme.muted)("Cores")} ${fg(theme.fg)(String(info.cpuCores))} threads`} />
          <text content={t`  ${fg(theme.muted)("Load")}  ${fg(theme.fg)(info.loadAvg.map(l => l.toFixed(2)).join(" "))}`} />
          
          <box style={{ flexDirection: "column", marginTop: 1 }}>
            <box style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <text content={t`  ${fg(theme.muted)("RAM Usage")}`} />
              <text content={t`${fg(theme.accent)(info.memPercentage.toFixed(1) + "%")} ${dim(`(${info.usedMemGB.toFixed(1)}GB / ${info.totalMemGB.toFixed(1)}GB)`)}`} />
            </box>
            <text content={t`  ${fg(theme.accentDim)(makeProgressBar(info.memPercentage, theme, 25))}`} />
          </box>
        </box>

      </box>

      {/* Runtimes & Dev Info */}
      <box
        title=" Runtime Environment "
        titleColor={theme.accent}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 1,
          borderStyle: "rounded",
          borderColor: theme.border,
        }}
      >
        <text content={t`  ${fg(theme.muted)("bun:")} ${fg(theme.fg)(typeof Bun !== "undefined" ? Bun.version : "N/A")} `} />
        <text content={t`  ${fg(theme.muted)("node:")} ${fg(theme.fg)(process.versions.node)}`} />
        <text content={t`  ${fg(theme.muted)("pid:")} ${fg(theme.fg)(String(process.pid))}`} />
        <text content={t`  ${fg(theme.muted)("memory:")} ${fg(theme.fg)((process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1) + " MB")}`} />
      </box>

      <text content={t`${dim("────────────────────────────────────────────────────────")}`} />
      <text content={t`  ${dim("1-6 switch")}  ${dim("t")} ${fg(theme.muted)("theme")}  ${dim("q")} ${fg(theme.muted)("back")}`} />
    </box>
  )
}
