import { useState } from "react"
import { useKeyboard } from "@opentui/react"
import { t, bold, fg, dim, underline } from "@opentui/core"
import { useTheme, REPOS, type Repo } from "../data"
import { openUrl } from "../open"

const FILTERS = ["all", "featured", "ts", "rust"] as const
type Filter = (typeof FILTERS)[number]

const FILTER_LABELS: Record<Filter, string> = {
  all: "all",
  featured: "featured",
  ts: "typescript",
  rust: "rust",
}

function filterRepos(repos: Repo[], filter: Filter): Repo[] {
  switch (filter) {
    case "all":
      return repos
    case "featured":
      return repos.filter((r) => r.highlight)
    case "ts":
      return repos.filter((r) => r.language === "TypeScript")
    case "rust":
      return repos.filter((r) => r.language === "Rust")
  }
}

export function ProjectsScreen() {
  const theme = useTheme()
  const [filter, setFilter] = useState<Filter>("all")
  const [selected, setSelected] = useState(0)

  const filtered = filterRepos(REPOS, filter)
  const selectedRepo = filtered[selected]

  const LANG_COLORS: Record<string, string> = {
    TypeScript: theme.link,
    JavaScript: theme.warn,
    Rust: "#CC8866",
    Python: theme.success,
    Astro: "#CC7744",
    Kotlin: "#B48EAD",
  }

  function langColor(lang: string | null): string {
    if (!lang) return theme.muted
    return LANG_COLORS[lang] ?? theme.muted
  }

  useKeyboard((key) => {
    if (key.name === "left") {
      setFilter((prev: Filter) => {
        const idx = FILTERS.indexOf(prev)
        return FILTERS[(idx - 1 + FILTERS.length) % FILTERS.length] ?? "all"
      })
      setSelected(0)
    }
    if (key.name === "right") {
      setFilter((prev: Filter) => {
        const idx = FILTERS.indexOf(prev)
        return FILTERS[(idx + 1) % FILTERS.length] ?? "all"
      })
      setSelected(0)
    }
    if (key.name === "up") {
      setSelected((s: number) => Math.max(0, s - 1))
    }
    if (key.name === "down") {
      setSelected((s: number) => Math.min(filtered.length - 1, s + 1))
    }
    if (key.name === "return" || key.name === "enter") {
      if (selectedRepo) {
        openUrl(selectedRepo.url)
      }
    }
  })

  return (
    <box style={{ flexDirection: "column", gap: 1, padding: 1, flexGrow: 1 }}>
      <text content={t`${bold(fg(theme.accent)("projects"))} ${dim("// " + filtered.length + " repositories")}`} />
      <text content={t`${dim("────────────────────────────────────────────────────────")}`} />

      {/* Filter pills */}
      <box style={{ flexDirection: "row", gap: 3, marginBottom: 1 }}>
        {FILTERS.map((f) => (
          <text
            key={f}
            content={
              f === filter
                ? t`${bold(fg(theme.accent)(`● ${FILTER_LABELS[f]}`))} `
                : t`  ${fg(theme.muted)(FILTER_LABELS[f])} `
            }
          />
        ))}
      </box>

      {/* Scrollable list container */}
      <box style={{ flexDirection: "column", gap: 0, flexGrow: 1 }}>
        {filtered.map((repo, i) => {
          const isActive = i === selected
          const starStr = repo.stars > 0 ? repo.stars + "★" : ""

          return (
            <text
              key={repo.name}
              content={
                isActive
                  ? t`${fg(theme.accent)("▶")} ${bold(fg(theme.fg)(repo.name.padEnd(25)))}  ${fg(langColor(repo.language))(String(repo.language ?? "").padEnd(12))}  ${starStr ? fg(theme.accent)(starStr) : dim("-")}`
                  : t`  ${fg(theme.muted)(repo.name.padEnd(25))}  ${fg(theme.muted)(String(repo.language ?? "").padEnd(12))}  ${starStr ? fg(theme.muted)(starStr) : dim(" ")}`
              }
            />
          )
        })}
      </box>

      {/* Selected repo details box */}
      {selectedRepo && (
        <box
          title=" Repository Details "
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
            <text content={t`${bold(fg(theme.accent)(selectedRepo.name))}`} />
            <text content={t`${fg(theme.muted)("tags:")} ${fg(theme.fg)(selectedRepo.tags.join(", "))}`} />
          </box>
          <text content={t`${fg(theme.fg)(selectedRepo.description)}`} />
          <text content={t`${underline(fg(theme.link)(selectedRepo.url))}`} />
          <text content={t`${dim("[enter] Open in Browser")}`} />
        </box>
      )}

      <text content={t`${dim("────────────────────────────────────────────────────────")}`} />
      <text content={t`  ${dim("↑↓ navigate  ←→ filter")}  ${dim("[enter]")} ${fg(theme.accent)("open")}  ${dim("q")} ${fg(theme.muted)("back")}`} />
    </box>
  )
}
