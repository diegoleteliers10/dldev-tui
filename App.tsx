import { useState } from "react"
import { useKeyboard, useTerminalDimensions } from "@opentui/react"
import { t, bold, fg, dim } from "@opentui/core"
import { Sidebar } from "./Sidebar"
import { HomeScreen } from "./screens/Home"
import { ProjectsScreen } from "./screens/Projects"
import { AboutScreen } from "./screens/About"
import { ContactScreen } from "./screens/Contact"
import { StatsScreen } from "./screens/Stats"
import { HeatmapScreen } from "./screens/Heatmap"
import { NowScreen } from "./screens/Now"
import { UsesScreen } from "./screens/Uses"
import { PomodoroScreen } from "./screens/Pomodoro"
import { SystemScreen } from "./screens/System"
import { TriviaScreen } from "./screens/Trivia"
import { THEMES, ThemeContext, PROFILE, type ThemeName, type Screen } from "./data"

const FULL_SPLASH_ART = [
  "                            {~?-_+<>i>~~_[[_                          ",
  "                          >>>l;;,,;;:;li+_+~-]                        ",
  "                        ~i;:,:^^^^^\"\",:;!>>~+<--                      ",
  "                      ll:\"\",;>??+l;::;I!~>i!II~__                     ",
  "                     j:\"\",,?tjxnnr\\{-]?]_+~<>!!~~+                    ",
  "                    ;:,,,I-\\rnuXXYYYUUUJCYn)]~!i_?                    ",
  "                    ;\",\":+)fxnvXUJLQQL00ZmZ0Cn{>><_                   ",
  "                   ;l,\",;?(fxncYCQOOQQQ0mwmZOOJ<;i~x                  ",
  "                    ,\"^\"i-?{)\\jvXJQ0QQOmwwwmZZC?i~<                   ",
  "                    lI\",_-}\\xx|+_)vvcXvczvYUUOnii_+                   ",
  "                    ii,l]_!i!:c[__cL0Xj{]tvJLOf!+-                    ",
  "                    !lI~1jxrxvcn))cOO0Cx/jzvCmui~-                    ",
  "                   li>l](nYJUYc/{\\YOOZZwmmmwwwx)]                     ",
  "                    <++?)xXUCC/1(fQqm0Zwmqqpqqzn$                     ",
  "                     +>_}tvUCYt~<<(ztt0ZwpppwpOQ                      ",
  "                      ;>])fnvr\\/ruzCQ0ZwwqwqpqJb                      ",
  "                       _??}|1~-{txzXJLUXXQmqqw                        ",
  "                        -+]/nt|rvzXLOmwwOLmwqw                        ",
  "                        <+<_}|jcCQC0ZwwwZ0mmZ                         ",
  "                         _<i>[/cU0mqddwwYJQqk                         ",
  "                         _+~>;+(zUcYUYvr0pppL                         ",
  "                         ?-_~~i>+-?1rLqbbbdpq                         ",
  "                     \"`il>?1(]{jYLZmpdbbbbbpLU+~                      ",
  "                 I^:-1j{?-_}fftcCOwqdbkhkbbd#M\\!l;i                   ",
  "           ,:\"\"\"^^^:OQcj/?-]|xuYQwqdbbbbbbdMM{;;;,,,l+!>              ",
  "       \"\"\"^^\"\"\"\"^^^^!zXuu/)){rYULOwppdbbdab];:::^\",,:::;!+{           ",
  "     ,\"^^^^^^\"^^^^\"^^}uXzxjx\\|J0QOZZwpQC1::;;:,`^,,:::,,,,,\",:;;I>    ",
  "   :\"^^^^^^^^^^^^^\"\"^^^;_fucu/UwQn1~l::;::::,\"^^\":::\"^\",,\"^^\",,:,\",;I-",
]

const BIG_D = ["██████ ", "██   ██", "██   ██", "██   ██", "██████ "]
const BIG_I = ["██████ ", "  ██   ", "  ██   ", "  ██   ", "██████ "]
const BIG_E = ["██████ ", "██     ", "████   ", "██     ", "██████ "]
const BIG_G = ["██████ ", "██     ", "██  ██ ", "██  ██ ", "██████ "]
const BIG_O = ["██████ ", "██  ██ ", "██  ██ ", "██  ██ ", "██████ "]

const BIG_NAME = [0, 1, 2, 3, 4].map((i) =>
  `${BIG_D[i]} ${BIG_I[i]} ${BIG_E[i]} ${BIG_G[i]} ${BIG_O[i]}`
)

const SCREEN_ORDER: Screen[] = [
  "home",
  "projects",
  "about",
  "contact",
  "stats",
  "heatmap",
  "now",
  "uses",
  "pomodoro",
  "system",
]

export default function App() {
  const [phase, setPhase] = useState<"welcome" | "portfolio" | "trivia">("welcome")
  const [screen, setScreen] = useState<Screen>("home")
  const [themeName, setThemeName] = useState<ThemeName>("One Dark")
  const dimensions = useTerminalDimensions()

  const terminalWidth = dimensions.width || process.stdout.columns || 80
  const terminalHeight = dimensions.height || process.stdout.rows || 40

  const theme = THEMES[themeName] ?? THEMES["One Dark"]

  useKeyboard((key) => {
    if (key.name === "escape" && phase !== "trivia") {
      process.exit(0)
    }

    if (key.name === "t" && phase !== "trivia") {
      setThemeName((prev) => {
        const keys = Object.keys(THEMES) as ThemeName[]
        const idx = keys.indexOf(prev)
        return keys[(idx + 1) % keys.length] as ThemeName
      })
      return
    }

    if (phase === "welcome") {
      if (key.name === "return" || key.name === "enter") setPhase("portfolio")
      if (key.name === "g") setPhase("trivia")
      return
    }

    if (phase === "portfolio") {
      if (key.name === "1") setScreen("home")
      if (key.name === "2") setScreen("projects")
      if (key.name === "3") setScreen("about")
      if (key.name === "4") setScreen("contact")
      if (key.name === "5") setScreen("stats")
      if (key.name === "6") setScreen("heatmap")
      if (key.name === "7") setScreen("now")
      if (key.name === "8") setScreen("uses")
      if (key.name === "9") setScreen("pomodoro")
      if (key.name === "0") setScreen("system")
      if (key.name === "tab") {
        setScreen((prev) => {
          const idx = SCREEN_ORDER.indexOf(prev)
          return SCREEN_ORDER[(idx + 1) % SCREEN_ORDER.length] ?? "home"
        })
      }
      if (key.name === "q") setPhase("welcome")
    }
  })

  // Responsive Welcome Art decision
  const showFullArt = terminalWidth >= 76 && terminalHeight >= 38
  const showBigName = terminalWidth >= 54 && terminalHeight >= 26

  return (
    <ThemeContext.Provider value={theme}>
      {phase === "welcome" && (
        <box style={{ flexDirection: "column", width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
          {showFullArt && (
            <box style={{ flexDirection: "column", alignItems: "center", marginBottom: 1 }}>
              {FULL_SPLASH_ART.map((line, i) => (
                <text key={i} content={t`${fg(theme.accent)(line)}`} />
              ))}
            </box>
          )}

          {showBigName ? (
            <box style={{ flexDirection: "column", alignItems: "center", marginBottom: 1 }}>
              {BIG_NAME.map((line, i) => (
                <text key={`name-${i}`} content={t`${bold(fg(theme.accent)(line))}`} />
              ))}
            </box>
          ) : (
            <box style={{ flexDirection: "column", alignItems: "center", marginBottom: 1 }}>
              <text content={t`╔════════════════════════════════════════════╗`} />
              <text content={t`║   ${bold(fg(theme.accent)("D I E G O   L E T E L I E R"))}            ║`} />
              <text content={t`║   ${fg(theme.muted)(PROFILE.title)}   ║`} />
              <text content={t`╚════════════════════════════════════════════╝`} />
            </box>
          )}

          <text content={t`${fg(theme.muted)(PROFILE.status)}`} />
          <text content={t``} />

          <box style={{ borderStyle: "rounded", borderColor: theme.border, padding: 1, flexDirection: "column", width: Math.min(54, terminalWidth - 4), alignItems: "center" }}>
            <text content={t`Press ${bold(fg(theme.accent)("[ENTER]"))} to view Portfolio`} />
            <text content={t`Press ${bold(fg(theme.success)("[G]"))} to play Dev Trivia Quiz`} />
            <text content={t`Press ${bold(fg(theme.link)("[T]"))} to cycle Theme ${dim(`(${themeName})`)}`} />
            <text content={t`Press ${bold(fg(theme.error)("[ESC]"))} to Exit`} />
          </box>
        </box>
      )}

      {phase === "trivia" && (
        <TriviaScreen onClose={() => setPhase("welcome")} />
      )}

      {phase === "portfolio" && (
        <box style={{ flexDirection: "row", width: "100%", height: "100%" }}>
          <Sidebar active={screen} terminalWidth={terminalWidth} onNavigate={setScreen} />
          <box style={{ flexGrow: 1, flexDirection: "column", padding: 1, borderStyle: "rounded", borderColor: theme.border, marginLeft: 1 }}>
            {screen === "home" && <HomeScreen width={terminalWidth} />}
            {screen === "projects" && <ProjectsScreen width={terminalWidth} />}
            {screen === "about" && <AboutScreen width={terminalWidth} />}
            {screen === "contact" && <ContactScreen />}
            {screen === "stats" && <StatsScreen width={terminalWidth} />}
            {screen === "heatmap" && <HeatmapScreen width={terminalWidth} />}
            {screen === "now" && <NowScreen />}
            {screen === "uses" && <UsesScreen />}
            {screen === "pomodoro" && <PomodoroScreen />}
            {screen === "system" && <SystemScreen />}
          </box>
        </box>
      )}
    </ThemeContext.Provider>
  )
}

