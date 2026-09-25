from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from datetime import datetime, timedelta, timezone
import re
import os
import bcrypt
import secrets
import jwt
import uuid
from dotenv import load_dotenv

# Load local environment variables if present
load_dotenv()

from database import get_db, engine, Base
from models import User, BlogPost, Subscriber, Newsletter, EmailLog

# Create database tables if they do not exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="WHT Practical AI Learning Platform API")

# Mount uploads directory for images and media
UPLOAD_DIR = os.getenv(
    "UPLOAD_DIR",
    "/tmp/uploads" if os.getenv("VERCEL") else os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
)
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


# ----------------- Environment & CORS Hardening ----------------- #
ENVIRONMENT = os.getenv("ENVIRONMENT", os.getenv("ENV", "development")).lower()

ALLOWED_ORIGINS_ENV = os.getenv("ALLOWED_ORIGINS")
allowed_origins_list = [
    origin.strip() for origin in ALLOWED_ORIGINS_ENV.split(",") if origin.strip()
] if ALLOWED_ORIGINS_ENV else [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://wht.dev",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins_list,
    allow_origin_regex=os.getenv("CORS_ORIGIN_REGEX", r"https?://(localhost|127\.0\.0\.1)(:\d+)?|https://.*\.vercel\.app"),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- JWT & Security Configuration ----------------- #
JWT_SECRET = os.getenv("JWT_SECRET")

KNOWN_INSECURE_SECRETS = {
    "secret",
    "changeme",
    "admin",
    "password",
    "123456"
}

if not JWT_SECRET:
    JWT_SECRET = secrets.token_hex(32)
    print(
        "[SECURITY NOTICE] 'JWT_SECRET' environment variable is not explicitly set. "
        "Generated an ephemeral 256-bit key. Set 'JWT_SECRET' in Vercel to persist sessions."
    )
elif JWT_SECRET in KNOWN_INSECURE_SECRETS:
    print("[SECURITY WARNING] 'JWT_SECRET' is set to a known default value. Please configure a custom secret.")


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
    admin_email = os.getenv("ADMIN_EMAIL")
    admin_password = os.getenv("ADMIN_PASSWORD")
    if not admin_email or not admin_password:
        # Do not seed unless explicitly configured in deployment environment
        return
    
    admin_email = admin_email.strip().lower()
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
            print(f"[RBAC SETUP] Admin account initialized for {admin_email}")
        else:
            if not verify_password(admin_password, admin.hashed_password) or admin.email != admin_email:
                admin.hashed_password = hash_password(admin_password)
                admin.email = admin_email
                db.commit()
                print(f"[RBAC SETUP] Admin credentials synchronized from environment for {admin_email}")
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

# ----------------- Pydantic Schemas & Input Validation ----------------- #
EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")

class UserRegister(BaseModel):
    email: str = Field(..., max_length=254)
    password: str = Field(..., min_length=6, max_length=128)
    name: Optional[str] = Field("Student Builder", max_length=100)

    @field_validator("email")
    @classmethod
    def validate_email_format(cls, v: str) -> str:
        clean = v.strip().lower()
        if not clean or not EMAIL_REGEX.match(clean):
            raise ValueError("Invalid email address format.")
        return clean

class UserLogin(BaseModel):
    email: str = Field(..., max_length=254)
    password: str = Field(..., max_length=128)

    @field_validator("email")
    @classmethod
    def validate_email_format(cls, v: str) -> str:
        clean = v.strip().lower()
        if not clean or not EMAIL_REGEX.match(clean):
            raise ValueError("Invalid email address format.")
        return clean

class BlogPostCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=250)
    summary: str = Field(..., min_length=10, max_length=1000)
    content: str = Field(..., min_length=20)
    tech_stack: Optional[str] = Field("Python, AI", max_length=200)
    difficulty: Optional[str] = Field("BEGINNER", max_length=50)
    category: Optional[str] = Field("AI TUTORIAL", max_length=100)
    author: Optional[str] = Field("WHT Tech Team", max_length=100)
    read_time: Optional[str] = Field("5 MIN READ", max_length=50)
    image_url: Optional[str] = Field(None, max_length=1000)
    linkedin_url: Optional[str] = Field(None, max_length=1000)
    notify_subscribers: Optional[bool] = True

class SubscriberCreate(BaseModel):
    email: str = Field(..., max_length=254)

    @field_validator("email")
    @classmethod
    def validate_email_format(cls, v: str) -> str:
        clean = v.strip().lower()
        if not clean or not EMAIL_REGEX.match(clean):
            raise ValueError("Invalid email address format. Please provide a valid email.")
        return clean

class NewsletterCreate(BaseModel):
    title: str
    subject: str
    edition: Optional[str] = "Weekly Edition"
    tech_spotlight: Optional[str] = "Practical AI Tools"
    content: str
    linkedin_url: Optional[str] = None

class NewsletterUpdate(BaseModel):
    title: Optional[str] = None
    subject: Optional[str] = None
    edition: Optional[str] = None
    tech_spotlight: Optional[str] = None
    content: Optional[str] = None
    linkedin_url: Optional[str] = None

# ----------------- Helper Email Dispatcher ----------------- #
def broadcast_email_to_subscribers(subject: str, message: str, email_type: str, db: Session, newsletter_id: Optional[int] = None) -> int:
    subscribers = db.query(Subscriber).filter(Subscriber.is_active == True).all()
    count = 0
    for sub in subscribers:
        token = uuid.uuid4().hex
        log = EmailLog(
            recipient_email=sub.email,
            subject=subject,
            email_type=email_type,
            newsletter_id=newsletter_id,
            tracking_token=token,
            status="DELIVERED"
        )
        db.add(log)
        count += 1
    db.commit()
    print(f"[EMAIL BROADCAST] Sent '{subject}' to {count} active subscribers (newsletter_id={newsletter_id}).")
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
        image_url=data.image_url,
        linkedin_url=data.linkedin_url
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

@app.get("/api/newsletters/{newsletter_id}")
def get_newsletter_by_id(newsletter_id: int, db: Session = Depends(get_db)):
    nl = db.query(Newsletter).filter(Newsletter.id == newsletter_id).first()
    if not nl:
        raise HTTPException(status_code=404, detail="Newsletter not found.")
    return nl

@app.post("/api/newsletters")
def create_and_send_newsletter(data: NewsletterCreate, db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    new_newsletter = Newsletter(
        edition=data.edition,
        title=data.title,
        subject=data.subject,
        tech_spotlight=data.tech_spotlight,
        content=data.content,
        linkedin_url=data.linkedin_url,
        recipient_count=0
    )
    db.add(new_newsletter)
    db.commit()
    db.refresh(new_newsletter)

    recipient_count = broadcast_email_to_subscribers(
        subject=data.subject,
        message=data.content,
        email_type="NEWSLETTER",
        db=db,
        newsletter_id=new_newsletter.id
    )

    new_newsletter.recipient_count = recipient_count
    db.commit()
    db.refresh(new_newsletter)

    return {
        "success": True,
        "newsletter": new_newsletter,
        "recipient_count": recipient_count,
        "message": f"Weekly Newsletter successfully broadcast to {recipient_count} student subscribers!"
    }

@app.put("/api/newsletters/{newsletter_id}")
def update_newsletter(
    newsletter_id: int, 
    data: NewsletterUpdate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(require_admin)
):
    newsletter = db.query(Newsletter).filter(Newsletter.id == newsletter_id).first()
    if not newsletter:
        raise HTTPException(status_code=404, detail="Newsletter not found.")

    if data.title is not None:
        newsletter.title = data.title.strip()
    if data.subject is not None:
        newsletter.subject = data.subject.strip()
    if data.edition is not None:
        newsletter.edition = data.edition.strip()
    if data.tech_spotlight is not None:
        newsletter.tech_spotlight = data.tech_spotlight.strip()
    if data.content is not None:
        newsletter.content = data.content.strip()
    if data.linkedin_url is not None:
        newsletter.linkedin_url = data.linkedin_url.strip() if data.linkedin_url else None

    db.commit()
    db.refresh(newsletter)
    print(f"[RBAC ADMIN] User {current_user.email} updated newsletter '{newsletter.title}' (ID: {newsletter_id})")
    return {
        "success": True,
        "newsletter": newsletter,
        "message": "Newsletter updated successfully."
    }

@app.delete("/api/newsletters/{newsletter_id}")
def delete_newsletter(
    newsletter_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(require_admin)
):
    newsletter = db.query(Newsletter).filter(Newsletter.id == newsletter_id).first()
    if not newsletter:
        raise HTTPException(status_code=404, detail="Newsletter not found.")
    
    title = newsletter.title
    db.delete(newsletter)
    db.commit()
    print(f"[RBAC ADMIN] User {current_user.email} deleted newsletter '{title}' (ID: {newsletter_id})")
    return {"success": True, "message": f"Newsletter '{title}' successfully deleted."}

# ----------------- In-Between Image Upload Endpoint ----------------- #
@app.post("/api/upload-image")
async def upload_image(
    file: UploadFile = File(...),
    current_user: User = Depends(require_admin)
):
    ext = os.path.splitext(file.filename)[1].lower()
    allowed_extensions = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"}
    if ext not in allowed_extensions:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid file type. Supported image extensions: {', '.join(allowed_extensions)}"
        )

    raw_name = os.path.splitext(file.filename)[0]
    safe_base = re.sub(r'[^a-zA-Z0-9_-]', '', raw_name)[:25] or "diagram"
    unique_name = f"{safe_base}_{uuid.uuid4().hex[:8]}{ext}"
    dest_path = os.path.join(UPLOAD_DIR, unique_name)

    content = await file.read()
    if len(content) > 15 * 1024 * 1024:  # 15 MB
        raise HTTPException(status_code=400, detail="Image size exceeds 15 MB limit.")

    with open(dest_path, "wb") as f:
        f.write(content)

    print(f"[UPLOAD SUCCESS] {file.filename} saved as {unique_name} by {current_user.email}")
    return {
        "success": True,
        "url": f"/uploads/{unique_name}",
        "filename": unique_name
    }

# ----------------- Email Tracking & Analytics (MVP) ----------------- #
# 43-byte Transparent 1x1 GIF for zero-latency email open tracking
TRANSPARENT_1X1_GIF = (
    b"GIF89a\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00"
    b"!\xf9\x04\x01\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01"
    b"\x00\x00\x02\x02D\x01\x00;"
)

@app.get("/api/track/open/{token}.gif")
def track_email_open(token: str, db: Session = Depends(get_db)):
    """
    Zero-overhead email open tracking pixel.
    Updates the email log timestamp and open counter.
    """
    log = db.query(EmailLog).filter(EmailLog.tracking_token == token).first()
    if log:
        if not log.opened_at:
            log.opened_at = datetime.now(timezone.utc)
        log.open_count = (log.open_count or 0) + 1
        db.commit()
    
    return Response(
        content=TRANSPARENT_1X1_GIF,
        media_type="image/gif",
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    )

@app.get("/api/admin/analytics")
def get_admin_analytics(db: Session = Depends(get_db), current_user: User = Depends(require_admin)):
    """
    Lightweight, high-performance aggregated metrics for the Admin Dashboard.
    """
    # 1. User metrics
    total_users = db.query(User).count()
    admin_count = db.query(User).filter(User.role == "ADMIN").count()
    student_count = total_users - admin_count
    recent_users = db.query(User).order_by(User.created_at.desc()).limit(8).all()
    recent_users_data = [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "created_at": u.created_at.isoformat() if u.created_at else None
        }
        for u in recent_users
    ]

    # 2. Subscriber metrics
    total_subscribers = db.query(Subscriber).count()
    active_subscribers = db.query(Subscriber).filter(Subscriber.is_active == True).count()
    unsubscribed = total_subscribers - active_subscribers
    recent_subscribers = db.query(Subscriber).order_by(Subscriber.subscribed_at.desc()).limit(8).all()
    recent_subscribers_data = [
        {
            "id": s.id,
            "email": s.email,
            "is_active": s.is_active,
            "subscribed_at": s.subscribed_at.isoformat() if s.subscribed_at else None
        }
        for s in recent_subscribers
    ]

    # 3. Email log metrics
    total_emails_sent = db.query(EmailLog).count()
    total_opened = db.query(EmailLog).filter(EmailLog.open_count > 0).count()
    overall_open_rate = round((total_opened / total_emails_sent * 100), 1) if total_emails_sent > 0 else 0.0

    # 4. Per-Newsletter performance
    newsletters = db.query(Newsletter).order_by(Newsletter.sent_at.desc()).all()
    campaigns_data = []
    for nl in newsletters:
        nl_opens = db.query(EmailLog).filter(
            EmailLog.newsletter_id == nl.id, 
            EmailLog.open_count > 0
        ).count()
        
        nl_sent = nl.recipient_count or db.query(EmailLog).filter(EmailLog.newsletter_id == nl.id).count() or 0
        rate = round((nl_opens / nl_sent * 100), 1) if nl_sent > 0 else 0.0

        campaigns_data.append({
            "id": nl.id,
            "edition": nl.edition,
            "title": nl.title,
            "subject": nl.subject,
            "sent_at": nl.sent_at.isoformat() if nl.sent_at else None,
            "recipient_count": nl_sent,
            "opens": nl_opens,
            "open_rate": rate
        })

    return {
        "success": True,
        "users": {
            "total": total_users,
            "admins": admin_count,
            "students": student_count,
            "recent": recent_users_data
        },
        "subscribers": {
            "total": total_subscribers,
            "active": active_subscribers,
            "unsubscribed": unsubscribed,
            "recent": recent_subscribers_data
        },
        "emails": {
            "total_sent": total_emails_sent,
            "total_opened": total_opened,
            "overall_open_rate": overall_open_rate
        },
        "campaigns": campaigns_data
    }

