import { useState, useEffect } from "react"
import { t, bold, fg, dim } from "@opentui/core"
import { useTheme } from "../data"

interface CityTime {
  city: string
  timezone: string
  emoji: string
}

const CITIES: CityTime[] = [
  { city: "Santiago", timezone: "America/Santiago", emoji: "🇨🇱" },
  { city: "New York", timezone: "America/New_York", emoji: "🇺🇸" },
  { city: "London", timezone: "Europe/London", emoji: "🇬🇧" },
  { city: "Berlin", timezone: "Europe/Berlin", emoji: "🇩🇪" },
  { city: "Tokyo", timezone: "Asia/Tokyo", emoji: "🇯🇵" },
  { city: "Singapore", timezone: "Asia/Singapore", emoji: "🇸🇬" },
]

function getTimeInZone(tz: string): { time: string; date: string; offset: string } {
  const now = new Date()
  const timeStr = now.toLocaleTimeString("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit" })
  const dateStr = now.toLocaleDateString("en-GB", { timeZone: tz, weekday: "short", day: "numeric", month: "short" })
  const offsetStr = now.toLocaleTimeString("en-GB", { timeZone: tz, timeZoneName: "short" }).split(" ").pop() ?? ""
  return { time: timeStr, date: dateStr, offset: offsetStr }
}

function timeBar(hour: number): string {
  const total = 24
  const width = 24
  const filled = Math.round((hour / total) * width)
  return "█".repeat(filled) + "░".repeat(width - filled)
}

function getHour(tz: string): number {
  const now = new Date()
  const str = now.toLocaleTimeString("en-GB", { timeZone: tz, hour: "2-digit", hour12: false })
  return parseInt(str.split(":")[0] ?? "0", 10)
}

function isDaytime(hour: number): boolean {
  return hour >= 6 && hour < 20
}

export function WorldClockScreen() {
  const theme = useTheme()
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <box style={{ flexDirection: "column", gap: 1, padding: 1, flexGrow: 1 }}>
      <text content={t`${bold(fg(theme.accent)("world clock"))} ${dim("// live timezones")}`} />
      <text content={t`${dim("────────────────────────────────────────────────────────")}`} />

      <box style={{ flexDirection: "column", gap: 1, flexGrow: 1 }}>
        {CITIES.map((city) => {
          const { time, date, offset } = getTimeInZone(city.timezone)
          const hour = getHour(city.timezone)
          const isDay = isDaytime(hour)
          const cityColor = city.city === "Santiago" ? theme.accent : theme.fg
          const timeColor = isDay ? theme.warn : theme.link
          const periodIcon = isDay ? "☀️" : "🌙"

          return (
            <box
              key={city.city}
              style={{
                flexDirection: "column",
                padding: 1,
                borderStyle: "rounded",
                borderColor: city.city === "Santiago" ? theme.accent : theme.border,
              }}
            >
              <box style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <text content={t`  ${city.emoji} ${bold(fg(cityColor)(city.city.padEnd(12)))} ${periodIcon}`} />
                <text content={t`${bold(fg(timeColor)(time))} ${fg(theme.muted)(offset)}`} />
                <text content={t`${fg(theme.muted)(date)}`} />
              </box>
              <text content={t`     ${fg(isDay ? theme.warn : theme.link)(timeBar(hour))}`} />
            </box>
          )
        })}
      </box>

      <text content={t`${dim("────────────────────────────────────────────────────────")}`} />
      <text content={t`  ${fg(theme.accent)("☀️")} ${dim("daytime")}  ${fg(theme.link)("🌙")} ${dim("nighttime")}  ${fg(theme.accent)("◆")} ${dim("Santiago (home)")}  ${dim("q")} ${fg(theme.muted)("back")}`} />
    </box>
  )
}
