import { useState, useEffect } from "react"
import { t, bold, fg, dim } from "@opentui/core"
import { useKeyboard } from "@opentui/react"
import { useTheme } from "../data"

type PomodoroState = "idle" | "work" | "break"

const WORK_SECS = 25 * 60
const BREAK_SECS = 5 * 60

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

function progressBar(current: number, total: number, width: number = 30): string {
  const filled = Math.round(((total - current) / total) * width)
  return "█".repeat(filled) + "░".repeat(width - filled)
}

export function PomodoroScreen() {
  const theme = useTheme()
  const [state, setState] = useState<PomodoroState>("idle")
  const [timeLeft, setTimeLeft] = useState(WORK_SECS)
  const [sessions, setSessions] = useState(0)
  const [totalWorkSecs, setTotalWorkSecs] = useState(0)
  const [running, setRunning] = useState(false)

  const total = state === "break" ? BREAK_SECS : WORK_SECS

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setRunning(false)
          if (state === "work") {
            setSessions((s) => s + 1)
            setTotalWorkSecs((t) => t + WORK_SECS)
            setState("break")
            setTimeLeft(BREAK_SECS)
          } else {
            setState("idle")
            setTimeLeft(WORK_SECS)
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [running, state])

  useKeyboard((key) => {
    if (key.name === "return" || key.name === "enter" || key.name === "space") {
      if (state === "idle") {
        setState("work")
        setTimeLeft(WORK_SECS)
        setRunning(true)
      } else {
        setRunning((r) => !r)
      }
    }
    if (key.name === "r") {
      setRunning(false)
      setState("idle")
      setTimeLeft(WORK_SECS)
    }
    if (key.name === "s") {
      // Skip to break/work
      setRunning(false)
      if (state === "work") {
        setSessions((s) => s + 1)
        setState("break")
        setTimeLeft(BREAK_SECS)
      } else {
        setState("idle")
        setTimeLeft(WORK_SECS)
      }
    }
  })

  const stateColor = state === "work" ? theme.error : state === "break" ? theme.success : theme.muted
  const stateLabel = state === "work" ? "🍅 WORK SESSION" : state === "break" ? "☕ BREAK TIME" : "⏸ IDLE"
  const bar = progressBar(timeLeft, total)

  const totalHours = Math.floor(totalWorkSecs / 3600)
  const totalMins = Math.floor((totalWorkSecs % 3600) / 60)

  return (
    <box style={{ flexDirection: "column", gap: 1, padding: 1, flexGrow: 1 }}>
      <text content={t`${bold(fg(theme.accent)("pomodoro"))} ${dim("// focus timer")}`} />
      <text content={t`${dim("────────────────────────────────────────────────────────")}`} />

      {/* Main timer display */}
      <box style={{ flexGrow: 1, flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <box
          title=" Timer "
          titleColor={stateColor}
          style={{
            flexDirection: "column",
            padding: 2,
            borderStyle: "double",
            borderColor: stateColor,
            alignItems: "center",
            width: 40,
          }}
        >
          <text content={t`${bold(fg(stateColor)(stateLabel))}`} />
          <text content={t``} />
          <text content={t`  ${bold(fg(theme.fg)(formatTime(timeLeft)))}`} />
          <text content={t``} />
          <text content={t`  ${fg(stateColor)(bar)}`} />
          <text content={t``} />

          {state === "idle" && (
            <text content={t`${dim("Press [ENTER] to start")}`} />
          )}
          {state !== "idle" && running && (
            <text content={t`${fg(theme.muted)("Press [ENTER] to pause")}`} />
          )}
          {state !== "idle" && !running && (
            <text content={t`${fg(theme.warn)("Press [ENTER] to resume")}`} />
          )}
        </box>
      </box>

      {/* Session stats */}
      <box
        title=" Session Stats "
        titleColor={theme.accent}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 1,
          borderStyle: "rounded",
          borderColor: theme.border,
        }}
      >
        <text content={t`  ${fg(theme.muted)("sessions completed:")} ${bold(fg(theme.fg)(String(sessions)))}`} />
        <text content={t`  ${fg(theme.muted)("total focus time:")} ${bold(fg(theme.accent)(`${totalHours}h ${totalMins}m`))}`} />
      </box>

      <text content={t`${dim("────────────────────────────────────────────────────────")}`} />
      <text content={t`  ${dim("[enter]")} ${fg(theme.accent)("start/pause")}  ${dim("[s]")} ${fg(theme.muted)("skip")}  ${dim("[r]")} ${fg(theme.muted)("reset")}  ${dim("q")} ${fg(theme.muted)("back")}`} />
    </box>
  )
}
