"""
TRACE: Ghost Protocol — FastAPI Backend

Server-side flag validation, rate limiting, user progress persistence, and secure scoring.
Answers are stored server-side and never exposed to the frontend.
"""

from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from datetime import datetime, timedelta
from typing import Optional
import sqlite3
import hashlib
import uuid
import json
import os
import time
from contextlib import contextmanager
from collections import defaultdict

# ═══════════════════════════════════════════════
# Configuration
# ═══════════════════════════════════════════════

DB_PATH = os.environ.get("GHOST_DB_PATH", "ghost_protocol.db")
SECRET_KEY = os.environ.get("GHOST_SECRET_KEY", "change-this-in-production-fury-alpha-7")
ADMIN_PASSPHRASE = os.environ.get("GHOST_ADMIN_PASS", "fury-director-alpha")
RATE_LIMIT_WINDOW = 60       # seconds
RATE_LIMIT_MAX_ATTEMPTS = 10 # max submissions per window per user

# ═══════════════════════════════════════════════
# Answer Key (SERVER-SIDE ONLY — never sent to client)
# ═══════════════════════════════════════════════

ANSWER_KEY = {
    "mission-1": "arc-reactor",
    "mission-2": "ghost",
    "mission-3": "gamma",
    "mission-4": "tsushima",
    "mission-5": "wayback",
    "mission-6": "bodie",
    "mission-7": "samara",
    "mission-8": "gamma-bodie",
    "mission-9": "arc-reactor-ghost-gamma-tsushima-wayback-bodie-samara",
}

MISSION_POINTS = {
    "mission-1": 100,
    "mission-2": 150,
    "mission-3": 200,
    "mission-4": 200,
    "mission-5": 250,
    "mission-6": 300,
    "mission-7": 250,
    "mission-8": 350,
    "mission-9": 500,
}

MISSION_PREREQUISITES = {
    "mission-1": [],
    "mission-2": ["mission-1"],
    "mission-3": ["mission-2"],
    "mission-4": ["mission-3"],
    "mission-5": ["mission-4"],
    "mission-6": ["mission-5"],
    "mission-7": ["mission-6"],
    "mission-8": ["mission-7"],
    "mission-9": ["mission-8"],
}

HINT_PENALTIES = {
    "mission-1": [10, 25],
    "mission-2": [10, 25],
    "mission-3": [15, 35],
    "mission-4": [15, 35],
    "mission-5": [15, 35],
    "mission-6": [20, 45],
    "mission-7": [15, 40],
    "mission-8": [20, 50],
    "mission-9": [25, 75],
}

# ═══════════════════════════════════════════════
# Database
# ═══════════════════════════════════════════════

@contextmanager
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init_db():
    with get_db() as conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                username TEXT NOT NULL,
                created_at TEXT NOT NULL,
                last_activity TEXT NOT NULL,
                total_score INTEGER DEFAULT 0,
                total_penalties INTEGER DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS mission_progress (
                user_id TEXT NOT NULL,
                mission_id TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'locked',
                attempts INTEGER DEFAULT 0,
                hints_used TEXT DEFAULT '[]',
                score INTEGER DEFAULT 0,
                completed_at TEXT,
                submitted_answer TEXT,
                PRIMARY KEY (user_id, mission_id),
                FOREIGN KEY (user_id) REFERENCES users(id)
            );

            CREATE TABLE IF NOT EXISTS evidence_locker (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                clue_id TEXT NOT NULL,
                label TEXT NOT NULL,
                description TEXT,
                value TEXT,
                from_mission TEXT,
                discovered_at TEXT NOT NULL,
                notes TEXT DEFAULT '',
                used_in TEXT DEFAULT '[]',
                FOREIGN KEY (user_id) REFERENCES users(id)
            );

            CREATE TABLE IF NOT EXISTS submissions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                mission_id TEXT NOT NULL,
                answer TEXT NOT NULL,
                is_correct INTEGER NOT NULL,
                submitted_at TEXT NOT NULL,
                ip_address TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );

            CREATE TABLE IF NOT EXISTS writeups (
                user_id TEXT PRIMARY KEY,
                content TEXT DEFAULT '',
                updated_at TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        """)


# ═══════════════════════════════════════════════
# Rate Limiting (in-memory for prototype)
# ═══════════════════════════════════════════════

rate_limit_store: dict[str, list[float]] = defaultdict(list)

def check_rate_limit(user_id: str) -> bool:
    now = time.time()
    attempts = rate_limit_store[user_id]
    # Clean old entries
    rate_limit_store[user_id] = [t for t in attempts if now - t < RATE_LIMIT_WINDOW]
    if len(rate_limit_store[user_id]) >= RATE_LIMIT_MAX_ATTEMPTS:
        return False
    rate_limit_store[user_id].append(now)
    return True


# ═══════════════════════════════════════════════
# Pydantic Models
# ═══════════════════════════════════════════════

class RegisterRequest(BaseModel):
    username: str = Field(..., min_length=1, max_length=20)

class RegisterResponse(BaseModel):
    user_id: str
    username: str

class SubmitAnswerRequest(BaseModel):
    user_id: str
    mission_id: str
    answer: str = Field(..., min_length=1, max_length=200)

class SubmitAnswerResponse(BaseModel):
    correct: bool
    message: str
    score: int = 0
    total_score: int = 0
    missions_completed: int = 0
    unlocked_missions: list[str] = []

class UseHintRequest(BaseModel):
    user_id: str
    mission_id: str
    hint_index: int

class ProgressResponse(BaseModel):
    user_id: str
    username: str
    total_score: int
    total_penalties: int
    mission_progress: dict
    evidence_locker: list
    created_at: str

class LeaderboardEntry(BaseModel):
    rank: int
    username: str
    score: int
    missions_completed: int

class WriteupRequest(BaseModel):
    user_id: str
    content: str


# ═══════════════════════════════════════════════
# FastAPI App
# ═══════════════════════════════════════════════

app = FastAPI(
    title="TRACE: Ghost Protocol API",
    description="Server-side API for the OSINT CTF platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    init_db()


# ═══════════════════════════════════════════════
# Routes
# ═══════════════════════════════════════════════

@app.post("/api/register", response_model=RegisterResponse)
def register(req: RegisterRequest):
    user_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()

    with get_db() as conn:
        conn.execute(
            "INSERT INTO users (id, username, created_at, last_activity) VALUES (?, ?, ?, ?)",
            (user_id, req.username, now, now),
        )
        # Initialize mission progress
        for mid in ANSWER_KEY:
            prereqs = MISSION_PREREQUISITES.get(mid, [])
            status = "available" if len(prereqs) == 0 else "locked"
            conn.execute(
                "INSERT INTO mission_progress (user_id, mission_id, status) VALUES (?, ?, ?)",
                (user_id, mid, status),
            )

    return RegisterResponse(user_id=user_id, username=req.username)


@app.post("/api/submit", response_model=SubmitAnswerResponse)
def submit_answer(req: SubmitAnswerRequest, request: Request):
    # Rate limiting
    if not check_rate_limit(req.user_id):
        raise HTTPException(
            status_code=429,
            detail=f"Too many attempts. Wait {RATE_LIMIT_WINDOW} seconds.",
        )

    # Validate mission exists
    if req.mission_id not in ANSWER_KEY:
        raise HTTPException(status_code=400, detail="Invalid mission ID")

    with get_db() as conn:
        # Check user exists
        user = conn.execute("SELECT * FROM users WHERE id = ?", (req.user_id,)).fetchone()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Check mission status
        progress = conn.execute(
            "SELECT * FROM mission_progress WHERE user_id = ? AND mission_id = ?",
            (req.user_id, req.mission_id),
        ).fetchone()

        if not progress:
            raise HTTPException(status_code=400, detail="Mission progress not found")

        if progress["status"] == "locked":
            raise HTTPException(status_code=403, detail="Mission is locked. Complete prerequisites first.")

        if progress["status"] == "completed":
            raise HTTPException(status_code=400, detail="Mission already completed")

        # Check prerequisites
        prereqs = MISSION_PREREQUISITES.get(req.mission_id, [])
        for prereq in prereqs:
            prereq_progress = conn.execute(
                "SELECT status FROM mission_progress WHERE user_id = ? AND mission_id = ?",
                (req.user_id, prereq),
            ).fetchone()
            if not prereq_progress or prereq_progress["status"] != "completed":
                raise HTTPException(status_code=403, detail=f"Prerequisite {prereq} not completed")

        # Validate answer
        correct_answer = ANSWER_KEY[req.mission_id]
        is_correct = req.answer.lower().strip() == correct_answer.lower().strip()

        # Log submission
        client_ip = request.client.host if request.client else "unknown"
        conn.execute(
            "INSERT INTO submissions (user_id, mission_id, answer, is_correct, submitted_at, ip_address) VALUES (?, ?, ?, ?, ?, ?)",
            (req.user_id, req.mission_id, req.answer, int(is_correct), datetime.utcnow().isoformat(), client_ip),
        )

        # Update attempts
        new_attempts = progress["attempts"] + 1
        conn.execute(
            "UPDATE mission_progress SET attempts = ? WHERE user_id = ? AND mission_id = ?",
            (new_attempts, req.user_id, req.mission_id),
        )

        if is_correct:
            # Calculate score with hint penalties
            hints_used = json.loads(progress["hints_used"])
            penalties = HINT_PENALTIES.get(req.mission_id, [])
            hint_penalty = sum(penalties[i] for i in hints_used if i < len(penalties))
            earned_score = max(0, MISSION_POINTS[req.mission_id] - hint_penalty)

            # Update mission progress
            conn.execute(
                """UPDATE mission_progress 
                   SET status = 'completed', score = ?, completed_at = ?, submitted_answer = ?
                   WHERE user_id = ? AND mission_id = ?""",
                (earned_score, datetime.utcnow().isoformat(), req.answer.lower().strip(), req.user_id, req.mission_id),
            )

            # Update user total score
            conn.execute(
                "UPDATE users SET total_score = total_score + ?, last_activity = ? WHERE id = ?",
                (earned_score, datetime.utcnow().isoformat(), req.user_id),
            )

            # Unlock dependent missions
            unlocked = []
            for mid, prereqs in MISSION_PREREQUISITES.items():
                if not prereqs:
                    continue
                mp = conn.execute(
                    "SELECT status FROM mission_progress WHERE user_id = ? AND mission_id = ?",
                    (req.user_id, mid),
                ).fetchone()
                if mp and mp["status"] == "locked":
                    all_met = True
                    for p in prereqs:
                        pp = conn.execute(
                            "SELECT status FROM mission_progress WHERE user_id = ? AND mission_id = ?",
                            (req.user_id, p),
                        ).fetchone()
                        if not pp or pp["status"] != "completed":
                            all_met = False
                            break
                    if all_met:
                        conn.execute(
                            "UPDATE mission_progress SET status = 'available' WHERE user_id = ? AND mission_id = ?",
                            (req.user_id, mid),
                        )
                        unlocked.append(mid)

            # Get updated totals
            updated_user = conn.execute("SELECT total_score FROM users WHERE id = ?", (req.user_id,)).fetchone()
            completed_count = conn.execute(
                "SELECT COUNT(*) as cnt FROM mission_progress WHERE user_id = ? AND status = 'completed'",
                (req.user_id,),
            ).fetchone()["cnt"]

            return SubmitAnswerResponse(
                correct=True,
                message="Flag accepted! Intelligence verified. ✅",
                score=earned_score,
                total_score=updated_user["total_score"],
                missions_completed=completed_count,
                unlocked_missions=unlocked,
            )
        else:
            return SubmitAnswerResponse(
                correct=False,
                message="Incorrect. Re-examine your evidence and try again.",
            )


@app.post("/api/hint")
def use_hint(req: UseHintRequest):
    if req.mission_id not in ANSWER_KEY:
        raise HTTPException(status_code=400, detail="Invalid mission ID")

    penalties = HINT_PENALTIES.get(req.mission_id, [])
    if req.hint_index < 0 or req.hint_index >= len(penalties):
        raise HTTPException(status_code=400, detail="Invalid hint index")

    with get_db() as conn:
        progress = conn.execute(
            "SELECT * FROM mission_progress WHERE user_id = ? AND mission_id = ?",
            (req.user_id, req.mission_id),
        ).fetchone()

        if not progress:
            raise HTTPException(status_code=404, detail="Progress not found")

        hints_used = json.loads(progress["hints_used"])
        if req.hint_index in hints_used:
            return {"message": "Hint already used", "penalty": 0}

        hints_used.append(req.hint_index)
        penalty = penalties[req.hint_index]

        conn.execute(
            "UPDATE mission_progress SET hints_used = ? WHERE user_id = ? AND mission_id = ?",
            (json.dumps(hints_used), req.user_id, req.mission_id),
        )

        conn.execute(
            "UPDATE users SET total_penalties = total_penalties + ? WHERE id = ?",
            (penalty, req.user_id),
        )

    return {"message": f"Hint {req.hint_index + 1} unlocked", "penalty": penalty}


@app.get("/api/progress/{user_id}", response_model=ProgressResponse)
def get_progress(user_id: str):
    with get_db() as conn:
        user = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        missions = conn.execute(
            "SELECT * FROM mission_progress WHERE user_id = ?", (user_id,)
        ).fetchall()

        evidence = conn.execute(
            "SELECT * FROM evidence_locker WHERE user_id = ?", (user_id,)
        ).fetchall()

        mission_progress = {}
        for m in missions:
            mission_progress[m["mission_id"]] = {
                "status": m["status"],
                "attempts": m["attempts"],
                "hintsUsed": json.loads(m["hints_used"]),
                "score": m["score"],
                "completedAt": m["completed_at"],
                "submittedAnswer": m["submitted_answer"],
            }

        evidence_list = [
            {
                "id": e["id"],
                "clueId": e["clue_id"],
                "label": e["label"],
                "description": e["description"],
                "value": e["value"],
                "fromMission": e["from_mission"],
                "discoveredAt": e["discovered_at"],
                "notes": e["notes"],
                "usedIn": json.loads(e["used_in"]),
            }
            for e in evidence
        ]

    return ProgressResponse(
        user_id=user_id,
        username=user["username"],
        total_score=user["total_score"],
        total_penalties=user["total_penalties"],
        mission_progress=mission_progress,
        evidence_locker=evidence_list,
        created_at=user["created_at"],
    )


@app.get("/api/leaderboard")
def get_leaderboard(limit: int = 20):
    with get_db() as conn:
        rows = conn.execute(
            """SELECT u.username, u.total_score,
                      (SELECT COUNT(*) FROM mission_progress mp 
                       WHERE mp.user_id = u.id AND mp.status = 'completed') as missions_completed
               FROM users u
               ORDER BY u.total_score DESC, missions_completed DESC
               LIMIT ?""",
            (limit,),
        ).fetchall()

    return [
        LeaderboardEntry(
            rank=i + 1,
            username=row["username"],
            score=row["total_score"],
            missions_completed=row["missions_completed"],
        )
        for i, row in enumerate(rows)
    ]


@app.post("/api/writeup")
def save_writeup(req: WriteupRequest):
    with get_db() as conn:
        conn.execute(
            """INSERT INTO writeups (user_id, content, updated_at) 
               VALUES (?, ?, ?)
               ON CONFLICT(user_id) DO UPDATE SET content = ?, updated_at = ?""",
            (req.user_id, req.content, datetime.utcnow().isoformat(),
             req.content, datetime.utcnow().isoformat()),
        )
    return {"message": "Write-up saved"}


@app.get("/api/admin/stats")
def admin_stats(passphrase: str):
    if passphrase != ADMIN_PASSPHRASE:
        raise HTTPException(status_code=403, detail="Invalid admin passphrase")

    with get_db() as conn:
        user_count = conn.execute("SELECT COUNT(*) as cnt FROM users").fetchone()["cnt"]
        submission_count = conn.execute("SELECT COUNT(*) as cnt FROM submissions").fetchone()["cnt"]
        correct_submissions = conn.execute(
            "SELECT COUNT(*) as cnt FROM submissions WHERE is_correct = 1"
        ).fetchone()["cnt"]

        mission_stats = {}
        for mid in ANSWER_KEY:
            completed = conn.execute(
                "SELECT COUNT(*) as cnt FROM mission_progress WHERE mission_id = ? AND status = 'completed'",
                (mid,),
            ).fetchone()["cnt"]
            attempts = conn.execute(
                "SELECT COUNT(*) as cnt FROM submissions WHERE mission_id = ?",
                (mid,),
            ).fetchone()["cnt"]
            mission_stats[mid] = {"completed": completed, "attempts": attempts}

    return {
        "total_users": user_count,
        "total_submissions": submission_count,
        "correct_submissions": correct_submissions,
        "mission_stats": mission_stats,
    }


@app.get("/api/health")
def health():
    return {"status": "operational", "service": "TRACE Ghost Protocol API", "version": "1.0.0"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
