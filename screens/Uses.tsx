import { useState } from "react"
import { useKeyboard } from "@opentui/react"
import { t, bold, fg, dim } from "@opentui/core"
import { useTheme } from "../data"

const SETUP = {
  editor: [
    { label: "Editor", value: "Zed & VS Code (Vim mode)" },
    { label: "Terminal", value: "Ghostty / Kitty + Fish Shell" },
    { label: "Font", value: "Zed Mono Extended / Berkeley Mono" },
    { label: "Theme", value: "One Dark / Catppuccin Macchiato" },
    { label: "Prompt", value: "Starship prompt with custom git status" },
    { label: "Multiplexer", value: "tmux + custom sessionizer" },
  ],
  hardware: [
    { label: "Primary Machine", value: "Apple Silicon Mac (M-Series)" },
    { label: "Workstation", value: "Linux x86_64 Dev Box" },
    { label: "Monitor", value: "27\" 4K IPS Ultra-sharp" },
    { label: "Keyboard", value: "Keychron Mechanical (Custom Brown Switches)" },
    { label: "Mouse", value: "Logitech MX Master 3S" },
    { label: "Audio", value: "Sony WH-1000XM5 Noise Cancelling" },
  ],
  tools: [
    { label: "Runtimes", value: "Bun, Node.js (LTS), Rust (rustup/cargo), Go" },
    { label: "Pkg Manager", value: "Bun & Cargo" },
    { label: "Containerization", value: "Docker Desktop & OrbStack" },
    { label: "Database Client", value: "TablePlus & psql CLI" },
    { label: "Productivity", value: "Raycast + custom extensions" },
    { label: "Version Control", value: "Git, GitHub CLI (gh), Lazygit" },
  ],
}

const CATEGORIES = [
  { id: "editor", label: "Editor & Shell", icon: "⌨️" },
  { id: "hardware", label: "Hardware & Gear", icon: "💻" },
  { id: "tools", label: "Dev Tools & Stack", icon: "🛠️" },
]

export function UsesScreen({ width, height }: { width?: number; height?: number }) {
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

  const renderItems = (items: Array<{ label: string; value: string }>) =>
    items.map((item) => (
      <box key={item.label} style={{ flexDirection: "column", gap: 0 }}>
        <text content={t`  ${bold(fg(theme.accent)(item.label))}`} />
        <text content={t`    ${fg(theme.fg)(item.value)}`} />
      </box>
    ))

  return (
    <box style={{ flexDirection: "column", gap: 1, padding: 1, flexGrow: 1 }}>
      <box style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <text content={t`${bold(fg(theme.accent)("USES"))} ${dim("// hardware, editor & developer setup")}`} />
        <text content={t`${fg(theme.muted)("Environment:")} ${fg(theme.fg)("macOS / Linux")}`} />
      </box>
      <text content={t`${dim("────────────────────────────────────────────────────────────────────────")}`} />

      {/* Columns: Left Categories, Right Items */}
      <box style={{ flexDirection: "row", gap: 1, flexGrow: 1 }}>
        {/* Left: Setup Categories */}
        <box
          title=" Setup Group "
          titleColor={theme.accent}
          style={{
            width: isNarrow ? 14 : 22,
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


        {/* Right: Category Items */}
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
          {activeCategory.id === "editor" && renderItems(SETUP.editor)}
          {activeCategory.id === "hardware" && renderItems(SETUP.hardware)}
          {activeCategory.id === "tools" && renderItems(SETUP.tools)}
        </box>
      </box>

      <text content={t`${dim("────────────────────────────────────────────────────────────────────────")}`} />
      <text content={t`  ${dim("Controls:")} ${bold(fg(theme.accent)("↑/↓ / J/K"))} ${dim("Select Group")}  │  ${bold(fg(theme.accent)("1-0"))} ${dim("Screens")}  │  ${bold(fg(theme.accent)("[T]"))} ${dim("Theme")}  │  ${bold(fg(theme.accent)("[Q]"))} ${dim("Back")}`} />
    </box>
  )
}

