from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

# Load environment variables from backend/.env or root .env
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))
load_dotenv(os.path.join(os.path.dirname(BASE_DIR), ".env"))

# Determine database URL: Supabase PostgreSQL (Production / Cloud) or SQLite (Local fallback)
raw_db_url = (
    os.getenv("DATABASE_URL")
    or os.getenv("POSTGRES_URL_NON_POOLING")
    or os.getenv("POSTGRES_URL")
    or os.getenv("POSTGRES_PRISMA_URL")
)

if raw_db_url:
    # Normalize protocol for SQLAlchemy / psycopg2
    db_url = raw_db_url
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)
    
    # Supabase / PostgreSQL Engine with connection health checking
    engine = create_engine(
        db_url,
        pool_pre_ping=True,
        pool_recycle=300,
        pool_size=10,
        max_overflow=20
    )
    print("[DATABASE] Connected to Supabase PostgreSQL.")
else:
    DB_PATH = os.path.join(BASE_DIR, "wht.db")
    SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
    print(f"[DATABASE] Connected to local SQLite database at {DB_PATH}")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

