export type Screen = "home" | "projects" | "about" | "contact" | "stats" | "system" | "heatmap" | "now" | "uses" | "pomodoro"

export interface Repo {
  name: string
  description: string
  language: string | null
  stars: number
  url: string
  tags: string[]
  highlight?: boolean
}

export type ThemeName = "One Dark" | "Dracula" | "Catppuccin" | "Gruvbox" | "Nord"

export interface Theme {
  bg: string
  fg: string
  muted: string
  subtle: string
  accent: string
  accentDim: string
  link: string
  success: string
  warn: string
  error: string
  border: string
}

export const THEMES: Record<ThemeName, Theme> = {
  "One Dark": {
    bg: "#0F1117",
    fg: "#C9CDD4",
    muted: "#5C6370",
    subtle: "#3E4451",
    accent: "#D4A574",
    accentDim: "#8B6F52",
    link: "#7CAAB5",
    success: "#98C379",
    warn: "#E5C07B",
    error: "#E06C75",
    border: "#2C313C",
  },
  "Dracula": {
    bg: "#282a36",
    fg: "#f8f8f2",
    muted: "#6272a4",
    subtle: "#44475a",
    accent: "#bd93f9",
    accentDim: "#8be9fd",
    link: "#8be9fd",
    success: "#50fa7b",
    warn: "#f1fa8c",
    error: "#ff5555",
    border: "#44475a",
  },
  "Catppuccin": {
    bg: "#24273a",
    fg: "#cad3f5",
    muted: "#8087a2",
    subtle: "#494d64",
    accent: "#c6a0f6",
    accentDim: "#f5bde6",
    link: "#8bd5ca",
    success: "#a6da95",
    warn: "#eed49f",
    error: "#ed8796",
    border: "#5b6078",
  },
  "Gruvbox": {
    bg: "#282828",
    fg: "#ebdbb2",
    muted: "#928374",
    subtle: "#3c3836",
    accent: "#fe8019",
    accentDim: "#fabd2f",
    link: "#83a598",
    success: "#b8bb26",
    warn: "#fabd2f",
    error: "#fb4934",
    border: "#504945",
  },
  "Nord": {
    bg: "#2e3440",
    fg: "#d8dee9",
    muted: "#4c566a",
    subtle: "#3b4252",
    accent: "#88c0d0",
    accentDim: "#81a1c1",
    link: "#8fbcbb",
    success: "#a3be8c",
    warn: "#ebcb8b",
    error: "#bf616a",
    border: "#434c5e",
  }
}

// Fallback for static imports
export const THEME = THEMES["One Dark"]

import { createContext, useContext } from "react"
export const ThemeContext = createContext<Theme>(THEMES["One Dark"])
export const useTheme = () => useContext(ThemeContext)

export const PROFILE = {
  name: "Diego Letelier",
  handle: "diegoleteliers10",
  location: "Santiago, Chile",
  role: "Full-stack developer",
  bio: "Building tools that solve real problems. CS student at UDD, SoyHenry grad.",
  website: "https://diegoletelierdev.vercel.app/",
  totalRepos: 49,
  languages: ["TypeScript", "JavaScript", "Rust", "Python", "Astro", "Kotlin"],
}

export const REPOS: Repo[] = [
  {
    name: "fasty",
    description: "Fast file operations in Rust",
    language: "Rust",
    stars: 7,
    url: "https://github.com/diegoleteliers10/fasty",
    tags: ["rust", "cli", "performance"],
    highlight: true,
  },
  {
    name: "indies.cl",
    description: "Community landing page",
    language: "TypeScript",
    stars: 4,
    url: "https://github.com/indies-cl/indies.cl",
    tags: ["community", "landing"],
    highlight: true,
  },
  {
    name: "nestjs-interceptors-skill",
    description: "AI agent skill for NestJS interceptors",
    language: null,
    stars: 3,
    url: "https://github.com/diegoleteliers10/nestjs-interceptors-skill",
    tags: ["ai", "nestjs", "skill"],
    highlight: true,
  },
  {
    name: "indies.la",
    description: "Landing for indies.la",
    language: "TypeScript",
    stars: 2,
    url: "https://github.com/indies-cl/indies.la",
    tags: ["community", "landing"],
  },
  {
    name: "biovity",
    description: "Job search platform for Chile",
    language: "TypeScript",
    stars: 1,
    url: "https://github.com/diegoleteliers10/biovity",
    tags: ["startup", "fullstack", "chile"],
    highlight: true,
  },
  {
    name: "llegapo",
    description: "Santiago transit in real-time",
    language: "TypeScript",
    stars: 0,
    url: "https://github.com/diegoleteliers10/llegapo",
    tags: ["mobile", "api", "chile"],
    highlight: true,
  },
  {
    name: "open-banking-chile",
    description: "Open source scrapers for Chilean banks",
    language: null,
    stars: 0,
    url: "https://github.com/diegoleteliers10/open-banking-chile",
    tags: ["fintech", "open-source", "chile"],
  },
  {
    name: "gigsy",
    description: "Gig economy platform",
    language: "TypeScript",
    stars: 0,
    url: "https://github.com/Gigsy-project/gigsy",
    tags: ["startup", "fullstack"],
  },
  {
    name: "supercampeones_app",
    description: "Sports tracking app",
    language: "TypeScript",
    stars: 0,
    url: "https://github.com/diegoleteliers10/supercampeones_app",
    tags: ["mobile", "sports"],
  },
  {
    name: "devcmd",
    description: "Raycast extension for project commands",
    language: "TypeScript",
    stars: 0,
    url: "https://github.com/diegoleteliers10/devcmd",
    tags: ["productivity", "raycast"],
  },
  {
    name: "expenses-cli",
    description: "CLI for daily expenses",
    language: "Python",
    stars: 0,
    url: "https://github.com/diegoleteliers10/expenses-cli",
    tags: ["cli", "python", "productivity"],
  },
  {
    name: "wizarding_wares",
    description: "E-commerce for magical items",
    language: "JavaScript",
    stars: 1,
    url: "https://github.com/diegoleteliers10/wizarding_wares",
    tags: ["ecommerce", "fullstack"],
  },
  {
    name: "biovity-server",
    description: "Backend for biovity",
    language: "TypeScript",
    stars: 1,
    url: "https://github.com/diegoleteliers10/biovity-server",
    tags: ["backend", "api"],
  },
  {
    name: "llegapo-server",
    description: "REST API for Santiago transit (19 endpoints)",
    language: "TypeScript",
    stars: 0,
    url: "https://github.com/diegoleteliers10/llegapo-server",
    tags: ["api", "rest", "chile"],
  },
  {
    name: "hack-latam",
    description: "Landing for Hack@26 LATAM",
    language: "TypeScript",
    stars: 0,
    url: "https://github.com/indies-cl/hack-latam",
    tags: ["hackathon", "community"],
  },
]

export const SKILLS: Record<string, number> = {
  TypeScript: 88,
  JavaScript: 84,
  React: 80,
  "Node.js": 78,
  Git: 82,
  "REST APIs": 76,
  SQL: 68,
  Astro: 58,
  Python: 52,
  Rust: 38,
}
