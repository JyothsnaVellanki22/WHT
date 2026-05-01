from database import engine, SessionLocal, Base
from models import Article
import datetime

def re_seed_db():
    db = SessionLocal()
    # Update existing articles with better images
    articles = db.query(Article).all()
    
    images = [
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80"
    ]
    
    for i, article in enumerate(articles):
        article.image_url = images[i % len(images)]
        
    db.commit()
    db.close()

if __name__ == "__main__":
    re_seed_db()
    print("Database images updated successfully.")
