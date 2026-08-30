import { useState, useEffect } from "react"
import { t, bold, fg, dim } from "@opentui/core"
import { useTheme, PROFILE } from "../data"

interface DayData {
  date: string
  level: number
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const LEVEL_COLORS = [
  "#1E222B", // 0 — dark empty
  "#0E4429", // 1 — dark green
  "#006D32", // 2 — medium green
  "#26A641", // 3 — bright green
  "#39D353", // 4 — vivid green
]

function mergeTStrings(...parts: Array<ReturnType<typeof t>>) {
  const chunks: unknown[] = []
  for (const part of parts) {
    const p = part as unknown as { chunks?: unknown[] }
    if (p.chunks) {
      chunks.push(...p.chunks)
    }
  }
  return { chunks } as ReturnType<typeof t>
}

function useHeatmapData() {
  const [grid, setGrid] = useState<DayData[] | null>(null)
  const [stats, setStats] = useState<{
    total: number
    activeDays: number
    currentStreak: number
    longestStreak: number
    bestDay: string
    avgPerDay: string
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await fetch(`https://github.com/users/${PROFILE.handle}/contributions`)
        if (!res.ok) throw new Error("Failed to fetch")
        const html = await res.text()

        const matches: DayData[] = []
        const regex = /data-date="([\d-]+)"[^>]*data-level="(\d+)"/g
        let match: RegExpExecArray | null
        while ((match = regex.exec(html)) !== null) {
          if (match[1] && match[2]) {
            matches.push({ date: match[1], level: parseInt(match[2], 10) })
          }
        }

        if (matches.length === 0) throw new Error("No data")
        matches.sort((a, b) => a.date.localeCompare(b.date))

        let total = 0
        let activeDays = 0
        const dayOfWeekCount = Array(7).fill(0)
        let runningStreak = 0
        let longestStreak = 0

        for (const day of matches) {
          total += day.level
          if (day.level > 0) {
            activeDays++
            runningStreak++
            if (runningStreak > longestStreak) longestStreak = runningStreak
          } else {
            runningStreak = 0
          }
          const dow = new Date(day.date + "T12:00:00").getDay()
          dayOfWeekCount[dow] = (dayOfWeekCount[dow] ?? 0) + day.level
        }

        let currentStreak = 0
        const activityMap = new Map<string, number>()
        for (const d of matches) activityMap.set(d.date, d.level)

        const todayStr = new Date().toISOString().split("T")[0] ?? ""
        const yest = new Date()
        yest.setDate(yest.getDate() - 1)
        const yesterdayStr = yest.toISOString().split("T")[0] ?? ""

        if ((activityMap.get(todayStr) ?? 0) > 0 || (activityMap.get(yesterdayStr) ?? 0) > 0) {
          const start = (activityMap.get(todayStr) ?? 0) > 0 ? new Date() : yest
          while (true) {
            const s = start.toISOString().split("T")[0] ?? ""
            if ((activityMap.get(s) ?? 0) > 0) {
              currentStreak++
              start.setDate(start.getDate() - 1)
            } else break
          }
        }

        const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        let maxDow = -1
        let bestIdx = 0
        for (let i = 0; i < 7; i++) {
          if ((dayOfWeekCount[i] ?? 0) > maxDow) {
            maxDow = dayOfWeekCount[i] ?? 0
            bestIdx = i
          }
        }

        const avgPerDay = activeDays > 0 ? (total / activeDays).toFixed(1) : "0"

        if (active) {
          setGrid(matches)
          setStats({
            total,
            activeDays,
            currentStreak,
            longestStreak,
            bestDay: DOW[bestIdx] ?? "Wed",
            avgPerDay,
          })
        }
      } catch {
        const mock: DayData[] = []
        const today = new Date()
        const start = new Date(today)
        start.setDate(start.getDate() - 364)
        while (start.getDay() !== 0) start.setDate(start.getDate() - 1)
        const cur = new Date(start)
        while (cur <= today) {
          const pseudo = (cur.getDay() % 3 === 0 || cur.getDate() % 4 === 0) ? (cur.getDate() % 4) + 1 : 0
          mock.push({ date: cur.toISOString().split("T")[0] ?? "", level: pseudo })
          cur.setDate(cur.getDate() + 1)
        }

        if (active) {
          setGrid(mock)
          setStats({
            total: 184,
            activeDays: 112,
            currentStreak: 6,
            longestStreak: 19,
            bestDay: "Wed",
            avgPerDay: "1.6",
          })
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchData()
    return () => {
      active = false
    }
  }, [])

  return { grid, stats, loading }
}

function progressBar(value: number, max: number, width: number, color: string, bgColor: string): ReturnType<typeof t> {
  const filled = max > 0 ? Math.round((value / max) * width) : 0
  const empty = Math.max(0, width - filled)
  return t`${fg(color)("━".repeat(filled))}${fg(bgColor)("━".repeat(empty))}`
}

export function HeatmapScreen({ width, height }: { width?: number; height?: number }) {
  const currentWidth = width || 80
  const currentHeight = height || 40
  const isNarrow = currentWidth < 85
  const isShort = currentHeight < 26
  const theme = useTheme()
  const { grid, stats, loading } = useHeatmapData()

  if (loading || !grid) {
    return (
      <box style={{ flexDirection: "column", gap: 1, padding: 1, flexGrow: 1 }}>
        <text content={t`${bold(fg(theme.accent)("CONTRIBUTION HEATMAP"))} ${dim("// loading...")}`} />
        <text content={t`  ${dim("Connecting to GitHub contributions graph...")}`} />
      </box>
    )
  }

  // Split into weeks
  const weeks: DayData[][] = []
  for (let i = 0; i < grid.length; i += 7) {
    const chunk = grid.slice(i, i + 7)
    if (chunk.length > 0) weeks.push(chunk)
  }

  const sidebarW = currentWidth < 65 ? 6 : currentWidth < 90 ? 10 : 22
  const labelW = 4
  const availableForGrid = Math.max(16, currentWidth - sidebarW - 8 - labelW)
  const maxWeeksFit = Math.min(52, Math.max(12, Math.floor(availableForGrid / 1)))
  const visibleWeeks = weeks.slice(-maxWeeksFit)

  const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""]

  const dayRows = DAY_LABELS.map((label, dayIdx) => {
    const parts: Array<ReturnType<typeof t>> = []
    parts.push(t`${fg(theme.muted)((label || " ").padEnd(labelW))}`)

    for (const week of visibleWeeks) {
      const d = week[dayIdx]
      const level = d?.level ?? 0
      const color = LEVEL_COLORS[level] ?? LEVEL_COLORS[0] ?? "#1E222B"
      parts.push(t`${fg(color)("█")}`)
    }

    return mergeTStrings(...parts)
  })

  // Build month header aligned with weeks
  const monthParts: Array<ReturnType<typeof t>> = []
  monthParts.push(t`${"".padEnd(labelW)}`)

  let lastMonth = -1
  let colsSinceLabel = 0
  for (let w = 0; w < visibleWeeks.length; w++) {
    const week = visibleWeeks[w]
    const firstDay = week?.[0]
    if (firstDay) {
      const d = new Date(firstDay.date + "T12:00:00")
      const m = d.getMonth()
      if (m !== lastMonth && colsSinceLabel >= 3) {
        const label = MONTHS[m] ?? ""
        monthParts.push(t`${fg(theme.muted)(label)}`)
        w += Math.max(0, label.length - 1)
        lastMonth = m
        colsSinceLabel = 0
        continue
      }
      lastMonth = lastMonth === -1 ? m : lastMonth
    }
    monthParts.push(t` `)
    colsSinceLabel++
  }

  const monthRow = mergeTStrings(...monthParts)

  return (
    <box style={{ flexDirection: "column", gap: 1, padding: 1, flexGrow: 1 }}>
      <box style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <text content={t`${bold(fg(theme.accent)("GITHUB CONTRIBUTIONS"))} ${dim(`// @${PROFILE.handle} · last ${visibleWeeks.length} weeks`)}`} />
        <text content={t`${fg(theme.muted)("Activity:")} ${bold(fg(theme.success)(`${stats?.total ?? 0} total`))}`} />
      </box>
      <text content={t`${dim("────────────────────────────────────────────────────────────────────────")}`} />

      {/* Contribution graph box */}
      <box
        title=" Contribution Graph "
        titleColor={theme.accent}
        style={{
          flexDirection: "column",
          padding: 1,
          borderStyle: "rounded",
          borderColor: theme.border,
        }}
      >
        <text content={monthRow} />
        {dayRows.map((row, i) => (
          <text key={i} content={row} />
        ))}
        <text content={t``} />
        <text content={t`  ${fg(theme.muted)("Less")} ${fg(LEVEL_COLORS[0] ?? "")("█")}${fg(LEVEL_COLORS[1] ?? "")("█")}${fg(LEVEL_COLORS[2] ?? "")("█")}${fg(LEVEL_COLORS[3] ?? "")("█")}${fg(LEVEL_COLORS[4] ?? "")("█")} ${fg(theme.muted)("More")}  ${dim(`(1 block = 1 day)`)}`} />
      </box>

      {/* Stats row */}
      {stats && !isShort && (
        <box style={{ flexDirection: isNarrow ? "column" : "row", gap: 1, flexGrow: 1 }}>
          <box
            title=" Current Streak "
            titleColor={theme.accent}
            style={{
              flexDirection: "column",
              flexGrow: 1,
              padding: 1,
              borderStyle: "rounded",
              borderColor: theme.border,
            }}
          >
            <text content={t`  ${bold(fg(theme.success)(String(stats.currentStreak)))} ${fg(theme.muted)("days")}`} />
            <text content={progressBar(stats.currentStreak, stats.longestStreak > 0 ? stats.longestStreak : 30, isNarrow ? 12 : 16, theme.success, theme.subtle)} />
          </box>

          <box
            title=" Longest Streak "
            titleColor={theme.accent}
            style={{
              flexDirection: "column",
              flexGrow: 1,
              padding: 1,
              borderStyle: "rounded",
              borderColor: theme.border,
            }}
          >
            <text content={t`  ${bold(fg(theme.accent)(String(stats.longestStreak)))} ${fg(theme.muted)("days")}`} />
            <text content={progressBar(stats.longestStreak, 365, isNarrow ? 12 : 16, theme.accent, theme.subtle)} />
          </box>

          <box
            title=" Active Days "
            titleColor={theme.accent}
            style={{
              flexDirection: "column",
              flexGrow: 1,
              padding: 1,
              borderStyle: "rounded",
              borderColor: theme.border,
            }}
          >
            <text content={t`  ${bold(fg(theme.link)(String(stats.activeDays)))} ${fg(theme.muted)("/ 365")}`} />
            <text content={progressBar(stats.activeDays, 365, isNarrow ? 12 : 16, theme.link, theme.subtle)} />
          </box>
        </box>
      )}

      {stats && isShort && (
        <box style={{ flexDirection: "row", justifyContent: "space-between", padding: 1 }}>
          <text content={t`  ${fg(theme.muted)("Current Streak:")} ${bold(fg(theme.success)(`${stats.currentStreak} days`))}`} />
          <text content={t`${fg(theme.muted)("Longest:")} ${bold(fg(theme.accent)(`${stats.longestStreak} days`))}`} />
          <text content={t`${fg(theme.muted)("Active:")} ${bold(fg(theme.link)(`${stats.activeDays}/365`))}  `} />
        </box>
      )}


      <text content={t`${dim("────────────────────────────────────────────────────────────────────────")}`} />
      <text content={t`  ${dim("Quick Keys:")} ${bold(fg(theme.accent)("1-0"))} ${dim("Screens")}  │  ${bold(fg(theme.accent)("[T]"))} ${dim("Theme")}  │  ${bold(fg(theme.accent)("[Q]"))} ${dim("Welcome Screen")}  │  ${bold(fg(theme.error)("[ESC]"))} ${dim("Exit")}`} />
    </box>
  )
}

