import { t, bold, fg, dim, underline } from "@opentui/core"
import { useTheme, PROFILE, SKILLS, type Theme } from "../data"

function skillBar(level: number, theme: Theme, width: number = 18): string {
  const filled = Math.round((level / 100) * width)
  return "\u2588".repeat(filled) + "\u2591".repeat(width - filled)
}

export function AboutScreen({ width }: { width: number }) {
  const theme = useTheme()
  const sortedSkills = Object.entries(SKILLS).sort((a, b) => b[1] - a[1])

  return (
    <box style={{ flexDirection: "column", gap: 1, padding: 1, flexGrow: 1 }}>
      <text content={t`${bold(fg(theme.accent)("about me"))}`} />
      <text content={t`${dim("────────────────────────────────────────────────────────")}`} />

      {/* Bio Box */}
      <box
        title=" Developer Profile "
        titleColor={theme.accent}
        style={{
          flexDirection: "column",
          gap: 1,
          padding: 1,
          borderStyle: "rounded",
          borderColor: theme.border,
        }}
      >
        <box style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <text content={t`${bold(fg(theme.fg)(PROFILE.name))}  ${fg(theme.muted)("@" + PROFILE.handle)}`} />
          <text content={t`${fg(theme.muted)(PROFILE.role)}`} />
        </box>
        <text content={t`${fg(theme.fg)(PROFILE.bio)}`} />
        <box style={{ flexDirection: width < 75 ? "column" : "row", gap: width < 75 ? 0 : 4, marginTop: 1 }}>
          <text content={t`${fg(theme.muted)("location:")} ${fg(theme.fg)(PROFILE.location)}`} />
          <text content={t`${fg(theme.muted)("website:")}  ${underline(fg(theme.link)(PROFILE.website))}`} />
        </box>
      </box>

      {/* Skills and Experience in Columns */}
      <box style={{ flexDirection: width < 75 ? "column" : "row", gap: width < 75 ? 0 : 2, flexGrow: 1, marginTop: 1 }}>
        
        {/* Skills Column */}
        <box
          title=" Skills "
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
          {sortedSkills.map(([skill, level]) => (
            <text
              key={skill}
              content={t`  ${fg(theme.muted)(skill.padEnd(12))} ${fg(theme.accentDim)(skillBar(level, theme))}  ${fg(theme.muted)(level + "%")}`}
            />
          ))}
        </box>

        {/* Experience Column */}
        <box
          title=" Experience "
          titleColor={theme.accent}
          style={{
            flexDirection: "column",
            gap: 1,
            flexGrow: 1,
            padding: 1,
            borderStyle: "rounded",
            borderColor: theme.border,
          }}
        >
          <text content={t`  ${bold(fg(theme.accent)("SoyHenry"))}`} />
          <text content={t`  ${dim("Full Stack Dev Graduate")}`} />
          <text content={t``} />
          <text content={t`  ${bold(fg(theme.accent)("UDD"))}`} />
          <text content={t`  ${dim("Computer Science Student")}`} />
          <text content={t``} />
          <text content={t`  ${bold(fg(theme.accent)("Biovity"))}`} />
          <text content={t`  ${dim("Co-founder & Developer")}`} />
        </box>

      </box>

      <text content={t`${dim("────────────────────────────────────────────────────────")}`} />
      <text content={t`  ${dim("1-6 switch")}  ${dim("t")} ${fg(theme.muted)("theme")}  ${dim("q")} ${fg(theme.muted)("back")}`} />
    </box>
  )
}
