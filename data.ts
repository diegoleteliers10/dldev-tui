export type Screen =
  | "home"
  | "projects"
  | "about"
  | "contact"
  | "stats"
  | "heatmap"
  | "now"
  | "uses"
  | "pomodoro"
  | "system"

export interface Repo {
  name: string
  description: string
  language: string | null
  stars: number
  url: string
  tags: string[]
  highlight?: boolean
}

export type ThemeName =
  | "One Dark"
  | "Dracula"
  | "Catppuccin"
  | "Gruvbox"
  | "Nord"
  | "Tokyo Night"
  | "Cyberpunk"

export interface Theme {
  name: ThemeName
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
    name: "One Dark",
    bg: "#0F1117",
    fg: "#C9CDD4",
    muted: "#5C6370",
    subtle: "#2C313C",
    accent: "#D4A574",
    accentDim: "#8B6F52",
    link: "#61AFEF",
    success: "#98C379",
    warn: "#E5C07B",
    error: "#E06C75",
    border: "#3E4451",
  },
  Dracula: {
    name: "Dracula",
    bg: "#282a36",
    fg: "#f8f8f2",
    muted: "#6272a4",
    subtle: "#343746",
    accent: "#bd93f9",
    accentDim: "#9580ff",
    link: "#8be9fd",
    success: "#50fa7b",
    warn: "#f1fa8c",
    error: "#ff5555",
    border: "#44475a",
  },
  Catppuccin: {
    name: "Catppuccin",
    bg: "#24273a",
    fg: "#cad3f5",
    muted: "#8087a2",
    subtle: "#363a4f",
    accent: "#c6a0f6",
    accentDim: "#b7bdf8",
    link: "#8bd5ca",
    success: "#a6da95",
    warn: "#eed49f",
    error: "#ed8796",
    border: "#5b6078",
  },
  Gruvbox: {
    name: "Gruvbox",
    bg: "#282828",
    fg: "#ebdbb2",
    muted: "#928374",
    subtle: "#3c3836",
    accent: "#fe8019",
    accentDim: "#d65d0e",
    link: "#83a598",
    success: "#b8bb26",
    warn: "#fabd2f",
    error: "#fb4934",
    border: "#504945",
  },
  Nord: {
    name: "Nord",
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
  },
  "Tokyo Night": {
    name: "Tokyo Night",
    bg: "#1a1b26",
    fg: "#c0caf5",
    muted: "#565f89",
    subtle: "#24283b",
    accent: "#7aa2f7",
    accentDim: "#7dcfff",
    link: "#2ac3de",
    success: "#9ece6a",
    warn: "#e0af68",
    error: "#f7768e",
    border: "#414868",
  },
  Cyberpunk: {
    name: "Cyberpunk",
    bg: "#0d091a",
    fg: "#00ffcc",
    muted: "#5c5c8a",
    subtle: "#1f1a3a",
    accent: "#ff007f",
    accentDim: "#d6006b",
    link: "#00e5ff",
    success: "#00ff66",
    warn: "#ffe600",
    error: "#ff3366",
    border: "#800080",
  },
}

export const THEME = THEMES["One Dark"]

import { createContext, useContext } from "react"
export const ThemeContext = createContext<Theme>(THEMES["One Dark"])
export const useTheme = () => useContext(ThemeContext)

export const PROFILE = {
  name: "Diego Letelier",
  handle: "diegoleteliers10",
  title: "Full-Stack Engineer & Builder",
  location: "Santiago, Chile 🇨🇱",
  role: "Full-Stack Developer | CS Student @ UDD",
  bio: "Building tools that solve real problems. Passionate about developer tooling, real-time data, systems programming, and high-performance apps.",
  website: "https://diegoletelierdev.vercel.app/",
  github: "https://github.com/diegoleteliers10",
  linkedin: "https://linkedin.com/in/diegoletelier",
  email: "diegoleteliers10@gmail.com",
  totalRepos: 49,
  languages: ["TypeScript", "Rust", "JavaScript", "Python", "Go", "SQL"],
  status: "🟢 Available for high-impact projects & collaboration",
}

export interface ExperienceItem {
  period: string
  title: string
  organization: string
  description: string
  tags: string[]
}

export const EXPERIENCES: ExperienceItem[] = [
  {
    period: "2024 - Present",
    title: "Computer Science Student",
    organization: "Universidad del Desarrollo (UDD)",
    description: "Deepening algorithms, data structures, computer systems, and distributed architecture.",
    tags: ["Algorithms", "Systems", "C++", "Architecture"],
  },
  {
    period: "2023 - Present",
    title: "Community Builder & Maintainer",
    organization: "Indies.cl / Hack@26 LATAM",
    description: "Organizing tech communities, hackathons, and open source projects for builders across LATAM.",
    tags: ["Community", "Open Source", "TypeScript", "Events"],
  },
  {
    period: "2023 - 2024",
    title: "Co-founder & Full-Stack Engineer",
    organization: "Biovity",
    description: "Built the job discovery platform for Chile with scalable backend APIs and high-converting UI.",
    tags: ["Full Stack", "TypeScript", "Node.js", "PostgreSQL"],
  },
  {
    period: "2023",
    title: "Full Stack Developer Graduate",
    organization: "SoyHenry",
    description: "Intensive 800+ hours bootcamp covering modern JavaScript/TypeScript, React, Node, Express, and SQL.",
    tags: ["React", "Node.js", "PostgreSQL", "Express"],
  },
]

export const REPOS: Repo[] = [
  {
    name: "fasty",
    description: "High-performance CLI for blazing fast file operations",
    language: "Rust",
    stars: 7,
    url: "https://github.com/diegoleteliers10/fasty",
    tags: ["rust", "cli", "performance", "systems"],
    highlight: true,
  },
  {
    name: "indies.cl",
    description: "Community platform for Chilean indie creators & builders",
    language: "TypeScript",
    stars: 4,
    url: "https://github.com/indies-cl/indies.cl",
    tags: ["typescript", "community", "web", "chile"],
    highlight: true,
  },
  {
    name: "nestjs-interceptors-skill",
    description: "AI agent skill providing deep NestJS interceptor patterns",
    language: "TypeScript",
    stars: 3,
    url: "https://github.com/diegoleteliers10/nestjs-interceptors-skill",
    tags: ["ai", "nestjs", "skill", "agentic"],
    highlight: true,
  },
  {
    name: "indies.la",
    description: "LATAM-wide developer community hub and event portal",
    language: "TypeScript",
    stars: 2,
    url: "https://github.com/indies-cl/indies.la",
    tags: ["community", "latam", "landing", "typescript"],
  },
  {
    name: "biovity",
    description: "Specialized job search and hiring platform for Chile",
    language: "TypeScript",
    stars: 1,
    url: "https://github.com/diegoleteliers10/biovity",
    tags: ["startup", "fullstack", "chile", "nextjs"],
    highlight: true,
  },
  {
    name: "llegapo",
    description: "Real-time Santiago public transit tracking mobile app",
    language: "TypeScript",
    stars: 0,
    url: "https://github.com/diegoleteliers10/llegapo",
    tags: ["mobile", "react-native", "transit", "chile"],
    highlight: true,
  },
  {
    name: "llegapo-server",
    description: "Robust REST API with 19 endpoints for transit data",
    language: "TypeScript",
    stars: 0,
    url: "https://github.com/diegoleteliers10/llegapo-server",
    tags: ["backend", "rest", "api", "node"],
  },
  {
    name: "open-banking-chile",
    description: "Open source data scrapers for Chilean banking portals",
    language: "TypeScript",
    stars: 0,
    url: "https://github.com/diegoleteliers10/open-banking-chile",
    tags: ["fintech", "open-source", "chile", "scraping"],
    highlight: true,
  },
  {
    name: "devcmd",
    description: "Raycast productivity extension for rapid developer commands",
    language: "TypeScript",
    stars: 0,
    url: "https://github.com/diegoleteliers10/devcmd",
    tags: ["productivity", "raycast", "tools"],
  },
  {
    name: "expenses-cli",
    description: "Lightweight CLI tool for daily personal expense tracking",
    language: "Python",
    stars: 0,
    url: "https://github.com/diegoleteliers10/expenses-cli",
    tags: ["cli", "python", "finance"],
  },
  {
    name: "biovity-server",
    description: "Scalable backend service powering the Biovity platform",
    language: "TypeScript",
    stars: 1,
    url: "https://github.com/diegoleteliers10/biovity-server",
    tags: ["backend", "api", "postgresql"],
  },
  {
    name: "wizarding_wares",
    description: "Full-featured e-commerce platform for fantasy items",
    language: "JavaScript",
    stars: 1,
    url: "https://github.com/diegoleteliers10/wizarding_wares",
    tags: ["ecommerce", "fullstack", "react"],
  },
  {
    name: "hack-latam",
    description: "Official portal and registration for Hack@26 LATAM",
    language: "TypeScript",
    stars: 0,
    url: "https://github.com/indies-cl/hack-latam",
    tags: ["hackathon", "community", "web"],
  },
]

export const SKILLS: Record<string, number> = {
  TypeScript: 92,
  "React / Next.js": 88,
  "Node.js / Bun": 86,
  JavaScript: 85,
  "Git & GitHub": 84,
  "REST & APIs": 82,
  PostgreSQL: 78,
  Docker: 74,
  Python: 68,
  Rust: 62,
  Astro: 65,
}

