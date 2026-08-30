import { useState } from "react"
import { useKeyboard } from "@opentui/react"
import { t, bold, fg, dim } from "@opentui/core"
import { useTheme } from "../data"

const BUILDING = [
  { name: "dldev TUI", desc: "Interactive developer portfolio in terminal (OpenTUI & React)" },
  { name: "llegapo", desc: "Real-time Santiago public transit tracking mobile app" },
  { name: "open-banking-chile", desc: "Open-source data scrapers & financial connectors" },
  { name: "indies.cl community", desc: "Organizing meetups, hackathons & open source in LATAM" },
]

const LEARNING = [
  { name: "Rust & Systems Programming", desc: "Memory safety, concurrency, FFI & high-throughput pipelines" },
  { name: "Distributed Systems & Cloud", desc: "Consensus protocols, database indexing, caching & CAP theorem" },
  { name: "Computer Science @ UDD", desc: "Advanced data structures, discrete mathematics & algorithms" },
]

const LISTENING = [
  { name: "Darkside", desc: "Psychic (Album) — Electronic / Ambient" },
  { name: "Bonobo", desc: "Fragments (Album) — Downtempo / Electronica" },
  { name: "Syntax.fm & Changelog", desc: "Deep dives on modern software engineering & tooling" },
]

const THINKING = [
  "Building high-performance CLI tools that streamline day-to-day developer workflows",
  "Making open financial APIs accessible and democratized across Latin America",
  "The convergence of autonomous AI coding agents and terminal interfaces",
]

const CATEGORIES = [
  { id: "building", label: "Building", icon: "🔨" },
  { id: "learning", label: "Learning", icon: "📚" },
  { id: "listening", label: "Listening", icon: "🎧" },
  { id: "thinking", label: "Thinking About", icon: "💭" },
]

export function NowScreen({ width, height }: { width?: number; height?: number }) {
  const currentWidth = width || 80
  const isNarrow = currentWidth < 85
  const isShort = (height || 40) < 24
  const theme = useTheme()
  const [activeIndex, setActiveIndex] = useState(0)

  useKeyboard((key) => {
    if (key.name === "down" || key.name === "j") {
      setActiveIndex((prev) => (prev + 1) % CATEGORIES.length)
    } else if (key.name === "up" || key.name === "k") {
      setActiveIndex((prev) => (prev - 1 + CATEGORIES.length) % CATEGORIES.length)
    }
  })

  const activeCategory = CATEGORIES[activeIndex] ?? CATEGORIES[0]!

  return (
    <box style={{ flexDirection: "column", gap: 1, padding: 1, flexGrow: 1 }}>
      <box style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <text content={t`${bold(fg(theme.accent)("NOW"))} ${dim("// current focus, projects & learning")}`} />
        <text content={t`${fg(theme.muted)("Updated:")} ${fg(theme.fg)("2026")}`} />
      </box>
      <text content={t`${dim("────────────────────────────────────────────────────────────────────────")}`} />

      {/* Columns: Left Category List, Right Category Details */}
      <box style={{ flexDirection: "row", gap: 1, flexGrow: 1 }}>
        {/* Left: Categories Menu */}
        <box
          title=" Focus Area "
          titleColor={theme.accent}
          style={{
            width: isNarrow ? 14 : 20,
            flexDirection: "column",
            gap: 0,
            padding: 1,
            borderStyle: "rounded",
            borderColor: theme.border,
          }}
        >
          {CATEGORIES.map((cat, idx) => {
            const isActive = idx === activeIndex
            return (
              <text
                key={cat.id}
                content={
                  isActive
                    ? t`${fg(theme.accent)("▶")} ${bold(fg(theme.fg)(isNarrow ? cat.label.slice(0, 8) : cat.label))}`
                    : t`  ${fg(theme.muted)(isNarrow ? cat.label.slice(0, 8) : cat.label)}`
                }
              />
            )
          })}
        </box>


        {/* Right: Selected Category Details */}
        <box
          title={` ${activeCategory.icon} ${activeCategory.label} `}
          titleColor={theme.accent}
          style={{
            flexGrow: 1,
            flexDirection: "column",
            gap: 1,
            padding: 1,
            borderStyle: "rounded",
            borderColor: theme.border,
          }}
        >
          {activeCategory.id === "building" &&
            BUILDING.map((item) => (
              <box key={item.name} style={{ flexDirection: "column" }}>
                <text content={t`  ${bold(fg(theme.link)(item.name))}`} />
                <text content={t`    ${fg(theme.fg)(item.desc)}`} />
              </box>
            ))}

          {activeCategory.id === "learning" &&
            LEARNING.map((item) => (
              <box key={item.name} style={{ flexDirection: "column" }}>
                <text content={t`  ${bold(fg(theme.success)(item.name))}`} />
                <text content={t`    ${fg(theme.fg)(item.desc)}`} />
              </box>
            ))}

          {activeCategory.id === "listening" &&
            LISTENING.map((item) => (
              <box key={item.name} style={{ flexDirection: "column" }}>
                <text content={t`  ${bold(fg(theme.warn)(item.name))}`} />
                <text content={t`    ${fg(theme.fg)(item.desc)}`} />
              </box>
            ))}

          {activeCategory.id === "thinking" &&
            THINKING.map((item, idx) => (
              <text key={idx} content={t`  ${fg(theme.accent)("→")} ${fg(theme.fg)(item)}`} />
            ))}
        </box>
      </box>

      <text content={t`${dim("────────────────────────────────────────────────────────────────────────")}`} />
      <text content={t`  ${dim("Controls:")} ${bold(fg(theme.accent)("↑/↓ / J/K"))} ${dim("Select Area")}  │  ${bold(fg(theme.accent)("1-0"))} ${dim("Screens")}  │  ${bold(fg(theme.accent)("[T]"))} ${dim("Theme")}  │  ${bold(fg(theme.accent)("[Q]"))} ${dim("Back")}`} />
    </box>
  )
}

