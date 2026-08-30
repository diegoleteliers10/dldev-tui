import { t, bold, fg, dim, underline } from "@opentui/core"
import { useTheme, PROFILE, EXPERIENCES, SKILLS, type Theme } from "../data"

function skillBar(level: number, width: number = 14): string {
  const filled = Math.min(width, Math.max(0, Math.round((level / 100) * width)))
  const empty = Math.max(0, width - filled)
  return "█".repeat(filled) + "░".repeat(empty)
}

export function AboutScreen({ width }: { width: number }) {
  const theme = useTheme()
  const sortedSkills = Object.entries(SKILLS).sort((a, b) => b[1] - a[1])
  const isNarrow = width < 85

  return (
    <box style={{ flexDirection: "column", gap: 1, padding: 1, flexGrow: 1 }}>
      <box style={{ flexDirection: isNarrow ? "column" : "row", justifyContent: "space-between" }}>
        <text content={t`${bold(fg(theme.accent)("ABOUT DIEGO LETELIER"))} ${dim("// background & journey")}`} />
        <text content={t`${fg(theme.muted)("Location:")} ${fg(theme.fg)(PROFILE.location)}`} />
      </box>
      <text content={t`${dim("────────────────────────────────────────────────────────────────────────")}`} />

      {/* Bio Box */}
      <box
        title=" Developer Profile & Mission "
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
          <text content={t`${bold(fg(theme.accent)(PROFILE.title))}  `} />
        </box>
        <text content={t`  ${fg(theme.fg)(PROFILE.bio)}`} />
        <box style={{ flexDirection: isNarrow ? "column" : "row", gap: isNarrow ? 0 : 3, marginTop: 1 }}>
          <text content={t`  ${fg(theme.muted)("Education:")} ${fg(theme.fg)("Computer Science @ UDD + SoyHenry")}`} />
          <text content={t`  ${fg(theme.muted)("Website:")}   ${underline(fg(theme.link)(PROFILE.website))}`} />
        </box>
      </box>

      {/* Experience & Skills Columns */}
      <box style={{ flexDirection: isNarrow ? "column" : "row", gap: 1, flexGrow: 1 }}>
        {/* Experience Column */}
        <box
          title=" Experience & Education "
          titleColor={theme.accent}
          style={{
            flexDirection: "column",
            gap: 1,
            flexGrow: 2,
            padding: 1,
            borderStyle: "rounded",
            borderColor: theme.border,
          }}
        >
          {EXPERIENCES.map((exp) => (
            <box key={exp.organization} style={{ flexDirection: "column", gap: 0 }}>
              <box style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <text content={t`  ${bold(fg(theme.accent)(exp.organization))} ${dim(`— ${exp.title}`)}`} />
                <text content={t`${fg(theme.muted)(exp.period)}  `} />
              </box>
              <text content={t`    ${fg(theme.fg)(exp.description)}`} />
              <text content={t`    ${fg(theme.muted)(exp.tags.map((tg) => `#${tg}`).join(" "))}`} />
            </box>
          ))}
        </box>

        {/* Skills Column */}
        <box
          title=" Technical Skills "
          titleColor={theme.accent}
          style={{
            flexDirection: "column",
            gap: 0,
            flexGrow: 1,
            padding: 1,
            borderStyle: "rounded",
            borderColor: theme.border,
          }}
        >
          {sortedSkills.slice(0, 8).map(([skill, level]) => (
            <box key={skill} style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <text content={t`  ${fg(theme.fg)(skill.padEnd(14))}`} />
              <text content={t`${fg(theme.accent)(skillBar(level, 12))} ${fg(theme.muted)(`${level}%`)}  `} />
            </box>
          ))}
        </box>
      </box>

      <text content={t`${dim("────────────────────────────────────────────────────────────────────────")}`} />
      <text content={t`  ${dim("Quick Keys:")} ${bold(fg(theme.accent)("1-0"))} ${dim("Screens")}  │  ${bold(fg(theme.accent)("[T]"))} ${dim("Theme")}  │  ${bold(fg(theme.accent)("[Q]"))} ${dim("Welcome Screen")}  │  ${bold(fg(theme.error)("[ESC]"))} ${dim("Exit")}`} />
    </box>
  )
}

