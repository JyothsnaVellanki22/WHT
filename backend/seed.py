from database import engine, SessionLocal, Base
from models import Article
import datetime

def seed_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    if db.query(Article).count() == 0:
        articles = [
            Article(
                title="Agentic AI Frameworks Taking Over",
                slug="agentic-ai-frameworks",
                summary="A look at how AutoGPT and LangChain are reshaping backend architecture.",
                content="Full content about Agentic AI frameworks...",
                category="AGENTIC_AI",
                sub_category="AI Agents",
                source_name="Tech Blog",
                image_url="https://via.placeholder.com/400",
                published_at=datetime.datetime.now()
            ),
            Article(
                title="Cloud Optimization Trends 2024",
                slug="cloud-optimization-trends-2024",
                summary="The major shifts in cloud infrastructure and DevOps practices.",
                content="Full content about Cloud optimization...",
                category="TECH_TRENDS",
                sub_category="Cloud",
                source_name="DevOps Weekly",
                image_url="https://via.placeholder.com/400",
                published_at=datetime.datetime.now()
            ),
            Article(
                title="LLM Updates: The New Meta Llama",
                slug="llm-updates-new-meta-llama",
                summary="Meta's latest open-source LLM brings new capabilities for local deployment.",
                content="Full content about LLM updates...",
                category="AGENTIC_AI",
                sub_category="LLM",
                source_name="AI Research",
                image_url="https://via.placeholder.com/400",
                published_at=datetime.datetime.now()
            )
        ]
        db.add_all(articles)
        db.commit()
    db.close()

if __name__ == "__main__":
    seed_db()
    print("Database seeded successfully.")
