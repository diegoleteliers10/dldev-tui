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

function progressBar(current: number, total: number, width: number = 28): string {
  const filled = Math.min(width, Math.max(0, Math.round(((total - current) / total) * width)))
  const empty = Math.max(0, width - filled)
  return "█".repeat(filled) + "░".repeat(empty)
}

export function PomodoroScreen({ width, height }: { width?: number; height?: number }) {
  const currentWidth = width || 80
  const isShort = (height || 40) < 24
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
  const stateLabel = state === "work" ? "🍅 FOCUS SESSION" : state === "break" ? "☕ BREAK TIME" : "⏸ READY TO FOCUS"
  const timerBoxWidth = Math.min(44, Math.max(28, currentWidth - 26))
  const bar = progressBar(timeLeft, total, Math.max(14, timerBoxWidth - 14))

  const totalHours = Math.floor(totalWorkSecs / 3600)
  const totalMins = Math.floor((totalWorkSecs % 3600) / 60)

  return (
    <box style={{ flexDirection: "column", gap: 1, padding: 1, flexGrow: 1 }}>
      <box style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <text content={t`${bold(fg(theme.accent)("POMODORO FOCUS TIMER"))} ${dim("// deep work intervals")}`} />
        <text content={t`${fg(theme.muted)("Sessions Today:")} ${bold(fg(theme.success)(String(sessions)))}`} />
      </box>
      <text content={t`${dim("────────────────────────────────────────────────────────────────────────")}`} />

      {/* Main timer display */}
      <box style={{ flexGrow: 1, flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <box
          title=" Focus Session "
          titleColor={stateColor}
          style={{
            flexDirection: "column",
            padding: isShort ? 0 : 1,
            borderStyle: "rounded",
            borderColor: stateColor,
            alignItems: "center",
            width: timerBoxWidth,
          }}
        >
          <text content={t`${bold(fg(stateColor)(stateLabel))}`} />
          {!isShort && <text content={t``} />}
          <text content={t`  ${bold(fg(theme.fg)(formatTime(timeLeft)))}`} />
          {!isShort && <text content={t``} />}
          <text content={t`  ${fg(stateColor)(bar)}`} />
          {!isShort && <text content={t``} />}

          {state === "idle" && <text content={t`${dim("Press [ENTER] or [SPACE] to start")}`} />}
          {state !== "idle" && running && <text content={t`${fg(theme.muted)("Press [SPACE] to pause")}`} />}
          {state !== "idle" && !running && <text content={t`${fg(theme.warn)("Press [SPACE] to resume")}`} />}
        </box>
      </box>


      {/* Session stats */}
      <box
        title=" Daily Focus Metrics "
        titleColor={theme.accent}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 1,
          borderStyle: "rounded",
          borderColor: theme.border,
        }}
      >
        <text content={t`  ${fg(theme.muted)("Sessions Completed:")} ${bold(fg(theme.fg)(String(sessions)))}`} />
        <text content={t`  ${fg(theme.muted)("Total Focus Time:")} ${bold(fg(theme.accent)(`${totalHours}h ${totalMins}m`))}  `} />
      </box>

      <text content={t`${dim("────────────────────────────────────────────────────────────────────────")}`} />
      <text content={t`  ${dim("Controls:")} ${bold(fg(theme.accent)("[ENTER / SPACE]"))} ${dim("Start/Pause")}  │  ${bold(fg(theme.accent)("[S]"))} ${dim("Skip")}  │  ${bold(fg(theme.accent)("[R]"))} ${dim("Reset")}  │  ${bold(fg(theme.accent)("[Q]"))} ${dim("Back")}`} />
    </box>
  )
}

