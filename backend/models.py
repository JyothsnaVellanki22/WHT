from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, default="User")
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="USER")  # "ADMIN", "USER"
    created_at = Column(DateTime, server_default=func.now())

class BlogPost(Base):
    __tablename__ = "blog_posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    summary = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    tech_stack = Column(String, default="Python, AI")  # e.g. "LangChain, Ollama, Python"
    difficulty = Column(String, default="BEGINNER")     # BEGINNER, INTERMEDIATE, PRO
    category = Column(String, default="AI TUTORIAL")   # AI TUTORIAL, TOOLS & FRAMEWORKS, HANDS-ON GUIDE, CAREER DEV
    author = Column(String, default="WHT Tech Team")
    read_time = Column(String, default="5 MIN READ")
    image_url = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

class Subscriber(Base):
    __tablename__ = "subscribers"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    is_active = Column(Boolean, default=True)
    subscribed_at = Column(DateTime, server_default=func.now())

class Newsletter(Base):
    __tablename__ = "newsletters"

    id = Column(Integer, primary_key=True, index=True)
    edition = Column(String, nullable=False)           # e.g. "Edition #24"
    title = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    tech_spotlight = Column(String)                    # e.g. "Ollama 0.5 + DeepSeek-R1"
    content = Column(Text, nullable=False)
    linkedin_url = Column(String, nullable=True)
    recipient_count = Column(Integer, default=0)
    sent_at = Column(DateTime, server_default=func.now())


class EmailLog(Base):
    __tablename__ = "email_logs"

    id = Column(Integer, primary_key=True, index=True)
    recipient_email = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    email_type = Column(String, default="NEWSLETTER")  # NEWSLETTER, NEW_BLOG
    newsletter_id = Column(Integer, nullable=True, index=True)
    tracking_token = Column(String, unique=True, index=True, nullable=True)
    sent_at = Column(DateTime, server_default=func.now())
    opened_at = Column(DateTime, nullable=True)
    open_count = Column(Integer, default=0)
    status = Column(String, default="DELIVERED")

