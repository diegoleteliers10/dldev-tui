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
    const fetchStats = async () => {
      try {
        const userRes = await fetch(`https://api.github.com/users/${PROFILE.handle}`)
        const user = await userRes.json() as {
          public_repos: number
          followers: number
          following: number
          name: string
          bio: string
        }

        const reposRes = await fetch(`https://api.github.com/users/${PROFILE.handle}/repos?per_page=100&sort=updated`)
        const repos = await reposRes.json() as Array<{ stargazers_count: number; forks_count: number; language: string | null }>

        const langCount: Record<string, number> = {}
        let totalStars = 0
        let totalForks = 0

        for (const repo of repos) {
          totalStars += repo.stargazers_count ?? 0
          totalForks += repo.forks_count ?? 0
          if (repo.language) {
            langCount[repo.language] = (langCount[repo.language] ?? 0) + 1
          }
        }

        const topLangs = Object.entries(langCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)

        const eventsRes = await fetch(`https://api.github.com/users/${PROFILE.handle}/events?per_page=10`)
        const events = await eventsRes.json() as Array<{
          type: string
          created_at: string
          repo?: { name?: string }
          payload?: {
            commits?: Array<unknown>
            ref_type?: string
            ref?: string
            action?: string
          }
        }>

        const recentActivity = events
          .slice(0, 5)
          .map((e) => {
            const repoName = e.repo?.name?.split("/")[1] ?? ""
            const time = formatRelativeTime(e.created_at)
            let text: ReturnType<typeof t> | null = null

            if (e.type === "PushEvent") {
              const ref = e.payload?.ref?.replace("refs/heads/", "") ?? "main"
              text = t`🚀 Pushed to branch ${bold(ref)} of ${bold(repoName)}`
            } else if (e.type === "CreateEvent") {
              text = t`🌱 Created ${e.payload?.ref_type ?? "repo"} in ${bold(repoName)}`
            } else if (e.type === "DeleteEvent") {
              text = t`🗑️ Deleted ${e.payload?.ref_type ?? "branch"} ${e.payload?.ref ?? ""} in ${bold(repoName)}`
            } else if (e.type === "WatchEvent") {
              text = t`⭐ Starred ${bold(repoName)}`
            } else if (e.type === "ForkEvent") {
              text = t`🍴 Forked ${bold(repoName)}`
            } else {
              text = t`▶ ${e.type?.toLowerCase().replace("event", "") ?? ""} in ${bold(repoName)}`
            }

            return { text, time }
          })
          .filter((act): act is { text: ReturnType<typeof t>; time: string } => act.text !== null)

        setStats({
          name: user.name ?? PROFILE.name,
          bio: user.bio ?? PROFILE.bio,
          followers: user.followers ?? 0,
          following: user.following ?? 0,
          totalRepos: user.public_repos ?? repos.length,
          totalStars,
          totalForks,
          topLangs,
          recentActivity,
        })
      } catch {
        setStats({
          name: PROFILE.name,
          bio: PROFILE.bio,
          followers: 12,
          following: 15,
          totalRepos: PROFILE.totalRepos,
          totalStars: REPOS.reduce((a, r) => a + r.stars, 0),
          totalForks: 2,
          topLangs: PROFILE.languages.map((l, i) => [l, 6 - i]),
          recentActivity: [
            { text: t`🚀 Pushed to branch ${bold("main")} of ${bold("fasty")}`, time: "2d ago" },
            { text: t`⭐ Starred ${bold("indies.cl")}`, time: "3d ago" },
            { text: t`🌱 Created branch ${bold("dev")} in ${bold("llegapo")}`, time: "5d ago" },
          ],
        })
      }
    }

    fetchStats()
  }, [])

  return stats
}

function langBar(count: number, max: number, filledColor: string, bgColor: string, width: number = 20): ReturnType<typeof t> {
  const filled = max > 0 ? Math.round((count / max) * width) : 0
  const empty = width - filled
  return t`${fg(filledColor)("█".repeat(filled))}${fg(bgColor)("░".repeat(empty))}`
}

export function StatsScreen({ width }: { width: number }) {
  const theme = useTheme()
  const stats = useGitHubStats()

  if (!stats) {
    return (
      <box style={{ flexDirection: "column", gap: 1, padding: 1, flexGrow: 1 }}>
        <text content={t`${bold(fg(theme.accent)("stats"))}`} />
        <text content={t`${dim("loading github data...")}`} />
      </box>
    )
  }

  const maxLang = Math.max(...stats.topLangs.map(([, c]) => c), 1)
  const totalLangRepos = stats.topLangs.reduce((acc, [, c]) => acc + c, 0) || 1

  return (
    <box style={{ flexDirection: "column", gap: 1, padding: 1, flexGrow: 1 }}>
      <text content={t`${bold(fg(theme.accent)("stats"))} ${dim("// github profile & activity")}`} />
      <text content={t`${dim("────────────────────────────────────────────────────────")}`} />

      <box style={{ flexDirection: width < 75 ? "column" : "row", gap: width < 75 ? 0 : 2, flexGrow: 1 }}>
        {/* Left Card: Profile Overview */}
        <box
          title=" 👤 GitHub Profile "
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
          <text content={t`  ${bold(fg(theme.fg)(stats.name))}`} />
          <text content={t`  ${dim("@" + PROFILE.handle)}`} />
          <text content={t`  ${dim(stats.bio)}`} />
          <text content={t``} />
          
          <box style={{ flexDirection: "column", gap: 0 }}>
            <box style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <text content={t`  ${fg(theme.muted)("Repositories:")}`} />
              <text content={t`${bold(fg(theme.fg)(String(stats.totalRepos)))}  `} />
            </box>
            <box style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <text content={t`  ${fg(theme.muted)("Total Stars:")}`} />
              <text content={t`${bold(fg(theme.warn)(String(stats.totalStars) + " ★"))}  `} />
            </box>
            <box style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <text content={t`  ${fg(theme.muted)("Total Forks:")}`} />
              <text content={t`${bold(fg(theme.fg)(String(stats.totalForks)))}  `} />
            </box>
            <box style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <text content={t`  ${fg(theme.muted)("Followers:")}`} />
              <text content={t`${bold(fg(theme.success)(String(stats.followers)))}  `} />
            </box>
            <box style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <text content={t`  ${fg(theme.muted)("Following:")}`} />
              <text content={t`${bold(fg(theme.link)(String(stats.following)))}  `} />
            </box>
          </box>
        </box>

        {/* Right Card: Languages */}
        <box
          title=" 📊 Top Languages "
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
          {stats.topLangs.map(([lang, count]) => {
            const color = getLangColor(lang, theme)
            const pct = Math.round((count / totalLangRepos) * 100)
            
            // Build the line as a single merged TString to ensure perfect alignment
            const line = mergeTStrings(
              t`  ${fg(theme.fg)(lang.padEnd(12))} `,
              langBar(count, maxLang, color, theme.subtle),
              t`  ${fg(color)(String(pct).padStart(3) + "%")} ${dim(`(${count} repos)`)}`
            )

            return <text key={lang} content={line} />
          })}
        </box>
      </box>

      {/* Recent Activity Box */}
      {stats.recentActivity.length > 0 && (
        <box
          title=" 🚀 Recent GitHub Activity "
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
          {stats.recentActivity.map((activity, i) => (
            <box key={i} style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <text content={activity.text} />
              <text content={t`${fg(theme.muted)(activity.time)}  `} />
            </box>
          ))}
        </box>
      )}

      <text content={t`${dim("────────────────────────────────────────────────────────")}`} />
      <text content={t`  ${dim("1-0 switch")}  ${dim("t")} ${fg(theme.muted)("theme")}  ${dim("q")} ${fg(theme.muted)("back")}`} />
    </box>
  )
}
