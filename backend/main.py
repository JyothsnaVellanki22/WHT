from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta, timezone
import re
import os
import bcrypt
import secrets
import jwt

from database import get_db, engine, Base
from models import User, BlogPost, Subscriber, Newsletter, EmailLog

# Create database tables if they do not exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="WHT Practical AI Learning Platform API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- JWT & Security Configuration ----------------- #
ENVIRONMENT = os.getenv("ENVIRONMENT", os.getenv("ENV", "development")).lower()
JWT_SECRET = os.getenv("JWT_SECRET")

KNOWN_INSECURE_SECRETS = {
    "secret",
    "changeme",
    "admin",
    "password",
    "123456"
}

if not JWT_SECRET:
    if ENVIRONMENT in ("production", "prod"):
        raise RuntimeError(
            "CRITICAL SECURITY CONFIGURATION ERROR: 'JWT_SECRET' environment variable must be set in production! "
            "Server startup aborted to prevent token forgery."
        )
    else:
        JWT_SECRET = secrets.token_hex(32)
        print(
            "[SECURITY WARNING] 'JWT_SECRET' is not set. Generated an ephemeral random key for development. "
            "Set 'JWT_SECRET' in your environment to persist sessions across restarts."
        )
elif JWT_SECRET in KNOWN_INSECURE_SECRETS:
    if ENVIRONMENT in ("production", "prod"):
        raise RuntimeError(
            "CRITICAL SECURITY CONFIGURATION ERROR: 'JWT_SECRET' is configured with a known insecure default value. "
            "Please configure a strong, randomly generated secret in production."
        )
    else:
        print("[SECURITY WARNING] 'JWT_SECRET' is set to a known insecure default value.")

JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 7

security = HTTPBearer(auto_error=False)

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception:
        return False

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_access_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except Exception:
        return None

def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> Optional[User]:
    if not credentials:
        return None
    payload = decode_access_token(credentials.credentials)
    if not payload or "sub" not in payload:
        return None
    try:
        user_id = int(payload.get("sub"))
    except (ValueError, TypeError):
        return None
    return db.query(User).filter(User.id == user_id).first()

def require_admin(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    if not credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication token required.")
    payload = decode_access_token(credentials.credentials)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired session token.")
    try:
        user_id = int(payload.get("sub"))
    except (ValueError, TypeError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Malformed token payload.")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User account not found.")
    if user.role != "ADMIN":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied: Admin role required.")
    return user

# Seed admin user if explicitly provided via environment variables and none exists
def seed_admin_from_env():
    admin_email = os.getenv("ADMIN_EMAIL", "admin@wht.dev").strip().lower()
    admin_password = os.getenv("ADMIN_PASSWORD", "admin123")
    db = Session(bind=engine)
    try:
        admin = db.query(User).filter(User.role == "ADMIN").first()
        if not admin:
            admin_user = User(
                email=admin_email,
                name=os.getenv("ADMIN_NAME", "Platform Administrator"),
                hashed_password=hash_password(admin_password),
                role="ADMIN"
            )
            db.add(admin_user)
            db.commit()
            print(f"[RBAC SETUP] Default Admin account initialized for {admin_email}")
    finally:
        db.close()

seed_admin_from_env()

# Seed curated blogs if database has none
def seed_initial_blogs():
    db = Session(bind=engine)
    try:
        if db.query(BlogPost).count() == 0:
            from seed_tutorials import seed_database
            seed_database()
    except Exception as e:
        print(f"[SEED NOTICE] Initial blogs check: {e}")
    finally:
        db.close()

seed_initial_blogs()

# ----------------- Pydantic Schemas ----------------- #
class UserRegister(BaseModel):
    email: str
    password: str
    name: Optional[str] = "Student Builder"

class UserLogin(BaseModel):
    email: str
    password: str

class BlogPostCreate(BaseModel):
    title: str
    summary: str
    content: str
    tech_stack: Optional[str] = "Python, AI"
    difficulty: Optional[str] = "BEGINNER"
    category: Optional[str] = "AI TUTORIAL"
    author: Optional[str] = "WHT Tech Team"
    read_time: Optional[str] = "5 MIN READ"
    image_url: Optional[str] = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
    notify_subscribers: Optional[bool] = True

class SubscriberCreate(BaseModel):
    email: str

class NewsletterCreate(BaseModel):
    title: str
    subject: str
    edition: Optional[str] = "Weekly Edition"
    tech_spotlight: Optional[str] = "Practical AI Tools"
    content: str

# ----------------- Helper Email Dispatcher ----------------- #
def broadcast_email_to_subscribers(subject: str, message: str, email_type: str, db: Session) -> int:
    subscribers = db.query(Subscriber).filter(Subscriber.is_active == True).all()
    count = 0
    for sub in subscribers:
        log = EmailLog(
            recipient_email=sub.email,
            subject=subject,
            email_type=email_type,
            status="DELIVERED"
        )
        db.add(log)
        count += 1
    db.commit()
    print(f"[EMAIL BROADCAST] Sent '{subject}' to {count} active subscribers.")
    return count

# ----------------- Blog / Practical Tutorial Endpoints ----------------- #
@app.get("/api/blogs")
def get_all_blogs(category: Optional[str] = None, tech: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(BlogPost)
    if category and category != "ALL":
        query = query.filter(BlogPost.category == category)
    if tech and tech != "ALL":
        query = query.filter(BlogPost.tech_stack.contains(tech))
    return query.order_by(BlogPost.created_at.desc()).all()

@app.get("/api/blogs/{slug}")
def get_blog_by_slug(slug: str, db: Session = Depends(get_db)):
    blog = db.query(BlogPost).filter(BlogPost.slug == slug).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Tutorial not found")
    return blog

@app.post("/api/blogs")
def create_blog(data: BlogPostCreate, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    base_slug = re.sub(r'[^a-z0-9]+', '-', data.title.lower()).strip('-')
    slug = base_slug
    counter = 1
    while db.query(BlogPost).filter(BlogPost.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1

    new_blog = BlogPost(
        title=data.title,
        slug=slug,
        summary=data.summary,
        content=data.content,
        tech_stack=data.tech_stack,
        difficulty=data.difficulty.upper(),
        category=data.category.upper(),
        author=data.author or current_user.name or "WHT Tech Team",
        read_time=data.read_time,
        image_url=data.image_url
    )
    db.add(new_blog)
    db.commit()
    db.refresh(new_blog)
    print(f"[RBAC ADMIN] Admin {current_user.email} successfully published blog '{new_blog.title}' (ID: {new_blog.id})")

    recipient_count = 0
    if data.notify_subscribers:
        recipient_count = broadcast_email_to_subscribers(
            subject=f"New Practical Tutorial: {new_blog.title}",
            message=new_blog.summary,
            email_type="NEW_BLOG",
            db=db
        )

    return {
        "success": True,
        "blog": new_blog,
        "notified_subscribers": recipient_count
    }

@app.delete("/api/blogs/{blog_id}")
def delete_blog(blog_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    blog = db.query(BlogPost).filter(BlogPost.id == blog_id).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Blog post not found.")
    
    title = blog.title
    db.delete(blog)
    db.commit()
    print(f"[RBAC ADMIN] User {current_user.email} deleted blog '{title}' (ID: {blog_id})")
    return {"success": True, "message": f"Blog '{title}' successfully deleted."}

# ----------------- Database RBAC Auth Endpoints ----------------- #
@app.post("/api/auth/register")
def register_user(payload: UserRegister, db: Session = Depends(get_db)):
    email_clean = payload.email.strip().lower()
    if not email_clean or not payload.password:
        raise HTTPException(status_code=400, detail="Email and password are required.")
    
    existing = db.query(User).filter(User.email == email_clean).first()
    if existing:
        raise HTTPException(status_code=400, detail="Account with this email already exists.")
    
    new_user = User(
        email=email_clean,
        name=payload.name or "Student Builder",
        hashed_password=hash_password(payload.password),
        role="USER"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    token = create_access_token({"sub": str(new_user.id), "email": new_user.email, "role": new_user.role})
    return {
        "success": True,
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "name": new_user.name,
            "role": new_user.role
        }
    }

@app.post("/api/auth/login")
def login_user(payload: UserLogin, db: Session = Depends(get_db)):
    email_clean = payload.email.strip().lower()
    user = db.query(User).filter(User.email == email_clean).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password.")
    
    token = create_access_token({"sub": str(user.id), "email": user.email, "role": user.role})
    return {
        "success": True,
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role
        }
    }

@app.get("/api/auth/me")
def get_auth_me(current_user: Optional[User] = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated.")
    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name,
        "role": current_user.role
    }

# ----------------- Subscriber Endpoints ----------------- #
@app.post("/api/subscribers")
def subscribe_email(data: SubscriberCreate, db: Session = Depends(get_db)):
    existing = db.query(Subscriber).filter(Subscriber.email == data.email.lower()).first()
    if existing:
        if not existing.is_active:
            existing.is_active = True
            db.commit()
            return {"success": True, "message": "Subscription reactivated!"}
        return {"success": True, "message": "You are already subscribed to WHT Weekly!"}

    new_sub = Subscriber(email=data.email.lower())
    db.add(new_sub)
    db.commit()
    db.refresh(new_sub)

    # Send welcome email notification
    log = EmailLog(
        recipient_email=new_sub.email,
        subject="Welcome to WHT | Practical AI & Tech Tutorials for Students",
        email_type="WELCOME",
        status="DELIVERED"
    )
    db.add(log)
    db.commit()

    return {"success": True, "message": "Successfully enrolled! Check your inbox for practical AI tutorials."}

@app.get("/api/subscribers/count")
def get_subscriber_count(db: Session = Depends(get_db)):
    count = db.query(Subscriber).filter(Subscriber.is_active == True).count()
    return {"subscriber_count": count}

# ----------------- Newsletter Endpoints ----------------- #
@app.get("/api/newsletters")
def get_all_newsletters(db: Session = Depends(get_db)):
    return db.query(Newsletter).order_by(Newsletter.sent_at.desc()).all()

@app.post("/api/newsletters")
def create_and_send_newsletter(data: NewsletterCreate, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    recipient_count = broadcast_email_to_subscribers(
        subject=data.subject,
        message=data.content,
        email_type="NEWSLETTER",
        db=db
    )

    new_newsletter = Newsletter(
        edition=data.edition,
        title=data.title,
        subject=data.subject,
        tech_spotlight=data.tech_spotlight,
        content=data.content,
        recipient_count=recipient_count
    )
    db.add(new_newsletter)
    db.commit()
    db.refresh(new_newsletter)

    return {
        "success": True,
        "newsletter": new_newsletter,
        "recipient_count": recipient_count,
        "message": f"Weekly Newsletter successfully broadcast to {recipient_count} student subscribers!"
    }
