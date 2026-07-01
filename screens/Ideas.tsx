import { useState } from "react"
import { t, bold, fg, dim } from "@opentui/core"
import { useKeyboard } from "@opentui/react"
import { useTheme } from "../data"
import { writeFileSync, readFileSync, existsSync } from "fs"
import { join } from "path"

type Column = "ideas" | "wip" | "done"

interface IdeaItem {
  id: string
  text: string
  column: Column
}

const BOARD_FILE = join(import.meta.dir, ".ideas.json")

function loadBoard(): IdeaItem[] {
  try {
    if (existsSync(BOARD_FILE)) {
      return JSON.parse(readFileSync(BOARD_FILE, "utf-8")) as IdeaItem[]
    }
  } catch {/* ignore */}
  return [
    { id: "1", text: "CLI toolkit for Chilean devs", column: "ideas" },
    { id: "2", text: "Open banking dashboard", column: "ideas" },
    { id: "3", text: "Llegapo v2 with real-time map", column: "wip" },
    { id: "4", text: "This TUI portfolio", column: "done" },
  ]
}

function saveBoard(items: IdeaItem[]) {
  try {
    writeFileSync(BOARD_FILE, JSON.stringify(items, null, 2))
  } catch {/* ignore */}
}

const COLUMNS: Column[] = ["ideas", "wip", "done"]
const COL_LABELS: Record<Column, string> = {
  ideas: "💡 Ideas",
  wip: "🔨 In Progress",
  done: "✅ Done",
}
const COL_COLORS = (col: Column, theme: ReturnType<typeof useTheme>) => ({
  ideas: theme.link,
  wip: theme.warn,
  done: theme.success,
}[col])

export function IdeasScreen() {
  const theme = useTheme()
  const [items, setItems] = useState<IdeaItem[]>(loadBoard)
  const [activeCol, setActiveCol] = useState<Column>("ideas")
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [mode, setMode] = useState<"nav" | "help">("nav")

  const colItems = items.filter((i) => i.column === activeCol)
  const selected = colItems[selectedIdx]

  useKeyboard((key) => {
    if (mode === "help") {
      setMode("nav")
      return
    }

    // Navigate columns
    if (key.name === "left") {
      const idx = COLUMNS.indexOf(activeCol)
      setActiveCol(COLUMNS[(idx - 1 + COLUMNS.length) % COLUMNS.length] ?? "ideas")
      setSelectedIdx(0)
    }
    if (key.name === "right") {
      const idx = COLUMNS.indexOf(activeCol)
      setActiveCol(COLUMNS[(idx + 1) % COLUMNS.length] ?? "ideas")
      setSelectedIdx(0)
    }
    if (key.name === "up") {
      setSelectedIdx((i) => Math.max(0, i - 1))
    }
    if (key.name === "down") {
      setSelectedIdx((i) => Math.min(colItems.length - 1, i + 1))
    }

    // Move item to next column
    if (key.name === "return" || key.name === "enter") {
      if (!selected) return
      const colIdx = COLUMNS.indexOf(activeCol)
      if (colIdx < COLUMNS.length - 1) {
        const nextCol = COLUMNS[colIdx + 1] ?? activeCol
        const updated = items.map((item) =>
          item.id === selected.id ? { ...item, column: nextCol } : item
        )
        setItems(updated)
        saveBoard(updated)
        setSelectedIdx(0)
      }
    }

    // Move item back to previous column
    if (key.name === "b") {
      if (!selected) return
      const colIdx = COLUMNS.indexOf(activeCol)
      if (colIdx > 0) {
        const prevCol = COLUMNS[colIdx - 1] ?? activeCol
        const updated = items.map((item) =>
          item.id === selected.id ? { ...item, column: prevCol } : item
        )
        setItems(updated)
        saveBoard(updated)
        setSelectedIdx(0)
      }
    }

    // Delete item
    if (key.name === "d") {
      if (!selected) return
      const updated = items.filter((item) => item.id !== selected.id)
      setItems(updated)
      saveBoard(updated)
      setSelectedIdx(0)
    }

    if (key.name === "?") {
      setMode("help")
    }
  })

  return (
    <box style={{ flexDirection: "column", gap: 1, padding: 1, flexGrow: 1 }}>
      <text content={t`${bold(fg(theme.accent)("/ideas"))} ${dim("// kanban board")}`} />
      <text content={t`${dim("────────────────────────────────────────────────────────")}`} />

      {/* Kanban columns */}
      <box style={{ flexDirection: "row", gap: 2, flexGrow: 1 }}>
        {COLUMNS.map((col) => {
          const colColor = COL_COLORS(col, theme)
          const isActiveCol = col === activeCol
          const colList = items.filter((i) => i.column === col)

          return (
            <box
              key={col}
              title={` ${COL_LABELS[col]} (${colList.length}) `}
              titleColor={isActiveCol ? colColor : theme.muted}
              style={{
                flexDirection: "column",
                gap: 1,
                flexGrow: 1,
                padding: 1,
                borderStyle: "rounded",
                borderColor: isActiveCol ? colColor : theme.border,
              }}
            >
              {colList.length === 0 && (
                <text content={t`  ${dim("empty")}`} />
              )}
              {colList.map((item, i) => {
                const isSelected = isActiveCol && i === selectedIdx
                return (
                  <text
                    key={item.id}
                    content={
                      isSelected
                        ? t`${fg(colColor)("▶")} ${bold(fg(theme.fg)(item.text))}`
                        : t`  ${fg(isActiveCol ? theme.fg : theme.muted)(item.text)}`
                    }
                  />
                )
              })}
            </box>
          )
        })}
      </box>

      {mode === "help" && (
        <box
          title=" Help "
          titleColor={theme.accent}
          style={{
            flexDirection: "column",
            gap: 1,
            padding: 1,
            borderStyle: "rounded",
            borderColor: theme.accent,
          }}
        >
          <text content={t`  ${fg(theme.muted)("←/→")}  navigate columns     ${fg(theme.muted)("↑/↓")}  select item`} />
          <text content={t`  ${fg(theme.muted)("[enter]")} move to next column  ${fg(theme.muted)("[b]")}  move to prev column`} />
          <text content={t`  ${fg(theme.muted)("[d]")}  delete item          ${fg(theme.muted)("[?]")}  toggle help`} />
          <text content={t`  ${dim("note: to add items, edit .ideas.json in the project root")}`} />
        </box>
      )}

      <text content={t`${dim("────────────────────────────────────────────────────────")}`} />
      <text content={t`  ${dim("←→ cols")}  ${dim("↑↓ select")}  ${dim("[enter]")} ${fg(theme.accent)("advance")}  ${dim("[b]")} ${fg(theme.muted)("back")}  ${dim("[d]")} ${fg(theme.error)("delete")}  ${dim("[?] help")}`} />
    </box>
  )
}
