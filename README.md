# dlsdev - Diego Letelier Terminal Portfolio

`dlsdev` is an interactive Terminal User Interface (TUI) portfolio for Diego Letelier. It runs in your terminal using Bun, OpenTUI, and React.

## Overview

Diego Letelier is a Full-Stack Engineer and Computer Science student based in Santiago, Chile. This application lets developers and recruiters explore projects, background, technical skills, live GitHub metrics, and developer tools directly from the terminal.

## Quick Start

You can run this portfolio directly without a manual clone:

```bash
bunx dlsdev
```

Or run with npx if you have Bun installed on your system:

```bash
npx dlsdev
```

## Local Installation

To run or modify the project locally, follow these steps:

1. Clone the repository:
```bash
git clone https://github.com/diegoleteliers10/dldev-tui.git
```

2. Enter the project directory:
```bash
cd dldev-tui
```

3. Install dependencies:
```bash
bun install
```

4. Start the development mode:
```bash
bun run dev
```

5. Build the production bundle:
```bash
bun run build
```

## Features

- **Responsive Layout**: The user interface adapts dynamically to small, medium, and large terminal sizes.
- **Theme Engine**: Includes 7 custom color palettes (One Dark, Dracula, Catppuccin, Gruvbox, Nord, Tokyo Night, Cyberpunk).
- **Interactive Projects Browser**: Browse open source projects, filter by language or tag, and open links in your browser.
- **Live GitHub Metrics**: Fetches real-time repository count, star totals, language distributions, and recent commit events.
- **Contribution Heatmap**: Displays an adaptive annual contribution graph with streak statistics.
- **Focus Timer**: Includes a Pomodoro productivity timer with custom session tracking.
- **System Diagnostics**: Shows real-time CPU, memory, platform, load average, and runtime diagnostics.
- **Developer Trivia**: Test your computer science knowledge with an interactive quiz.

## Screen Guide

| Key | Screen | Description |
| :--- | :--- | :--- |
| `1` | **Home** | Profile summary, current status, core stack, and highlighted projects. |
| `2` | **Projects** | Interactive project directory with tag filters and direct browser links. |
| `3` | **About** | Professional background, education at UDD, SoyHenry training, and skills meters. |
| `4` | **Contact** | Direct channels for GitHub, LinkedIn, email, and personal website. |
| `5` | **Stats** | Live GitHub profile metrics, top languages, and event activity. |
| `6` | **Heatmap** | Annual contribution graph with streaks and activity counts. |
| `7` | **Now** | Current focus areas, active builds, and learning roadmap. |
| `8` | **Uses** | Development hardware, editor setup, terminal configuration, and toolchain. |
| `9` | **Pomodoro** | Deep work focus timer with work and break intervals. |
| `0` | **System** | Host hardware resources, operating system stats, and runtime memory. |

## Controls and Keybindings

| Key | Action |
| :--- | :--- |
| `[1]` - `[0]` | Switch directly to a numbered screen. |
| `[Tab]` | Cycle to the next screen. |
| `[T]` | Cycle color themes. |
| `[Enter]` | Open highlighted URL or start active timer. |
| `[↑]` / `[↓]` or `[J]` / `[K]` | Navigate lists, items, or quiz options. |
| `[←]` / `[→]` or `[H]` / `[L]` | Switch filters in the projects screen. |
| `[G]` | Start the Developer Trivia Quiz from the welcome screen. |
| `[Q]` | Return to the welcome screen. |
| `[Esc]` | Exit the application. |

## About Diego Letelier

- **Role**: Full-Stack Developer and Software Engineer.
- **Education**: Computer Science Student at Universidad del Desarrollo (UDD), Santiago, Chile.
- **Bootcamp**: SoyHenry Full Stack Developer Graduate.
- **Core Languages**: TypeScript, Rust, JavaScript, Python, Go, SQL.
- **Frameworks and Tools**: React, Next.js, Node.js, Bun, Express, NestJS, Docker, PostgreSQL, Astro.
- **Selected Works**:
  - `fasty`: High-performance CLI for rapid file operations written in Rust.
  - `indies.cl` and `indies.la`: Tech community platform for creators and developers in LATAM.
  - `llegapo` and `llegapo-server`: Real-time public transit tracking app and REST API for Santiago.
  - `open-banking-chile`: Open-source financial data scrapers for Chilean banking portals.
  - `biovity`: Job search and recruitment platform for Chile.

## Contact

- **Website**: [diegoletelierdev.vercel.app](https://diegoletelierdev.vercel.app/)
- **GitHub**: [@diegoleteliers10](https://github.com/diegoleteliers10)
- **LinkedIn**: [linkedin.com/in/diegoletelier](https://linkedin.com/in/diegoletelier)
- **Email**: `diegoleteliers10@gmail.com`

## License

MIT License. Copyright (c) 2026 Diego Letelier.

