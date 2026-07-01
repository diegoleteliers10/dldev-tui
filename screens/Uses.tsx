import { useState } from "react"
import { useKeyboard } from "@opentui/react"
import { t, bold, fg, dim } from "@opentui/core"
import { useTheme } from "../data"

const SETUP = {
  editor: [
    { label: "Editor", value: "Zed" },
    { label: "Terminal", value: "Ghostty + Fish" },
    { label: "Font", value: "Zed Mono Extended" },
    { label: "Theme", value: "One Dark" },
    { label: "Prompt", value: "Starship" },
    { label: "Multiplexer", value: "tmux" },
  ],
  hardware: [
    { label: "Machine", value: "Acer Aspire 3" },
    { label: "RAM / SSD", value: "8 GB / 256 GB" },
    { label: "Monitor", value: "LG 27\" 4K IPS" },
    { label: "Keyboard", value: "Keychron K2 (Brown)" },
    { label: "Mouse", value: "Logitech MX Master 3" },
    { label: "Headphones", value: "Sony WH-1000XM5" },
  ],
  tools: [
    { label: "Runtime", value: "Bun" },
    { label: "Pkg Manager", value: "Bun" },
    { label: "Containers", value: "Docker Desktop" },
    { label: "DB Client", value: "TablePlus" },
    { label: "Launcher", value: "Raycast" },
    { label: "Project Mgmt", value: "Linear" },
  ],
}

const CATEGORIES = [
  { id: "editor", label: "Editor & Terminal", icon: "⌨️" },
  { id: "hardware", label: "Hardware & Gear", icon: "💻" },
  { id: "tools", label: "Stack & Tools", icon: "🛠️" },
]

export function UsesScreen() {
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

  const renderItems = (items: Array<{ label: string; value: string }>) =>
    items.map((item) => (
      <box key={item.label} style={{ flexDirection: "row", gap: 1 }}>
        <text content={t`  ${fg(theme.muted)(item.label.padEnd(16))} ${fg(theme.fg)(item.value)}`} />
      </box>
    ))

  return (
    <box style={{ flexDirection: "column", gap: 1, padding: 1, flexGrow: 1 }}>
      <text content={t`${bold(fg(theme.accent)("uses"))} ${dim("// my development setup")}`} />
      <text content={t`${dim("────────────────────────────────────────────────────────")}`} />

      {/* Columns: Left Categories, Right Items */}
      <box style={{ flexDirection: "row", gap: 2, flexGrow: 1 }}>
        
        {/* Left: Setup Categories */}
        <box
          title=" Setup Group "
          titleColor={theme.accent}
          style={{
            width: 24,
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

      <text content={t`${dim("────────────────────────────────────────────────────────")}`} />
      <box style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <text content={t`  ${dim("1-9 switch")}  ${dim("t")} ${fg(theme.muted)("theme")}  ${dim("q")} ${fg(theme.muted)("back")}`} />
        <text content={t`${dim("Use ↑/↓ or J/K to browse")}  `} />
      </box>
    </box>
  )
}
