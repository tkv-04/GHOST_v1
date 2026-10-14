# TRACE: Ghost Protocol

> *"The truth was never deleted. You just stopped looking."*

**A Story-Driven OSINT Capture The Flag Platform**

TRACE: Ghost Protocol is an Avengers-inspired cybersecurity assignment where players investigate digital breadcrumbs across the public internet using real Open Source Intelligence (OSINT) techniques.

⚠️ **Disclaimer:** This is a fan-made educational project. It is not affiliated with or endorsed by Marvel Entertainment.

---

## 🎯 Overview

Players are recruited as junior intelligence analysts to investigate a trail of clues left by an unknown operator called **GHOST**. Six Avengers serve as fictional mission handlers across seven interconnected missions.

### Key Features

- **7 interconnected missions** with unique story briefings and real OSINT research
- **Real Google searches** that open actual search queries
- **Mission prerequisites** and unlockable progression
- **Evidence locker** for saving discovered clues, URLs, and analyst notes
- **Connection map** visualizing evidence flow between missions
- **Progressive hints** with score penalties
- **Final meta-challenge** combining all discoveries
- **Server-side flag validation** (FastAPI backend)
- **Admin panel** for challenge management
- **Field manual** with ethical OSINT practices

---

## 🚀 Quick Start

### Frontend Only (Prototype)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open **http://localhost:5173** in your browser.

### Full Stack (Frontend + Backend)

```bash
# Start frontend
npm run dev

# In a separate terminal, install Python dependencies
cd backend
pip install -r requirements.txt

# Start backend
python main.py
```

- Frontend: **http://localhost:5173**
- Backend API: **http://localhost:8000**
- API Docs: **http://localhost:8000/docs**

### Docker

```bash
docker-compose up --build
```

---

## 📁 Project Structure

```
GHOST_v1/
├── src/                          # React Frontend
│   ├── components/
│   │   └── Navbar.jsx            # Navigation bar
│   ├── context/
│   │   └── GameContext.jsx       # Game state management
│   ├── data/
│   │   └── missions.js           # Campaign data & answer key
│   ├── pages/
│   │   ├── LandingPage.jsx       # Cinematic briefing & recruitment
│   │   ├── MissionBoard.jsx      # All 7 missions grid
│   │   ├── MissionDetail.jsx     # Mission briefing, search, submit
│   │   ├── EvidenceLocker.jsx    # Saved clues & analyst notes
│   │   ├── ConnectionMap.jsx     # SVG evidence flow graph
│   │   ├── Leaderboard.jsx       # Score rankings & write-ups
│   │   ├── FieldManual.jsx       # Rules & OSINT guide
│   │   └── AdminPanel.jsx        # Challenge management
│   ├── App.jsx                   # Routing
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Design system & theme
├── backend/
│   ├── main.py                   # FastAPI server
│   └── requirements.txt          # Python dependencies
├── docker-compose.yml
├── Dockerfile.frontend
├── Dockerfile.backend
├── index.html
├── vite.config.js
└── package.json
```

---

## 🕵️ Campaign: Mission Chain

| # | Mission | Handler | Difficulty | Points | Dependencies |
|---|---------|---------|-----------|--------|-------------|
| 1 | Stark's Breadcrumb | Tony Stark | Easy | 100 | None |
| 2 | Romanoff's Contact | Natasha Romanoff | Easy | 150 | None |
| 3 | Banner's Anomaly | Bruce Banner | Medium | 200 | None |
| 4 | The Winter Archive | Steve Rogers | Medium | 250 | M1 |
| 5 | Hawkeye's Long Shot | Clint Barton | Hard | 300 | M2 |
| 6 | Strange Connections | Doctor Strange | Hard | 350 | M3, M5 |
| 7 | The Ghost Protocol | Nick Fury | Expert | 500 | M4, M6 |

**Total Possible Score: 1,850 points**

### Evidence Flow

```
M1 (Codename) ──────→ M4 (Archive) ──────→ M7 (Final)
M2 (Alias) ──────────→ M5 (Location) ───→ M6 (Operation) → M7
M3 (Keyword) ────────→ M6 (Operation) ──→ M7
```

---

## 🔑 Answer Key (Challenge Author Only)

<details>
<summary>⚠️ SPOILER — Click to reveal answers</summary>

| Mission | Answer | Source |
|---------|--------|-------|
| M1: Stark's Breadcrumb | `arc-reactor` | GitHub repository search |
| M2: Romanoff's Contact | `ghost` | GitHub @ghost account |
| M3: Banner's Anomaly | `gamma` | Image EXIF metadata |
| M4: The Winter Archive | `wayback` | Wayback Machine (web.archive.org) |
| M5: Hawkeye's Long Shot | `bodie` | Bodie, CA ghost town (National Historic Landmark) |
| M6: Strange Connections | `gamma-bodie` | Cross-reference M3 keyword + M5 location |
| M7: The Ghost Protocol | `arc-reactor-ghost-gamma-bodie-wayback` | All evidence combined |

**Admin Panel Passphrase:** `fury-director-alpha`

</details>

---

## 🛠 Technical Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, Tailwind CSS 4 |
| Backend | Python 3.13, FastAPI, SQLite |
| State | React Context + localStorage |
| Styling | Custom design system (navy/amber/red theme) |
| Deployment | Docker Compose |

---

## 🎨 Design System

- **Background:** Navy (#0a0e1a) and Black (#060a14)
- **Accents:** Amber (#f59e0b) for primary, Red (#ef4444) for alerts
- **Typography:** JetBrains Mono (monospace), Inter (sans-serif)
- **Effects:** Glass morphism, scanline overlay, pulse glow animations
- **Layout:** Responsive grid, mobile-first

---

## 📋 Prototype Limitations

The current version is a frontend-first prototype with these limitations:

1. **Client-side validation** — Answers are validated in the browser (production uses server-side API)
2. **Local storage** — Progress is stored in localStorage (production uses SQLite/PostgreSQL)
3. **Mock leaderboard** — Leaderboard shows mock data (production connects to the API)
4. **No real image asset** — Mission 3 describes an EXIF challenge but doesn't include the actual image file
5. **No rate limiting** — Client-side has no submission throttling

All limitations are resolved by connecting to the FastAPI backend.

---

## 🧪 Testing the Answer Chain

To verify the complete clue chain works:

1. Start M1 → submit `arc-reactor` → unlocks M4
2. Start M2 → submit `ghost` → unlocks M5
3. Start M3 → submit `gamma` → available for M6
4. Start M4 → submit `wayback` → available for M7
5. Start M5 → submit `bodie` → unlocks M6
6. Start M6 → submit `gamma-bodie` → unlocks M7
7. Start M7 → submit `arc-reactor-ghost-gamma-bodie-wayback` → Campaign complete!

---

## ⚖️ Ethical Guidelines

- All challenges use **public, authorized sources**
- **No private information** exposure, leaked credentials, or unauthorized access
- **Fictional identities** used throughout
- Players must **cite evidence** and explain their sources
- Built for **educational purposes** only

---

## 📜 License

Educational project. Not for commercial use. Avengers characters are property of Marvel Entertainment / Disney.
