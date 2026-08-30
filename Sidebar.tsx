import { t, bold, fg, dim } from "@opentui/core"
import { useTheme, type Screen } from "./data"

const ITEMS: { key: Screen; label: string; num: string; icon: string }[] = [
  { key: "home", label: "home", num: "1", icon: "⌂" },
  { key: "projects", label: "projects", num: "2", icon: "◈" },
  { key: "about", label: "about", num: "3", icon: "◉" },
  { key: "contact", label: "contact", num: "4", icon: "✉" },
  { key: "stats", label: "stats", num: "5", icon: "▲" },
  { key: "heatmap", label: "heatmap", num: "6", icon: "▦" },
  { key: "now", label: "now", num: "7", icon: "◎" },
  { key: "uses", label: "uses", num: "8", icon: "⚙" },
  { key: "pomodoro", label: "pomodoro", num: "9", icon: "⏱" },
  { key: "system", label: "system", num: "0", icon: "⚡" },
]

interface SidebarProps {
  active: Screen
  terminalWidth: number
  terminalHeight?: number
  onNavigate: (s: Screen) => void
}

export function Sidebar({ active, terminalWidth, terminalHeight }: SidebarProps) {
  const theme = useTheme()
  const isMini = terminalWidth < 65
  const isCompact = terminalWidth >= 65 && terminalWidth < 90
  const isShort = (terminalHeight || 40) < 22

  const sidebarWidth = isMini ? 6 : isCompact ? 8 : 20

  return (
    <box
      style={{
        width: sidebarWidth,
        height: "100%",
        flexDirection: "column",
        padding: isMini ? 0 : 1,
        borderStyle: "rounded",
        borderColor: theme.border,
      }}
    >
      {!isMini && !isCompact && !isShort && (
        <>
          <text content={t`${bold(fg(theme.accent)("diego"))}`} />
          <text content={t`${fg(theme.muted)("letelier")}`} />
          <text content={t`${dim("──────────────")}`} />
        </>
      )}

      {!isMini && isCompact && !isShort && (
        <>
          <text content={t`${bold(fg(theme.accent)("DL"))}`} />
          <text content={t`${dim("────")}`} />
        </>
      )}

      <box style={{ flexDirection: "column", gap: 0, flexGrow: 1, justifyContent: "space-between" }}>
        {ITEMS.map((item) => {
          const isActive = item.key === active
          if (isMini) {
            return (
              <text
                key={item.key}
                content={
                  isActive
                    ? t`${bold(fg(theme.accent)(`▶${item.num}`))}`
                    : t` ${fg(theme.muted)(item.num)}`
                }
              />
            )
          }

          if (isCompact) {
            return (
              <text
                key={item.key}
                content={
                  isActive
                    ? t`${bold(fg(theme.accent)(`▶${item.num}`))}`
                    : t` ${fg(theme.muted)(item.num)}`
                }
              />
            )
          }

          return (
            <text
              key={item.key}
              content={
                isActive
                  ? t`${fg(theme.accent)(item.num)} ${bold(fg(theme.fg)(item.label.padEnd(9)))} ${fg(theme.accent)("◀")}`
                  : t`${fg(theme.muted)(item.num)} ${fg(theme.muted)(item.label)}`
              }
            />
          )
        })}
      </box>

      {!isShort && (
        <>
          <text content={t`${dim(isMini ? "──" : isCompact ? "────" : "──────────────")}`} />
          {!isMini && !isCompact ? (
            <>
              <text content={t`${fg(theme.accent)("t")}${dim(" theme")}`} />
              <text content={t`${fg(theme.muted)("q")}${dim(" welcome")}`} />
            </>
          ) : (
            <>
              <text content={t`${fg(theme.accent)("t")}`} />
              <text content={t`${fg(theme.muted)("q")}`} />
            </>
          )}
        </>
      )}
    </box>
  )
}


