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

export function NowScreen() {
  const theme = useTheme()

  return (
    <box style={{ flexDirection: "column", gap: 1, padding: 1, flexGrow: 1 }}>
      <box style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <text content={t`${bold(fg(theme.accent)("now"))} ${dim("// what i'm up to right now")}`} />
        <text content={t`${fg(theme.muted)("updated:")} ${fg(theme.fg)("June 2026")}`} />
      </box>
      <text content={t`${dim("────────────────────────────────────────────────────────")}`} />

      {/* Three columns */}
      <box style={{ flexDirection: "row", gap: 2, flexGrow: 1 }}>
        <box
          title=" 🔨 Building "
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
          {BUILDING.map((item) => (
            <box key={item.name} style={{ flexDirection: "column" }}>
              <text content={t`  ${bold(fg(theme.link)(item.name))}`} />
              <text content={t`  ${fg(theme.muted)(item.desc)}`} />
            </box>
          ))}
        </box>

        <box
          title=" 📚 Learning "
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
          {LEARNING.map((item) => (
            <box key={item.name} style={{ flexDirection: "column" }}>
              <text content={t`  ${bold(fg(theme.success)(item.name))}`} />
              <text content={t`  ${fg(theme.muted)(item.desc)}`} />
            </box>
          ))}
        </box>

        <box
          title=" 🎧 Listening "
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
          {LISTENING.map((item) => (
            <box key={item.name} style={{ flexDirection: "column" }}>
              <text content={t`  ${bold(fg(theme.warn)(item.name))}`} />
              <text content={t`  ${fg(theme.muted)(item.desc)}`} />
            </box>
          ))}
        </box>
      </box>

      {/* Thinking section */}
      <box
        title=" 💭 Thinking About "
        titleColor={theme.accent}
        style={{
          flexDirection: "column",
          gap: 1,
          padding: 1,
          borderStyle: "rounded",
          borderColor: theme.border,
          marginTop: 1,
        }}
      >
        {THINKING.map((thought, i) => (
          <text key={i} content={t`  ${fg(theme.accent)("→")} ${fg(theme.fg)(thought)}`} />
        ))}
      </box>

      <text content={t`${dim("────────────────────────────────────────────────────────")}`} />
      <text content={t`  ${dim("1-8 switch")}  ${dim("t")} ${fg(theme.muted)("theme")}  ${dim("q")} ${fg(theme.muted)("back")}`} />
    </box>
  )
}
