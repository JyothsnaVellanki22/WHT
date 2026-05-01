from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from database import Base

class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    summary = Column(Text)
    content = Column(Text)
    category = Column(String, nullable=False)
    sub_category = Column(String)
    source_name = Column(String)
    source_url = Column(String)
    image_url = Column(String)
    author = Column(String)
    published_at = Column(DateTime)
    created_at = Column(DateTime, server_default=func.now())
