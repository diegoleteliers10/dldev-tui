import { useState } from "react"
import { useKeyboard } from "@opentui/react"
import { t, bold, fg, dim } from "@opentui/core"
import { useTheme } from "../data"

const BUILDING = [
  { name: "dldev TUI", desc: "this very portfolio terminal" },
  { name: "llegapo", desc: "Santiago real-time transit app" },
  { name: "open-banking-chile", desc: "open source bank scrapers" },
]

const LEARNING = [
  { name: "Rust", desc: "systems programming & ownership" },
  { name: "Distributed Systems", desc: "consensus, replication, CAP" },
  { name: "CS @ UDD", desc: "algorithms & data structures" },
]

const LISTENING = [
  { name: "Darkside", desc: "Psychic (album)" },
  { name: "Bonobo", desc: "Fragments (album)" },
  { name: "Syntax.fm", desc: "web dev podcast" },
]

const THINKING = [
  "How to make Chilean fintech more open and accessible",
  "Building a Rust-based CLI toolkit for everyday devs",
  "The intersection of community building and open source",
]

const CATEGORIES = [
  { id: "building", label: "Building", icon: "🔨" },
  { id: "learning", label: "Learning", icon: "📚" },
  { id: "listening", label: "Listening", icon: "🎧" },
  { id: "thinking", label: "Thinking About", icon: "💭" },
]

export function NowScreen() {
  const theme = useTheme()
  const [activeIndex, setActiveIndex] = useState(0)

  useKeyboard((key) => {
    if (key.name === "down" || key.name === "j") {
      setActiveIndex((prev) => (prev + 1) % CATEGORIES.length)
    } else if (key.name === "up" || key.name === "k") {
      setActiveIndex((prev) => (prev - 1 + CATEGORIES.length) % CATEGORIES.length)
    }
  })

  const activeCategory = CATEGORIES[activeIndex]!

  return (
    <box style={{ flexDirection: "column", gap: 1, padding: 1, flexGrow: 1 }}>
      <box style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <text content={t`${bold(fg(theme.accent)("now"))} ${dim("// what i'm up to right now")}`} />
        <text content={t`${fg(theme.muted)("updated:")} ${fg(theme.fg)("June 2026")}`} />
      </box>
      <text content={t`${dim("────────────────────────────────────────────────────────")}`} />

      {/* Columns: Left Category List, Right Category Details */}
      <box style={{ flexDirection: "row", gap: 2, flexGrow: 1 }}>
        
        {/* Left: Categories Menu */}
        <box
          title=" Section "
          titleColor={theme.accent}
          style={{
            width: 22,
            flexDirection: "column",
            gap: 1,
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
                    ? t`${fg(theme.accent)("▶")} ${bold(fg(theme.fg)(cat.label))}`
                    : t`  ${fg(theme.muted)(cat.label)}`
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
                <text content={t`    ${fg(theme.muted)(item.desc)}`} />
              </box>
            ))}

          {activeCategory.id === "learning" &&
            LEARNING.map((item) => (
              <box key={item.name} style={{ flexDirection: "column" }}>
                <text content={t`  ${bold(fg(theme.success)(item.name))}`} />
                <text content={t`    ${fg(theme.muted)(item.desc)}`} />
              </box>
            ))}

          {activeCategory.id === "listening" &&
            LISTENING.map((item) => (
              <box key={item.name} style={{ flexDirection: "column" }}>
                <text content={t`  ${bold(fg(theme.warn)(item.name))}`} />
                <text content={t`    ${fg(theme.muted)(item.desc)}`} />
              </box>
            ))}

          {activeCategory.id === "thinking" &&
            THINKING.map((item, idx) => (
              <text key={idx} content={t`  ${fg(theme.accent)("→")} ${fg(theme.fg)(item)}`} />
            ))}
        </box>
      </box>

      <text content={t`${dim("────────────────────────────────────────────────────────")}`} />
      <box style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <text content={t`  ${dim("1-9 switch")}  ${dim("t")} ${fg(theme.muted)("theme")}  ${dim("q")} ${fg(theme.muted)("back")}`} />
        <text content={t`${dim("Use ↑/↓ or J/K to browse")}  `} />
      </box>
    </box>
  )
}
