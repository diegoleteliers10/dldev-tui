import { useState } from "react"
import { useKeyboard } from "@opentui/react"
import { t, bold, fg, dim, underline } from "@opentui/core"
import { useTheme, PROFILE } from "../data"
import { openUrl } from "../open"

const LINKS = [
  { label: "github", url: `https://github.com/${PROFILE.handle}` },
  { label: "website", url: PROFILE.website },
  { label: "linkedin", url: "https://linkedin.com/in/diegoletelier" },
  { label: "email", url: `mailto:diego@${PROFILE.website.replace("https://", "").replace("/", "")}` },
]

export function ContactScreen() {
  const theme = useTheme()
  const [selectedIdx, setSelectedIdx] = useState(0)

  useKeyboard((key) => {
    if (key.name === "up") {
      setSelectedIdx((prev) => Math.max(0, prev - 1))
    }
    if (key.name === "down") {
      setSelectedIdx((prev) => Math.min(LINKS.length - 1, prev + 1))
    }
    if (key.name === "return" || key.name === "enter") {
      const activeLink = LINKS[selectedIdx]
      if (activeLink) {
        openUrl(activeLink.url)
      }
    }
  })

  return (
    <box style={{ flexDirection: "column", gap: 1, padding: 1, flexGrow: 1 }}>
      <text content={t`${bold(fg(theme.accent)("contact"))}`} />
      <text content={t`${dim("────────────────────────────────────────────────────────")}`} />

      {/* Info Card */}
      <box
        title=" Contact Details "
        titleColor={theme.accent}
        style={{
          flexDirection: "column",
          gap: 1,
          padding: 1,
          borderStyle: "rounded",
          borderColor: theme.border,
        }}
      >
        <text content={t`${bold(fg(theme.fg)(PROFILE.name))}  ${fg(theme.muted)("@" + PROFILE.handle)}`} />
        <text content={t`${fg(theme.muted)(PROFILE.role)}`} />
        <text content={t`${fg(theme.fg)(PROFILE.location)}`} />
      </box>

      {/* Interactive Links Card */}
      <box
        title=" Connect / Links "
        titleColor={theme.accent}
        style={{
          flexDirection: "column",
          gap: 1,
          padding: 1,
          borderStyle: "rounded",
          borderColor: theme.border,
          marginTop: 1,
          flexGrow: 1,
        }}
      >
        {LINKS.map((link, idx) => {
          const isActive = idx === selectedIdx
          return (
            <text
              key={link.label}
              content={
                isActive
                  ? t`${fg(theme.accent)("▶")} ${bold(fg(theme.fg)(link.label.padEnd(10)))} ${underline(fg(theme.link)(link.url))}`
                  : t`  ${fg(theme.muted)(link.label.padEnd(10))} ${fg(theme.muted)(link.url)}`
              }
            />
          )
        })}
      </box>

      <text content={t`${dim("────────────────────────────────────────────────────────")}`} />
      <text content={t`  ${dim("↑↓ navigate")}  ${dim("[enter]")} ${fg(theme.accent)("open link")}  ${dim("q")} ${fg(theme.muted)("back")}`} />
    </box>
  )
}
