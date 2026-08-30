import { useState } from "react"
import { useKeyboard } from "@opentui/react"
import { t, bold, fg, dim } from "@opentui/core"
import { useTheme } from "../data"

interface Question {
  question: string
  options: { key: string; text: string }[]
  answer: string // "A" | "B" | "C" | "D"
  explanation: string
}

const QUESTIONS: Question[] = [
  {
    question: "Which programming language was originally named 'Oak'?",
    options: [
      { key: "A", text: "Java" },
      { key: "B", text: "Python" },
      { key: "C", text: "C++" },
      { key: "D", text: "PHP" },
    ],
    answer: "A",
    explanation: "James Gosling originally named Java 'Oak' after an oak tree that stood outside his office.",
  },
  {
    question: "Which data structure operates on a Last In, First Out (LIFO) basis?",
    options: [
      { key: "A", text: "Queue" },
      { key: "B", text: "Stack" },
      { key: "C", text: "Binary Tree" },
      { key: "D", text: "Hash Table" },
    ],
    answer: "B",
    explanation: "A Stack processes items in LIFO order, whereas a Queue processes them in FIFO (First In, First Out) order.",
  },
  {
    question: "Who created the Git version control system?",
    options: [
      { key: "A", text: "Linus Torvalds" },
      { key: "B", text: "Bill Gates" },
      { key: "C", text: "Guido van Rossum" },
      { key: "D", text: "Richard Stallman" },
    ],
    answer: "A",
    explanation: "Linus Torvalds created Git in 2005 to manage the Linux kernel development.",
  },
  {
    question: "What does CSS stand for?",
    options: [
      { key: "A", text: "Computer Style Sheets" },
      { key: "B", text: "Cascading Style Sheets" },
      { key: "C", text: "Creative Style Sheets" },
      { key: "D", text: "Colorful Style Sheets" },
    ],
    answer: "B",
    explanation: "CSS stands for Cascading Style Sheets, used to style HTML layouts.",
  },
  {
    question: "Which HTTP status code represents 'Unauthorized' access?",
    options: [
      { key: "A", text: "400 Bad Request" },
      { key: "B", text: "401 Unauthorized" },
      { key: "C", text: "403 Forbidden" },
      { key: "D", text: "404 Not Found" },
    ],
    answer: "B",
    explanation: "401 represents Unauthorized (needs authentication), while 403 represents Forbidden (authenticated but lacks permission).",
  },
  {
    question: "Which of these is NOT a valid hook in React?",
    options: [
      { key: "A", text: "useFetch" },
      { key: "B", text: "useEffect" },
      { key: "C", text: "useContext" },
      { key: "D", text: "useMemo" },
    ],
    answer: "A",
    explanation: "useFetch is a common custom hook name, but it is not built into React.",
  },
]

interface TriviaProps {
  width?: number
  height?: number
  onClose: () => void
}

export function TriviaScreen({ width, onClose }: TriviaProps) {
  const theme = useTheme()
  const [step, setStep] = useState<"intro" | "question" | "feedback" | "result">("intro")
  const [currentIdx, setCurrentIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<string>("")
  const [isCorrect, setIsCorrect] = useState(false)

  const activeQ = (QUESTIONS[currentIdx] ?? QUESTIONS[0]) as Question
  const boxWidth = Math.min(64, Math.max(30, (width || 80) - 6))

  useKeyboard((key) => {
    if (step === "intro") {
      if (key.name === "return" || key.name === "enter") {
        setStep("question")
        setCurrentIdx(0)
        setScore(0)
      } else if (key.name === "escape" || key.name === "q") {
        onClose()
      }
      return
    }

    if (step === "question" && activeQ) {
      const char = key.sequence.toUpperCase()
      if (["A", "B", "C", "D"].includes(char)) {
        const correct = char === activeQ.answer
        setSelected(char)
        setIsCorrect(correct)
        if (correct) setScore((s) => s + 1)
        setStep("feedback")
      } else if (key.name === "escape") {
        onClose()
      }
      return
    }

    if (step === "feedback") {
      if (currentIdx + 1 < QUESTIONS.length) {
        setCurrentIdx((idx) => idx + 1)
        setSelected("")
        setStep("question")
      } else {
        setStep("result")
      }
      return
    }

    if (step === "result") {
      if (key.name === "r") {
        setScore(0)
        setCurrentIdx(0)
        setSelected("")
        setStep("question")
      } else if (key.name === "escape" || key.name === "q" || key.name === "return" || key.name === "enter") {
        onClose()
      }
      return
    }
  })

  const getRank = (score: number) => {
    if (score === QUESTIONS.length) return "10x Developer 👑"
    if (score >= 4) return "Senior Engineer 🚀"
    if (score >= 2) return "Junior Dev 💻"
    return "Script Kiddie 👶"
  }

  if (step === "intro") {
    return (
      <box style={{ flexDirection: "column", width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
        <box style={{ borderStyle: "rounded", borderColor: theme.accent, padding: 1, flexDirection: "column", width: boxWidth, alignItems: "center" }}>
          <text content={t`${bold(fg(theme.accent)("⚡ DEVELOPER TRIVIA QUIZ ⚡"))}`} />
          <text content={t``} />
          <text content={t`${fg(theme.fg)("Test your technical knowledge!")}`} />
          <text content={t`${fg(theme.muted)("There are 6 multiple-choice questions.")}`} />
          <text content={t``} />
          <text content={t`${fg(theme.success)("  [ Press ENTER to start ]  ")}`} />
          <text content={t``} />
          <text content={t`${dim("[esc / q] Back to Home")}`} />
        </box>
      </box>
    )
  }

  if (step === "result") {
    const finalRank = getRank(score)
    return (
      <box style={{ flexDirection: "column", width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
        <box style={{ borderStyle: "double", borderColor: theme.success, padding: 1, flexDirection: "column", width: boxWidth, alignItems: "center" }}>
          <text content={t`${bold(fg(theme.success)("🎉 QUIZ COMPLETED! 🎉"))}`} />
          <text content={t``} />
          <text content={t`Your score: ${bold(fg(theme.accent)(`${score} / ${QUESTIONS.length}`))}`} />
          <text content={t`Developer Rank: ${bold(fg(theme.success)(finalRank))}`} />
          <text content={t``} />
          <text content={t`${fg(theme.muted)("────────────────────────────────────────")}`} />
          <text content={t``} />
          <text content={t`Press ${bold(fg(theme.accent)("[R]"))} to restart`} />
          <text content={t`Press ${bold(fg(theme.muted)("[ESC]"))} or ${bold(fg(theme.muted)("[Q]"))} to exit`} />
        </box>
      </box>
    )
  }

  // Active question or feedback
  return (
    <box style={{ flexDirection: "column", width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
      <box style={{ borderStyle: "rounded", borderColor: theme.border, padding: 1, flexDirection: "column", width: boxWidth }}>
        {/* Header */}
        <box style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <text content={t`${bold(fg(theme.accent)(`Question ${currentIdx + 1} of ${QUESTIONS.length}`))}`} />
          <text content={t`${fg(theme.muted)("Score:")} ${fg(theme.success)(String(score))}`} />
        </box>
        <text content={t`${dim("──────────────────────────────────────────────────────────────")}`} />
        <text content={t``} />


        {/* Question Text */}
        <text content={t`${bold(fg(theme.fg)(activeQ.question))}`} />
        <text content={t``} />

        {/* Options */}
        <box style={{ flexDirection: "column", gap: 0 }}>
          {activeQ.options.map((opt) => {
            let prefix = `  [${opt.key}] `
            let contentColor = theme.fg

            if (step === "feedback") {
              if (opt.key === activeQ.answer) {
                // Correct answer
                prefix = `  [✓] `
                contentColor = theme.success
              } else if (opt.key === selected) {
                // Wrong selected answer
                prefix = `  [✗] `
                contentColor = theme.error
              } else {
                contentColor = theme.muted
              }
            }

            return (
              <text
                key={opt.key}
                content={t`${bold(fg(contentColor === theme.success ? theme.success : contentColor === theme.error ? theme.error : theme.accent)(prefix))}${fg(contentColor)(opt.text)}`}
              />
            )
          })}
        </box>

        {/* Feedback Section */}
        {step === "feedback" && (
          <box style={{ flexDirection: "column", marginTop: 1, padding: 1, borderStyle: "single", borderColor: isCorrect ? theme.success : theme.error }}>
            <text content={t`${bold(fg(isCorrect ? theme.success : theme.error)(isCorrect ? "CORRECT!" : "INCORRECT!"))}`} />
            <text content={t`${fg(theme.fg)(activeQ.explanation)}`} />
            <text content={t``} />
            <text content={t`${dim("[ Press ANY KEY to continue ]")}`} />
          </box>
        )}

        {step === "question" && (
          <box style={{ marginTop: 1 }}>
            <text content={t`${dim("Press A, B, C, or D to answer")}`} />
          </box>
        )}
      </box>
    </box>
  )
}
