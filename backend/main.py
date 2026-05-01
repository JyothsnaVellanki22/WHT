from fastapi import FastAPI, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Dict
import random

from database import get_db, engine, Base
from models import Article

Base.metadata.create_all(bind=engine)


app = FastAPI(title="WHT Intelligence API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

mock_signals = [
    {
        "id": "alphafold-3",
        "title": "ALPHAFOLD 3: PREDICTING THE MOLECULES OF LIFE",
        "signal_level": "CRITICAL",
        "impact": "Biotech & Computational Biology",
        "action": "Understand graph neural networks and protein structure modeling.",
        "what_happened": "Google DeepMind released AlphaFold 3, capable of predicting the structure and interactions of all life's molecules (DNA, RNA, ligands) with unprecedented accuracy.",
        "why_it_matters": "It fundamentally accelerates drug discovery and molecular biology research, reducing years of lab work to hours of computation.",
        "hidden_signal": "AI is moving beyond text and images to directly manipulating and predicting physical and biological reality.",
        "influencer_hype": "AI will cure all diseases tomorrow!"
    },
    {
        "id": "openai-o1",
        "title": "OPENAI O1: REASONING AND CHAIN-OF-THOUGHT",
        "signal_level": "HIGH",
        "impact": "AI Research & Software Engineering",
        "action": "Shift focus from basic prompting to complex problem decomposition.",
        "what_happened": "OpenAI introduced the o1 model series, which uses reinforcement learning to 'think' before it answers, producing internal chain-of-thought.",
        "why_it_matters": "This model breaks the plateau of standard autoregressive LLMs by excelling at math, coding, and logical reasoning benchmarks.",
        "hidden_signal": "The focus of AI scaling is shifting from purely 'more data' (pre-training) to 'more compute during inference' (test-time compute).",
        "influencer_hype": "AGI is officially here, software engineers are obsolete!"
    },
    {
        "id": "neuralink-telepathy",
        "title": "NEURALINK BCI: HUMAN-COMPUTER SYMBIOSIS",
        "signal_level": "HIGH",
        "impact": "Neurotech & Accessibility",
        "action": "Monitor Brain-Computer Interface (BCI) APIs and signal processing tech.",
        "what_happened": "Neuralink successfully implanted its 'Telepathy' device in human patients, allowing them to control computers using only their thoughts.",
        "why_it_matters": "It demonstrates the viability of high-bandwidth, invasive neural interfaces for restoring autonomy to individuals with paralysis.",
        "hidden_signal": "The ultimate UI constraint is physical input. BCI could eventually replace keyboards and mice entirely.",
        "influencer_hype": "We're all going to be cyborgs connected to the matrix in 5 years."
    },
    {
        "id": "solid-state-batteries",
        "title": "SOLID-STATE BATTERY BREAKTHROUGHS",
        "signal_level": "MEDIUM",
        "impact": "EVs & Hardware",
        "action": "Track material science advancements and EV infrastructure.",
        "what_happened": "Companies like QuantumScape and Toyota are moving solid-state batteries from the lab into pre-production testing phases.",
        "why_it_matters": "These batteries offer higher energy density, faster charging times, and lower fire risks compared to traditional lithium-ion batteries.",
        "hidden_signal": "The EV and mobile tech revolution is currently bottlenecked by energy storage physics. Solving this unlocks the next tier of electrification.",
        "influencer_hype": "Lithium is dead, charge your car in 2 minutes!"
    }
]

@app.get("/api/signals")
def get_signals():
    return mock_signals

@app.get("/api/signals/{signal_id}")
def get_signal(signal_id: str):
    return next((s for s in mock_signals if s["id"] == signal_id), None)

@app.get("/api/career-path")
def get_career_path(role: str = "backend"):
    return {
        "role": role,
        "readiness": 63,
        "gaps": [
            {"skill": "System Design", "priority": "High"},
            {"skill": "Kafka & Event-Driven", "priority": "Medium"}
        ],
        "suggested_plan": [
            {"week": "Week 1", "task": "Master Async Systems"},
            {"week": "Week 2", "task": "Kafka Basics & Pub/Sub"}
        ]
    }

@app.post("/api/resume/analyze")
def analyze_resume():
    # Mocking ATS analysis
    return {
        "score": random.randint(45, 85),
        "missing_keywords": ["Kubernetes", "Microservices", "Agentic AI"],
        "weak_bullets": ["Led a team of 3", "Worked on bug fixes"],
        "advice": "Quantify your impact using the XYZ formula. Focus on orchestration skills."
    }

@app.get("/api/market/trends")
def get_market_trends():
    return {
        "rising_skills": ["LangGraph", "CUDA", "Vector DBs"],
        "dying_skills": ["Basic React", "Standard REST APIs"],
        "salary_trend": "+15% for AI integration roles"
    }

@app.get("/api/articles")
def get_articles(db: Session = Depends(get_db)):
    return db.query(Article).order_by(Article.published_at.desc()).all()

@app.get("/api/articles/{slug}")
def get_article(slug: str, db: Session = Depends(get_db)):
    article = db.query(Article).filter(Article.slug == slug).first()
    return article

@app.get("/api/agentic-ai")
def get_agentic_ai_articles(page: int = 1, limit: int = 10, db: Session = Depends(get_db)):
    skip = (page - 1) * limit
    return db.query(Article)\
        .filter(Article.category == "AGENTIC_AI")\
        .order_by(Article.published_at.desc())\
        .offset(skip).limit(limit)\
        .all()

@app.get("/api/trends")
def get_tech_trends(page: int = 1, limit: int = 10, db: Session = Depends(get_db)):
    skip = (page - 1) * limit
    return db.query(Article)\
        .filter(Article.category == "TECH_TRENDS")\
        .order_by(Article.published_at.desc())\
        .offset(skip).limit(limit)\
        .all()
