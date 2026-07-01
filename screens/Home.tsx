import { t, bold, fg, dim, underline } from "@opentui/core"
import { useTheme, PROFILE, REPOS } from "../data"

export function HomeScreen({ width }: { width: number }) {
  const theme = useTheme()
  const topRepos = REPOS.filter((r) => r.stars > 0 || r.highlight).slice(0, 5)

  return (
    <box style={{ flexDirection: "column", gap: 1, padding: 1, flexGrow: 1 }}>
      <box style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 1 }}>
        <text content={t`${bold(fg(theme.accent)("diego letelier"))} ${dim("// building tools that solve real problems")}`} />
      </box>

      <box style={{ flexDirection: width < 75 ? "column" : "row", gap: width < 75 ? 0 : 2, flexGrow: 1 }}>
        {/* Info Box */}
        <box
          title=" Profile "
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
          <text content={t`  ${fg(theme.muted)("web")}  ${underline(fg(theme.link)(PROFILE.website))}`} />
          <text content={t`  ${fg(theme.muted)("repo")}  ${fg(theme.fg)(String(PROFILE.totalRepos))} ${fg(theme.muted)("public")}`} />
          <text content={t`  ${fg(theme.muted)("loc")}   ${fg(theme.fg)(PROFILE.location)}`} />
        </box>

        {/* Stack Box */}
        <box
          title=" Core Stack "
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
          {PROFILE.languages.map((lang) => (
            <text key={lang} content={t`  ${fg(theme.link)(lang)}`} />
          ))}
        </box>
      </box>

      {/* Selected Repos Box */}
      <box
        title=" Selected Repositories "
        titleColor={theme.accent}
        style={{
          flexDirection: "column",
          gap: 0,
          padding: 1,
          borderStyle: "rounded",
          borderColor: theme.border,
          marginTop: 1,
        }}
      >
        {topRepos.map((repo) => (
          <text
            key={repo.name}
            content={repo.stars > 0
              ? t`  ${bold(fg(theme.link)(repo.name))}  ${dim(repo.description)}  ${fg(theme.accent)(repo.stars + "★")}`
              : t`  ${bold(fg(theme.link)(repo.name))}  ${dim(repo.description)}`
            }
          />
        ))}
      </box>

      <text content={t`${dim("────────────────────────────────────────────────────────")}`} />
      <text content={t`  ${dim("1-6 switch")}  ${dim("t")} ${fg(theme.muted)("theme")}  ${dim("q")} ${fg(theme.muted)("back")}`} />
    </box>
  )
}
