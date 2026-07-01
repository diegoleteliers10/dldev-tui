import { useState, useEffect } from "react"
import { t, bold, fg, dim } from "@opentui/core"
import { useTheme } from "../data"

interface WeatherCurrent {
  temperature_2m: number
  apparent_temperature: number
  precipitation: number
  wind_speed_10m: number
  weather_code: number
}

interface WeatherDaily {
  time: string[]
  temperature_2m_max: number[]
  temperature_2m_min: number[]
  weather_code: number[]
  precipitation_probability_max: number[]
}

interface WeatherData {
  current: WeatherCurrent
  daily: WeatherDaily
}

function weatherEmoji(code: number): string {
  if (code === 0) return "☀️ "
  if (code <= 3) return "🌤️ "
  if (code <= 48) return "🌫️ "
  if (code <= 67) return "🌧️ "
  if (code <= 77) return "❄️ "
  if (code <= 82) return "🌦️ "
  if (code <= 99) return "⛈️ "
  return "🌡️ "
}

function weatherLabel(code: number): string {
  if (code === 0) return "Clear sky"
  if (code <= 3) return "Partly cloudy"
  if (code <= 48) return "Foggy"
  if (code <= 67) return "Rainy"
  if (code <= 77) return "Snow"
  if (code <= 82) return "Showers"
  if (code <= 99) return "Thunderstorm"
  return "Unknown"
}

function dayName(dateStr: string, i: number): string {
  if (i === 0) return "Today "
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const d = new Date(dateStr + "T12:00:00")
  return days[d.getDay()] ?? "   "
}

function tempColor(temp: number, theme: ReturnType<typeof useTheme>): string {
  if (temp > 25) return theme.error
  if (temp > 15) return theme.success
  return theme.link
}

export function WeatherScreen() {
  const theme = useTheme()
  const [data, setData] = useState<WeatherData | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const url =
          "https://api.open-meteo.com/v1/forecast?latitude=-33.4569&longitude=-70.6483" +
          "&current=temperature_2m,apparent_temperature,precipitation,wind_speed_10m,weather_code" +
          "&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max" +
          "&timezone=America/Santiago&forecast_days=5"
        const res = await fetch(url)
        const json = await res.json() as WeatherData
        setData(json)
      } catch {
        setError(true)
      }
    }
    fetch_()
  }, [])

  if (!data && !error) {
    return (
      <box style={{ flexDirection: "column", gap: 1, padding: 1, flexGrow: 1 }}>
        <text content={t`${bold(fg(theme.accent)("weather"))} ${dim("// Santiago, Chile")}`} />
        <text content={t`${dim("fetching weather data...")}`} />
      </box>
    )
  }

  if (error || !data) {
    return (
      <box style={{ flexDirection: "column", gap: 1, padding: 1, flexGrow: 1 }}>
        <text content={t`${bold(fg(theme.accent)("weather"))} ${dim("// Santiago, Chile")}`} />
        <text content={t`${fg(theme.error)("could not fetch weather data")}`} />
        <text content={t`${fg(theme.muted)("check your internet connection")}`} />
      </box>
    )
  }

  const cur = data.current
  const daily = data.daily

  return (
    <box style={{ flexDirection: "column", gap: 1, padding: 1, flexGrow: 1 }}>
      <text content={t`${bold(fg(theme.accent)("weather"))} ${dim("// Santiago, Chile")}`} />
      <text content={t`${dim("────────────────────────────────────────────────────────")}`} />

      {/* Current conditions */}
      <box
        title=" Current Conditions "
        titleColor={theme.accent}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 1,
          borderStyle: "rounded",
          borderColor: theme.border,
        }}
      >
        <box style={{ flexDirection: "column", gap: 1 }}>
          <text content={t`  ${weatherEmoji(cur.weather_code)} ${bold(fg(tempColor(cur.temperature_2m, theme))(cur.temperature_2m.toFixed(1) + "°C"))}  ${fg(theme.muted)(weatherLabel(cur.weather_code))}`} />
          <text content={t`  ${fg(theme.muted)("feels like")}  ${fg(theme.fg)(cur.apparent_temperature.toFixed(1) + "°C")}`} />
        </box>
        <box style={{ flexDirection: "column", gap: 1 }}>
          <text content={t`  ${fg(theme.muted)("wind")}    ${fg(theme.fg)(cur.wind_speed_10m.toFixed(1) + " km/h")}`} />
          <text content={t`  ${fg(theme.muted)("precip")}  ${fg(theme.link)(cur.precipitation.toFixed(1) + " mm")}`} />
        </box>
      </box>

      {/* 5-day forecast */}
      <box
        title=" 5-Day Forecast "
        titleColor={theme.accent}
        style={{
          flexDirection: "row",
          gap: 1,
          padding: 1,
          borderStyle: "rounded",
          borderColor: theme.border,
          marginTop: 1,
          flexGrow: 1,
        }}
      >
        {daily.time.map((dateStr, i) => {
          const maxTemp = daily.temperature_2m_max[i] ?? 0
          const minTemp = daily.temperature_2m_min[i] ?? 0
          const code = daily.weather_code[i] ?? 0
          const rainChance = daily.precipitation_probability_max[i] ?? 0
          return (
            <box
              key={dateStr}
              style={{
                flexDirection: "column",
                gap: 1,
                flexGrow: 1,
                padding: 1,
                borderStyle: "rounded",
                borderColor: theme.border,
                alignItems: "center",
              }}
            >
              <text content={t`${bold(fg(theme.fg)(dayName(dateStr, i)))}`} />
              <text content={t`${weatherEmoji(code)}`} />
              <text content={t`${bold(fg(tempColor(maxTemp, theme))(maxTemp.toFixed(0) + "°"))}`} />
              <text content={t`${fg(theme.muted)(minTemp.toFixed(0) + "°")}`} />
              <text content={t`${fg(theme.link)("💧" + rainChance + "%")}`} />
            </box>
          )
        })}
      </box>

      <text content={t`${dim("────────────────────────────────────────────────────────")}`} />
      <text content={t`  ${dim("1-8 switch")}  ${dim("t")} ${fg(theme.muted)("theme")}  ${dim("q")} ${fg(theme.muted)("back")}`} />
    </box>
  )
}
