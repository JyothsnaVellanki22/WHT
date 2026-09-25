from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

# Load environment variables from backend/.env or root .env
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))
load_dotenv(os.path.join(os.path.dirname(BASE_DIR), ".env"))

from urllib.parse import urlparse, parse_qs, urlencode, urlunparse

def sanitize_postgres_url(raw_url: str) -> str:
    """Strip Prisma/JS-specific parameters like supa= or pgbouncer= that break psycopg2."""
    if raw_url.startswith("postgres://"):
        raw_url = raw_url.replace("postgres://", "postgresql://", 1)
    try:
        parsed = urlparse(raw_url)
        if not parsed.query:
            return raw_url
        VALID_PARAMS = {"sslmode", "connect_timeout", "application_name", "sslcert", "sslkey", "sslrootcert"}
        query_params = parse_qs(parsed.query)
        clean_params = {k: v for k, v in query_params.items() if k.lower() in VALID_PARAMS}
        if "sslmode" not in clean_params:
            clean_params["sslmode"] = ["require"]
        clean_query = urlencode(clean_params, doseq=True)
        return urlunparse(parsed._replace(query=clean_query))
    except Exception:
        return raw_url

# Determine database URL: Supabase PostgreSQL (Production / Cloud) or SQLite (Local fallback)
raw_db_url = (
    os.getenv("DATABASE_URL")
    or os.getenv("POSTGRES_URL_NON_POOLING")
    or os.getenv("POSTGRES_URL")
    or os.getenv("POSTGRES_PRISMA_URL")
    or os.getenv("SUPABASE_DATABASE_URL")
)

from sqlalchemy.pool import NullPool

is_serverless = bool(os.getenv("VERCEL") or os.getenv("AWS_LAMBDA_FUNCTION_NAME") or os.getenv("VERCEL_ENV"))

if raw_db_url:
    db_url = sanitize_postgres_url(raw_db_url)
    if is_serverless:
        engine = create_engine(
            db_url,
            poolclass=NullPool
        )
        print("[DATABASE] Connected to Supabase PostgreSQL (Serverless NullPool).")
    else:
        engine = create_engine(
            db_url,
            pool_pre_ping=True,
            pool_recycle=300,
            pool_size=5,
            max_overflow=10
        )
        print("[DATABASE] Connected to Supabase PostgreSQL.")
else:
    DB_PATH = "/tmp/wht.db" if is_serverless else os.path.join(BASE_DIR, "wht.db")
    SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
    print(f"[DATABASE] Connected to SQLite database at {DB_PATH}")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

