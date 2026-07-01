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

export function UsesScreen() {
  const theme = useTheme()

  const renderItem = (label: string, value: string) => (
    <box key={label} style={{ flexDirection: "row", gap: 1 }}>
      <text content={t`  ${fg(theme.muted)(label.padEnd(14))} ${fg(theme.fg)(value)}`} />
    </box>
  )

  return (
    <box style={{ flexDirection: "column", gap: 1, padding: 1, flexGrow: 1 }}>
      <text content={t`${bold(fg(theme.accent)("/uses"))} ${dim("// my development setup")}`} />
      <text content={t`${dim("────────────────────────────────────────────────────────")}`} />

      <box style={{ flexDirection: "row", gap: 2, flexGrow: 1 }}>
        {/* Editor & Terminal */}
        <box
          title=" ⌨️ Editor & Terminal "
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
          {SETUP.editor.map((item) => renderItem(item.label, item.value))}
        </box>

        {/* Hardware */}
        <box
          title=" 💻 Hardware "
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
          {SETUP.hardware.map((item) => renderItem(item.label, item.value))}
        </box>

        {/* Tools */}
        <box
          title=" 🛠️ Stack & Tools "
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
          {SETUP.tools.map((item) => renderItem(item.label, item.value))}
        </box>
      </box>

      <text content={t`${dim("────────────────────────────────────────────────────────")}`} />
      <text content={t`  ${dim("1-8 switch")}  ${dim("t")} ${fg(theme.muted)("theme")}  ${dim("q")} ${fg(theme.muted)("back")}`} />
    </box>
  )
}
