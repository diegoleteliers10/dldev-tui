import { t, bold, fg, dim } from "@opentui/core"
import { useTheme, type Screen } from "./data"

const ITEMS: { key: Screen; label: string; num: string }[] = [
  { key: "home", label: "home", num: "1" },
  { key: "projects", label: "projects", num: "2" },
  { key: "about", label: "about", num: "3" },
  { key: "contact", label: "contact", num: "4" },
  { key: "stats", label: "stats", num: "5" },
  { key: "heatmap", label: "heatmap", num: "6" },
  { key: "now", label: "now", num: "7" },
  { key: "uses", label: "uses", num: "8" },
  { key: "pomodoro", label: "pomodoro", num: "9" },
  { key: "system", label: "system", num: "0" },
]

interface SidebarProps {
  active: Screen
  onNavigate: (s: Screen) => void
}

export function Sidebar({ active, onNavigate }: SidebarProps) {
  const theme = useTheme()

  return (
    <box
      style={{
        width: 20,
        height: "100%",
        flexDirection: "column",
        padding: 1,
        borderStyle: "rounded",
        borderColor: theme.border,
      }}
    >
      <text content={t`${bold(fg(theme.accent)("diego"))}`} />
      <text content={t`${fg(theme.muted)("letelier")}`} />
      <text content={t`${dim("──────────────")}`} />

      <box style={{ flexDirection: "column", gap: 0, flexGrow: 1 }}>
        {ITEMS.map((item) => {
          const isActive = item.key === active
          return (
            <text
              key={item.key}
              content={
                isActive
                  ? t`${fg(theme.accent)(item.num)} ${bold(fg(theme.fg)(item.label))} ${fg(theme.accent)("◀")}`
                  : t`${fg(theme.muted)(item.num)} ${fg(theme.muted)(item.label)}`
              }
            />
          )
        })}
      </box>

      <text content={t`${dim("──────────────")}`} />
      <text content={t`${fg(theme.accent)("t")}${dim(" theme")}`} />
      <text content={t`${fg(theme.muted)("q")}${dim(" welcome")}`} />
    </box>
  )
}
