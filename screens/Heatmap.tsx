import { useState, useEffect } from "react"
import { t, bold, fg, dim } from "@opentui/core"
import { useTheme, PROFILE } from "../data"

interface DayData {
  date: string
  level: number
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

// GitHub-inspired green gradient (works on any theme bg)
const LEVEL_COLORS = [
  "#161B22", // 0 — near-invisible dark
  "#0E4429", // 1 — dark green
  "#006D32", // 2 — medium green
  "#26A641", // 3 — bright green
  "#39D353", // 4 — vivid green
]

/**
 * Build a TString by merging chunks from multiple t`` calls.
 * This avoids the [object Object] bug from .join() and the spacing
 * issues from rendering each cell as a separate <text> element.
 */
function mergeTStrings(...parts: Array<ReturnType<typeof t>>) {
  const chunks: unknown[] = []
  for (const part of parts) {
    // Access the chunks array from the TString object
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
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await fetch(`https://github.com/users/${PROFILE.handle}/contributions`)
        if (!res.ok) throw new Error("Failed to fetch")
        const html = await res.text()

        const matches: DayData[] = []
        const regex = /data-date="([\d-]+)"[^>]*data-level="(\d+)"/g
        let match
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
          dayOfWeekCount[dow] += day.level
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
          if ((dayOfWeekCount[i] ?? 0) > maxDow) { maxDow = dayOfWeekCount[i] ?? 0; bestIdx = i }
        }

        const avgPerDay = activeDays > 0 ? (total / activeDays).toFixed(1) : "0"

        setGrid(matches)
        setStats({
          total,
          activeDays,
          currentStreak,
          longestStreak,
          bestDay: DOW[bestIdx] ?? "N/A",
          avgPerDay,
        })
      } catch {
        const mock: DayData[] = []
        const today = new Date()
        const start = new Date(today)
        start.setDate(start.getDate() - 364)
        while (start.getDay() !== 0) start.setDate(start.getDate() - 1)
        const cur = new Date(start)
        while (cur <= today) {
          mock.push({ date: cur.toISOString().split("T")[0] ?? "", level: 0 })
          cur.setDate(cur.getDate() + 1)
        }
        setGrid(mock)
        setStats({ total: 0, activeDays: 0, currentStreak: 0, longestStreak: 0, bestDay: "N/A", avgPerDay: "0" })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { grid, stats, loading }
}

function progressBar(value: number, max: number, width: number, color: string, bgColor: string): ReturnType<typeof t> {
  const filled = max > 0 ? Math.round((value / max) * width) : 0
  const empty = width - filled
  return t`${fg(color)("━".repeat(filled))}${fg(bgColor)("━".repeat(empty))}`
}

export function HeatmapScreen() {
  const theme = useTheme()
  const { grid, stats, loading } = useHeatmapData()

  if (loading || !grid) {
    return (
      <box style={{ flexDirection: "column", gap: 1, padding: 1, flexGrow: 1 }}>
        <text content={t`${bold(fg(theme.accent)("heatmap"))} ${dim("// loading contribution graph...")}`} />
        <text content={t``} />
        <text content={t`  ${dim("connecting to github.com...")}`} />
      </box>
    )
  }

  // Build weeks
  const weeks: DayData[][] = []
  for (let i = 0; i < grid.length; i += 7) {
    const chunk = grid.slice(i, i + 7)
    if (chunk.length > 0) weeks.push(chunk)
  }

  const visibleWeeks = weeks.slice(-52)

  // Dynamic cell width: fill the available content area
  const termCols = process.stdout.columns || 120
  const sidebarW = 22  // sidebar box width
  const outerPad = 4   // outer box padding + border
  const innerPad = 4   // heatmap box padding + border
  const labelW = 4     // "Mon " day label width
  const availableForGrid = termCols - sidebarW - outerPad - innerPad - labelW
  const cellWidth = Math.max(1, Math.floor(availableForGrid / visibleWeeks.length))
  const cellBlock = "█".repeat(cellWidth)

  // Build each row as a single TString by merging chunks
  const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""]

  const dayRows = DAY_LABELS.map((label, dayIdx) => {
    const parts: Array<ReturnType<typeof t>> = []
    parts.push(t`${fg(theme.muted)((label || " ").padEnd(labelW))}`)

    for (const week of visibleWeeks) {
      const d = week[dayIdx]
      const level = d?.level ?? 0
      const color = LEVEL_COLORS[level] ?? LEVEL_COLORS[0] ?? "#161B22"
      parts.push(t`${fg(color)(cellBlock)}`)
    }

    return mergeTStrings(...parts)
  })

  // Build month label row aligned to cell widths
  const monthParts: Array<ReturnType<typeof t>> = []
  monthParts.push(t`${"".padEnd(labelW)}`) // offset for day labels

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
        // Pad label to fill the cell-width columns it occupies
        const labelCols = Math.ceil(label.length / cellWidth)
        const paddedLabel = label.padEnd(labelCols * cellWidth)
        monthParts.push(t`${fg(theme.muted)(paddedLabel)}`)
        w += labelCols - 1
        lastMonth = m
        colsSinceLabel = 0
        continue
      }
      lastMonth = lastMonth === -1 ? m : lastMonth
    }
    monthParts.push(t`${" ".repeat(cellWidth)}`)
    colsSinceLabel++
  }

  const monthRow = mergeTStrings(...monthParts)


  return (
    <box style={{ flexDirection: "column", gap: 0, padding: 1, flexGrow: 1 }}>
      <text content={t`${bold(fg(theme.accent)("heatmap"))} ${dim("// @" + PROFILE.handle + " · contribution graph")}`} />
      <text content={t``} />

      {/* Contribution graph */}
      <box
        style={{
          flexDirection: "column",
          padding: 1,
          borderStyle: "rounded",
          borderColor: theme.border,
        }}
      >
        {/* Month labels */}
        <text content={monthRow} />
        <text content={t``} />

        {/* Grid rows — each row is ONE text element, no flex issues */}
        {dayRows.map((row, i) => (
          <text key={i} content={row} />
        ))}

        <text content={t``} />

        {/* Legend */}
        <text content={t`    ${fg(theme.muted)("Less")} ${fg(LEVEL_COLORS[0] ?? ""  )("█")}${fg(LEVEL_COLORS[1] ?? "")("█")}${fg(LEVEL_COLORS[2] ?? "")("█")}${fg(LEVEL_COLORS[3] ?? "")("█")}${fg(LEVEL_COLORS[4] ?? "")("█")} ${fg(theme.muted)("More")}`} />
      </box>

      {/* Stats cards */}
      {stats && (
        <box style={{ flexDirection: "row", gap: 1, marginTop: 1 }}>
          {/* Streak */}
          <box
            style={{
              flexDirection: "column",
              flexGrow: 1,
              padding: 1,
              borderStyle: "rounded",
              borderColor: theme.border,
            }}
          >
            <text content={t`  ${fg(theme.muted)("current streak")}`} />
            <text content={t`  ${bold(fg(theme.success)(String(stats.currentStreak)))} ${fg(theme.muted)("days")}`} />
            <text content={progressBar(stats.currentStreak, stats.longestStreak > 0 ? stats.longestStreak : 30, 16, theme.success, theme.subtle)} />
          </box>

          {/* Longest */}
          <box
            style={{
              flexDirection: "column",
              flexGrow: 1,
              padding: 1,
              borderStyle: "rounded",
              borderColor: theme.border,
            }}
          >
            <text content={t`  ${fg(theme.muted)("longest streak")}`} />
            <text content={t`  ${bold(fg(theme.accent)(String(stats.longestStreak)))} ${fg(theme.muted)("days")}`} />
            <text content={progressBar(stats.longestStreak, 365, 16, theme.accent, theme.subtle)} />
          </box>

          {/* Active days */}
          <box
            style={{
              flexDirection: "column",
              flexGrow: 1,
              padding: 1,
              borderStyle: "rounded",
              borderColor: theme.border,
            }}
          >
            <text content={t`  ${fg(theme.muted)("active days")}`} />
            <text content={t`  ${bold(fg(theme.link)(String(stats.activeDays)))} ${fg(theme.muted)("/ 365")}`} />
            <text content={progressBar(stats.activeDays, 365, 16, theme.link, theme.subtle)} />
          </box>

          {/* Score */}
          <box
            style={{
              flexDirection: "column",
              flexGrow: 1,
              padding: 1,
              borderStyle: "rounded",
              borderColor: theme.border,
            }}
          >
            <text content={t`  ${fg(theme.muted)("activity score")}`} />
            <text content={t`  ${bold(fg(theme.warn)(String(stats.total)))}`} />
            <text content={t`  ${fg(theme.muted)("best day:")} ${fg(theme.fg)(stats.bestDay)}`} />
          </box>
        </box>
      )}

      <text content={t``} />
      <text content={t`  ${dim("1-0 switch")}  ${dim("t")} ${fg(theme.muted)("theme")}  ${dim("q")} ${fg(theme.muted)("back")}`} />
    </box>
  )
}
