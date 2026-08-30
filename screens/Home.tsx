import { t, bold, fg, dim, underline } from "@opentui/core"
import { useTheme, PROFILE, REPOS } from "../data"

export function HomeScreen({ width, height }: { width: number; height?: number }) {
  const theme = useTheme()
  const isNarrow = width < 85
  const isShort = (height || 40) < 26

  const repoCount = isShort ? 3 : 5
  const topRepos = REPOS.filter((r) => r.highlight || r.stars > 0).slice(0, repoCount)

  return (
    <box style={{ flexDirection: "column", gap: 1, padding: 1, flexGrow: 1 }}>
      {/* Header Banner */}
      <box style={{ flexDirection: isNarrow ? "column" : "row", justifyContent: "space-between", marginBottom: 0 }}>
        <text content={t`${bold(fg(theme.accent)(PROFILE.name.toUpperCase()))} ${dim(`// ${PROFILE.title}`)}`} />
        {!isShort && <text content={t`${fg(theme.success)(PROFILE.status)}`} />}
      </box>
      <text content={t`${dim("────────────────────────────────────────────────────────────────────────")}`} />

      {/* Profile & Stack Grid */}
      <box style={{ flexDirection: isNarrow ? "column" : "row", gap: 1 }}>
        {/* Info Box */}
        <box
          title=" Profile Overview "
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
          <text content={t`  ${fg(theme.muted)("Role:")}      ${bold(fg(theme.fg)(PROFILE.role))}`} />
          <text content={t`  ${fg(theme.muted)("Location:")}  ${fg(theme.fg)(PROFILE.location)}`} />
          <text content={t`  ${fg(theme.muted)("Website:")}   ${underline(fg(theme.link)(PROFILE.website))}`} />
          {!isShort && (
            <>
              <text content={t`  ${fg(theme.muted)("GitHub:")}    ${underline(fg(theme.link)(PROFILE.github))}`} />
              <text content={t`  ${fg(theme.muted)("Public Repos:")} ${bold(fg(theme.warn)(String(PROFILE.totalRepos)))}`} />
            </>
          )}
        </box>

        {/* Core Stack */}
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
          <text content={t`  ${fg(theme.muted)("Languages:")}  ${bold(fg(theme.link)("TypeScript, Rust, Python, Go"))}`} />
          <text content={t`  ${fg(theme.muted)("Frontend:")}   ${fg(theme.fg)("React, Next.js, Astro, Tailwind")}`} />
          <text content={t`  ${fg(theme.muted)("Backend:")}    ${fg(theme.fg)("Node.js, Bun, Express, NestJS")}`} />
          {!isShort && (
            <>
              <text content={t`  ${fg(theme.muted)("Data & Infra:")} ${fg(theme.fg)("PostgreSQL, Docker, Linux")}`} />
              <text content={t`  ${fg(theme.muted)("Focus:")}      ${fg(theme.success)("Dev Tools, Systems & Real-time Apps")}`} />
            </>
          )}
        </box>
      </box>

      {/* Selected Featured Repositories */}
      <box
        title=" Featured Open-Source Projects "
        titleColor={theme.accent}
        style={{
          flexDirection: "column",
          gap: 0,
          padding: 1,
          borderStyle: "rounded",
          borderColor: theme.border,
          flexGrow: 1,
        }}
      >
        {topRepos.map((repo) => {
          const maxDescLen = isNarrow ? Math.max(12, width - 42) : Math.max(20, width - 58)
          const desc = repo.description.length > maxDescLen
            ? repo.description.slice(0, Math.max(0, maxDescLen - 3)) + "..."
            : repo.description
          const starStr = repo.stars > 0 ? `★ ${repo.stars}` : "    "

          return (
            <box key={repo.name} style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <text content={t`  ${bold(fg(theme.link)(repo.name.padEnd(20)))} ${dim(desc)}`} />
              <text content={t`${fg(theme.warn)(starStr)} ${fg(theme.muted)(`[${repo.language ?? "Docs"}]`)}  `} />
            </box>
          )
        })}
      </box>

      <text content={t`${dim("────────────────────────────────────────────────────────────────────────")}`} />
      <text content={t`  ${dim("Quick Keys:")} ${bold(fg(theme.accent)("1-0"))} ${dim("Screens")}  │  ${bold(fg(theme.accent)("[T]"))} ${dim("Theme")}  │  ${bold(fg(theme.accent)("[Q]"))} ${dim("Welcome Screen")}  │  ${bold(fg(theme.error)("[ESC]"))} ${dim("Exit")}`} />
    </box>
  )
}


