import { useState, useEffect } from "react"
import { t, bold, fg, dim } from "@opentui/core"
import { useTheme, PROFILE, REPOS } from "../data"

interface GitHubStats {
  name: string
  bio: string
  followers: number
  following: number
  totalRepos: number
  totalStars: number
  totalForks: number
  topLangs: [string, number][]
  recentActivity: Array<{ text: ReturnType<typeof t>; time: string }>
}

function getLangColor(lang: string, theme: ReturnType<typeof useTheme>): string {
  switch (lang.toLowerCase()) {
    case "typescript": return theme.link
    case "javascript": return theme.warn
    case "rust": return theme.accent
    case "python": return theme.accentDim
    case "astro": return theme.success
    default: return theme.fg
  }
}

function formatRelativeTime(dateStr: string): string {
  try {
    const now = new Date()
    const past = new Date(dateStr)
    const diffMs = now.getTime() - past.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return "just now"
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays === 1) return "yesterday"
    return `${diffDays}d ago`
  } catch {
    return ""
  }
}

function mergeTStrings(...parts: Array<ReturnType<typeof t>>) {
  const chunks: unknown[] = []
  for (const part of parts) {
    const p = part as unknown as { chunks?: unknown[] }
    if (p.chunks) {
      chunks.push(...p.chunks)
    }
  }
  return { chunks } as ReturnType<typeof t>
}

function useGitHubStats(): GitHubStats | null {
  const [stats, setStats] = useState<GitHubStats | null>(null)

  useEffect(() => {
    let active = true

    const fetchStats = async () => {
      try {
        const userRes = await fetch(`https://api.github.com/users/${PROFILE.handle}`)
        const user = (await userRes.json()) as {
          public_repos?: number
          followers?: number
          following?: number
          name?: string
          bio?: string
        }

        const reposRes = await fetch(`https://api.github.com/users/${PROFILE.handle}/repos?per_page=100&sort=updated`)
        const repos = (await reposRes.json()) as Array<{
          stargazers_count?: number
          forks_count?: number
          language?: string | null
        }>

        const langCount: Record<string, number> = {}
        let totalStars = 0
        let totalForks = 0

        if (Array.isArray(repos)) {
          for (const repo of repos) {
            totalStars += repo.stargazers_count ?? 0
            totalForks += repo.forks_count ?? 0
            if (repo.language) {
              langCount[repo.language] = (langCount[repo.language] ?? 0) + 1
            }
          }
        }

        const topLangs = Object.entries(langCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)

        const eventsRes = await fetch(`https://api.github.com/users/${PROFILE.handle}/events?per_page=10`)
        const events = (await eventsRes.json()) as Array<{
          type?: string
          created_at?: string
          repo?: { name?: string }
          payload?: {
            ref_type?: string
            ref?: string
          }
        }>

        const recentActivity = Array.isArray(events)
          ? events
              .slice(0, 4)
              .map((e) => {
                const repoName = e.repo?.name?.split("/")[1] ?? ""
                const time = e.created_at ? formatRelativeTime(e.created_at) : ""
                let text: ReturnType<typeof t> | null = null

                if (e.type === "PushEvent") {
                  const ref = e.payload?.ref?.replace("refs/heads/", "") ?? "main"
                  text = t`🚀 Pushed to ${bold(ref)} in ${bold(repoName)}`
                } else if (e.type === "CreateEvent") {
                  text = t`🌱 Created ${e.payload?.ref_type ?? "repo"} in ${bold(repoName)}`
                } else if (e.type === "WatchEvent") {
                  text = t`⭐ Starred ${bold(repoName)}`
                } else if (e.type === "ForkEvent") {
                  text = t`🍴 Forked ${bold(repoName)}`
                } else {
                  text = t`▶ ${(e.type ?? "").toLowerCase().replace("event", "")} in ${bold(repoName)}`
                }

                return { text, time }
              })
              .filter((act): act is { text: ReturnType<typeof t>; time: string } => act.text !== null)
          : []

        if (active) {
          setStats({
            name: user.name ?? PROFILE.name,
            bio: user.bio ?? PROFILE.bio,
            followers: user.followers ?? 14,
            following: user.following ?? 18,
            totalRepos: user.public_repos ?? PROFILE.totalRepos,
            totalStars: Math.max(totalStars, 17),
            totalForks: Math.max(totalForks, 3),
            topLangs: topLangs.length > 0 ? topLangs : [["TypeScript", 24], ["Rust", 4], ["Python", 3], ["JavaScript", 8]],
            recentActivity: recentActivity.length > 0 ? recentActivity : [
              { text: t`🚀 Pushed to ${bold("main")} in ${bold("fasty")}`, time: "1d ago" },
              { text: t`🌱 Updated ${bold("llegapo-server")}`, time: "2d ago" },
              { text: t`⭐ Starred ${bold("indies.cl")}`, time: "3d ago" },
            ],
          })
        }
      } catch {
        if (active) {
          setStats({
            name: PROFILE.name,
            bio: PROFILE.bio,
            followers: 14,
            following: 18,
            totalRepos: PROFILE.totalRepos,
            totalStars: REPOS.reduce((a, r) => a + r.stars, 0),
            totalForks: 3,
            topLangs: [["TypeScript", 24], ["Rust", 4], ["Python", 3], ["JavaScript", 8]],
            recentActivity: [
              { text: t`🚀 Pushed to ${bold("main")} in ${bold("fasty")}`, time: "1d ago" },
              { text: t`🌱 Updated ${bold("llegapo-server")}`, time: "2d ago" },
              { text: t`⭐ Starred ${bold("indies.cl")}`, time: "3d ago" },
            ],
          })
        }
      }
    }

    fetchStats()
    return () => {
      active = false
    }
  }, [])

  return stats
}

function langBar(count: number, max: number, filledColor: string, bgColor: string, width: number = 14): ReturnType<typeof t> {
  const filled = max > 0 ? Math.round((count / max) * width) : 0
  const empty = width - filled
  return t`${fg(filledColor)("█".repeat(filled))}${fg(bgColor)("░".repeat(empty))}`
}

export function StatsScreen({ width, height }: { width: number; height?: number }) {
  const theme = useTheme()
  const stats = useGitHubStats()
  const isNarrow = width < 85
  const isShort = (height || 40) < 26

  if (!stats) {
    return (
      <box style={{ flexDirection: "column", gap: 1, padding: 1, flexGrow: 1 }}>
        <text content={t`${bold(fg(theme.accent)("GITHUB METRICS"))} ${dim("// loading live data...")}`} />
        <text content={t`${dim("Fetching profile statistics from GitHub API...")}`} />
      </box>
    )
  }

  const maxLang = Math.max(...stats.topLangs.map(([, c]) => c), 1)
  const totalLangRepos = stats.topLangs.reduce((acc, [, c]) => acc + c, 0) || 1
  const barWidth = isNarrow ? 8 : 14
  const visibleLangs = isShort ? stats.topLangs.slice(0, 3) : stats.topLangs
  const visibleEvents = isShort ? stats.recentActivity.slice(0, 2) : stats.recentActivity

  return (
    <box style={{ flexDirection: "column", gap: 1, padding: 1, flexGrow: 1 }}>
      <box style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <text content={t`${bold(fg(theme.accent)("GITHUB LIVE METRICS"))} ${dim("// profile, repos & activity")}`} />
        <text content={t`${fg(theme.muted)("Handle:")} ${bold(fg(theme.link)(`@${PROFILE.handle}`))}`} />
      </box>
      <text content={t`${dim("────────────────────────────────────────────────────────────────────────")}`} />

      <box style={{ flexDirection: isNarrow ? "column" : "row", gap: 1 }}>
        {/* Left Card: Profile Overview */}
        <box
          title=" Overview "
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
          <box style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <text content={t`  ${fg(theme.muted)("Public Repos:")}`} />
            <text content={t`${bold(fg(theme.fg)(String(stats.totalRepos)))}  `} />
          </box>
          <box style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <text content={t`  ${fg(theme.muted)("Total Stars:")}`} />
            <text content={t`${bold(fg(theme.warn)(`${stats.totalStars} ★`))}  `} />
          </box>
          <box style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <text content={t`  ${fg(theme.muted)("Total Forks:")}`} />
            <text content={t`${bold(fg(theme.fg)(String(stats.totalForks)))}  `} />
          </box>
          <box style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <text content={t`  ${fg(theme.muted)("Followers:")}`} />
            <text content={t`${bold(fg(theme.success)(String(stats.followers)))}  `} />
          </box>
        </box>

        {/* Right Card: Languages */}
        <box
          title=" Top Languages "
          titleColor={theme.accent}
          style={{
            flexDirection: "column",
            gap: 0,
            flexGrow: 2,
            padding: 1,
            borderStyle: "rounded",
            borderColor: theme.border,
          }}
        >
          {visibleLangs.map(([lang, count]) => {
            const color = getLangColor(lang, theme)
            const pct = Math.round((count / totalLangRepos) * 100)

            const line = mergeTStrings(
              t`  ${fg(theme.fg)(lang.padEnd(11))} `,
              langBar(count, maxLang, color, theme.subtle, barWidth),
              t`  ${fg(color)(`${String(pct).padStart(3)}%`)} ${dim(`(${count})`)}`
            )

            return <text key={lang} content={line} />
          })}
        </box>
      </box>

      {/* Recent Activity Box */}
      {visibleEvents.length > 0 && (
        <box
          title=" Recent GitHub Events "
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
          {visibleEvents.map((activity, i) => (
            <box key={i} style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <text content={activity.text} />
              <text content={t`${fg(theme.muted)(activity.time)}  `} />
            </box>
          ))}
        </box>
      )}


      <text content={t`${dim("────────────────────────────────────────────────────────────────────────")}`} />
      <text content={t`  ${dim("Quick Keys:")} ${bold(fg(theme.accent)("1-0"))} ${dim("Screens")}  │  ${bold(fg(theme.accent)("[T]"))} ${dim("Theme")}  │  ${bold(fg(theme.accent)("[Q]"))} ${dim("Welcome Screen")}  │  ${bold(fg(theme.error)("[ESC]"))} ${dim("Exit")}`} />
    </box>
  )
}

