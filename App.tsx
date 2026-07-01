import { useState } from "react"
import { useKeyboard } from "@opentui/react"
import { t, bold, fg, dim } from "@opentui/core"
import { readFileSync } from "fs"
import { join } from "path"
import { Sidebar } from "./Sidebar"
import { HomeScreen } from "./screens/Home"
import { ProjectsScreen } from "./screens/Projects"
import { AboutScreen } from "./screens/About"
import { ContactScreen } from "./screens/Contact"
import { StatsScreen } from "./screens/Stats"
import { SystemScreen } from "./screens/System"
import { TriviaScreen } from "./screens/Trivia"
import { HeatmapScreen } from "./screens/Heatmap"
import { NowScreen } from "./screens/Now"
import { UsesScreen } from "./screens/Uses"
import { PomodoroScreen } from "./screens/Pomodoro"
import { THEMES, ThemeContext, type ThemeName, type Screen } from "./data"

const SPLASH_ART = [
  "UUUUUJUJJJJCCCCCCCLLLJ~;\"\"\"\"::>](|||1]~!l;;;II!i<++_+!I!>~-Ymmmwmmmmmm",
  "UUJJJJJCCJCCCCCLCCLLCl:\"\",,,l1trjxnunnr/(1-}}[}]+<i<<<il!i~_Jwmmwwwwww",
  "JJJJCCCLCCCCCJJUYXXz_\",,,,:i}/jxnucXXXXzXzXzcczzvx/]?->>i>~?xZwwwwwwww",
  "JCCCCCCJJJUYzzcuunx(,\",\"\":>](fxnnvzYUUJJJLCLL00OOOQJcr|-+!!+?nwwwqwqqw",
  "CCCCCJUUYXzvunxxxxfi\",,\":l_1/jrxnvzYUCCQQ0QQ0O0ZZmmZZQCv|~><<_Zqqqqqqq",
  "CCJJUYXzzvnxxxxrrx-;\"\"\"\",>?1/jxnucXUCQ0OO0Q0QQOZmwwmZOO0U];I<<jqqqpppp",
  "JUUUYXzcuxrrrrrrrr)\":\"^\":+[)|truuvXXJL0ZO0QQQOmwmwwwmZmOL1i<~!|wpppppp",
  "JUUYXzcurrrjrjrrjjfi,\"^^I__?][-++?|fnzULLLQQQOmmmmmwwmZZL[i<><Zppdpddd",
  "JUYXccvxrjjjjjjffft1l;\"\"~]-[)/rrf(?+?}tczvzXcuuuxrXYUXL0Ui!-_]ppdddddd",
  "JYXzcvnrjffffftttt\\-i;,\"-?_~I>>I_j~--~)zULJznjt/juvvYUCLnli-?0ddddddbd",
  "JYXccvxjfftttt//\\\\(+i:,;[{1[]1\\-]YX)[-)X0mOJX{|I,l}}uJOmf>>-{ddbdbbbbb",
  "JUXccvxffttt///\\||(+!i;~{(xvvnvcccvt()\\Y0ZO00CvvuYUQQ0mwx_l-Cbbbbbbbkb",
  "CUXzcvnjt///\\||||(1~~Il[1/uYCJUUXzj|1(xUOZOZZOwmwmZmwwwwj){Ykkkkkkkkkk",
  "JYzzcvnf//\\\\\\\\\\((()i<+i}1/nzUJCUUz|]{(cQOZOQOwmOQwqpqpqqffudkkkkkkkkkk",
  "JJXzccujt/\\||||())1}?_~]{|xvYJLLz{]))1jCZZZZOZmwqpppppppcccbkkkkkhhhkk",
  "CJYzcvnf/||||(()1)){?<>+}1fnXUJCc\\}->?}/XCXcQZZmpdpppqpqZQCbkkhhhhhhhh",
  "CJXccur/\\|(|(())111{}-:I[[|juzzzur//tuXUQOLQZwwqqqqqqppmmwwkhhhhhhhhhh",
  "CXXccuf\\\\||(()1111{{}}-![?}(tff|]}(txzYYJQQQC0OZmwwmqppqkhhhhhhahahhaa",
  "JXzzcuf\\(((()1111{{}[[[-]--[|\\\\+l+__1)fxxxYQLYvuzCmqwwqbhhhhaaaaaaaaaa",
  "CYzzcuj\\((()111{{}}}[[[?--+?(jcf()trvvYzCQ0ZmmZQUCZwqqdhahaaaaoaaaaaao",
  "LYXzzvn/|())111{{}}[[]]??~++_1|tffjuYUYYCQZwwqqwZ0mwqpaaaaaoaaoaoooooo",
  "QCYzccuj())111{}}[[]]]]??-~<><]}\\fuYL00OwwqqqwwZCQmmZhaaaaoooooooooooo",
  "LLJXzzcuf()1{{}}[[[]]???--?>>i>-{/vcCQZwqddpqwmLzL0mpaaooooooooooooooo",
  "QQLUXzccuj({{}}}[[]]]??----_+~!Ii}|xUCCCQZZQCLuuCwqppooooooooooooo****",
  "Q0QLJzzcvut){}[[]]]]?----__-~<~>;l<{xujt/jcr\\v0wdbbppoooooooo**o*o****",
  "000QCYzzcvur\\1[[]]??-?___++-_-_~~<<__?}1/uzQqdbbbbbppaoooo**o******#*#",
  "00000QCUYzcvx\\[]??___>l><!_-])([?[/nXJQOZwpdpbbbbbbdpzkfjZ*****#*#####",
  "OOOOOO0QYvt{]]--+>i,;!|!>+---(f\\)(fvUQZZwqpdbkkkkkbdpdMo~l)QL#########"
]


const BIG_D = ["██████ ", "██   ██", "██   ██", "██   ██", "██████ "]
const BIG_I = ["██████ ", "  ██   ", "  ██   ", "  ██   ", "██████ "]
const BIG_E = ["██████ ", "██     ", "████   ", "██     ", "██████ "]
const BIG_G = ["██████ ", "██     ", "██  ██ ", "██  ██ ", "██████ "]
const BIG_O = ["██████ ", "██  ██ ", "██  ██ ", "██  ██ ", "██████ "]

const BIG_NAME = [0, 1, 2, 3, 4].map((i) =>
  `${BIG_D[i]} ${BIG_I[i]} ${BIG_E[i]} ${BIG_G[i]} ${BIG_O[i]}`
)

export default function App() {
  const [phase, setPhase] = useState<"welcome" | "portfolio" | "trivia">("welcome")
  const [screen, setScreen] = useState<Screen>("home")
  const [themeName, setThemeName] = useState<ThemeName>("One Dark")

  const theme = THEMES[themeName]

  useKeyboard((key) => {
    if (key.name === "escape" && phase !== "trivia") {
      process.exit(0)
    }

    if (key.name === "t") {
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
      if (key.name === "q") setPhase("welcome")
    }
  })

  return (
    <ThemeContext.Provider value={theme}>
      {phase === "welcome" && (
        <box style={{ flexDirection: "column", width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
          {SPLASH_ART.map((line, i) => (
            <text key={i} content={t`${line}`} />
          ))}
          <text content={t``} />
          {BIG_NAME.map((line, i) => (
            <text key={`name-${i}`} content={t`${fg(theme.accent)(line)}`} />
          ))}
          <text content={t``} />
          <box style={{ borderStyle: "rounded", borderColor: theme.border, padding: 1, flexDirection: "column", width: 54, alignItems: "center" }}>
            <text content={t`Press ${bold(fg(theme.accent)("[ENTER]"))} to view Portfolio`} />
            <text content={t`Press ${bold(fg(theme.success)("[G]"))} to play Dev Trivia`} />
            <text content={t`Press ${bold(fg(theme.link)("[T]"))} to cycle Theme ${dim(`(${themeName})`)}`} />
            <text content={t`Press ${bold(fg(theme.error)("[ESC]"))} to exit`} />
          </box>
        </box>
      )}

      {phase === "trivia" && (
        <TriviaScreen onClose={() => setPhase("welcome")} />
      )}

      {phase === "portfolio" && (
        <box style={{ flexDirection: "row", width: "100%", height: "100%" }}>
          <Sidebar active={screen} onNavigate={setScreen} />
          <box style={{ flexGrow: 1, flexDirection: "column", padding: 1, borderStyle: "rounded", borderColor: theme.border, marginLeft: 1 }}>
            {screen === "home" && <HomeScreen />}
            {screen === "projects" && <ProjectsScreen />}
            {screen === "about" && <AboutScreen />}
            {screen === "contact" && <ContactScreen />}
            {screen === "stats" && <StatsScreen />}
            {screen === "heatmap" && <HeatmapScreen />}
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
