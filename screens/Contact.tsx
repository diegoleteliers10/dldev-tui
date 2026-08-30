import { useState } from "react"
import { useKeyboard } from "@opentui/react"
import { t, bold, fg, dim, underline } from "@opentui/core"
import { useTheme, PROFILE } from "../data"
import { openUrl } from "../open"

const LINKS = [
  { label: "GitHub", handle: `@${PROFILE.handle}`, url: PROFILE.github, desc: "Source code, repos & contributions" },
  { label: "Website", handle: "diegoletelierdev.vercel.app", url: PROFILE.website, desc: "Personal portfolio & interactive projects" },
  { label: "LinkedIn", handle: "diegoletelier", url: PROFILE.linkedin, desc: "Professional network & career updates" },
  { label: "Email", handle: PROFILE.email, url: `mailto:${PROFILE.email}`, desc: "Direct inquiries, freelance & opportunities" },
]

export function ContactScreen() {
  const theme = useTheme()
  const [selectedIdx, setSelectedIdx] = useState(0)

  useKeyboard((key) => {
    if (key.name === "up" || key.name === "k") {
      setSelectedIdx((prev) => Math.max(0, prev - 1))
    }
    if (key.name === "down" || key.name === "j") {
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
      <box style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <text content={t`${bold(fg(theme.accent)("GET IN TOUCH"))} ${dim("// contact & channels")}`} />
        <text content={t`${dim("Press [ENTER] to open selected link")}`} />
      </box>
      <text content={t`${dim("────────────────────────────────────────────────────────────────────────")}`} />

      {/* Info Card */}
      <box
        title=" Developer Profile "
        titleColor={theme.accent}
        style={{
          flexDirection: "column",
          gap: 0,
          padding: 1,
          borderStyle: "rounded",
          borderColor: theme.border,
        }}
      >
        <box style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <text content={t`  ${bold(fg(theme.fg)(PROFILE.name))}  ${fg(theme.muted)(`(@${PROFILE.handle})`)}`} />
          <text content={t`${fg(theme.success)(PROFILE.status)}  `} />
        </box>
        <text content={t`  ${fg(theme.muted)("Role:")}     ${fg(theme.fg)(PROFILE.role)}`} />
        <text content={t`  ${fg(theme.muted)("Location:")} ${fg(theme.fg)(PROFILE.location)}`} />
      </box>

      {/* Interactive Links Card */}
      <box
        title=" Direct Links & Socials "
        titleColor={theme.accent}
        style={{
          flexDirection: "column",
          gap: 1,
          padding: 1,
          borderStyle: "rounded",
          borderColor: theme.border,
          flexGrow: 1,
        }}
      >
        {LINKS.map((link, idx) => {
          const isActive = idx === selectedIdx
          return (
            <box key={link.label} style={{ flexDirection: "column", gap: 0 }}>
              <box style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <text
                  content={
                    isActive
                      ? t`  ${fg(theme.accent)("▶")} ${bold(fg(theme.fg)(link.label.padEnd(12)))} ${underline(fg(theme.link)(link.handle))}`
                      : t`    ${fg(theme.muted)(link.label.padEnd(12))} ${fg(theme.fg)(link.handle)}`
                  }
                />
                <text content={t`${dim(link.desc)}  `} />
              </box>
            </box>
          )
        })}
      </box>

      <text content={t`${dim("────────────────────────────────────────────────────────────────────────")}`} />
      <text content={t`  ${dim("Controls:")} ${bold(fg(theme.accent)("↑/↓ / J/K"))} ${dim("Navigate")}  │  ${bold(fg(theme.accent)("[ENTER]"))} ${dim("Open Link")}  │  ${bold(fg(theme.accent)("[Q]"))} ${dim("Back")}`} />
    </box>
  )
}

