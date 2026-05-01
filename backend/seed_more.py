from database import engine, SessionLocal, Base
from models import Article
import datetime

def seed_more_articles():
    db = SessionLocal()
    
    # Delete existing to prevent duplicates if slug constraint hits
    db.query(Article).delete()
    
    articles = [
        # AGENTIC AI
        Article(
            title="Agentic AI Frameworks Taking Over",
            slug="agentic-ai-frameworks",
            summary="A look at how AutoGPT and LangChain are reshaping backend architecture.",
            content="Full content about Agentic AI frameworks...",
            category="AGENTIC_AI",
            sub_category="AI Agents",
            source_name="Tech Blog",
            image_url="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
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
            image_url="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
            published_at=datetime.datetime.now()
        ),
        Article(
            title="OpenAI's Q* Algorithm Rumors",
            slug="openai-q-star-rumors",
            summary="What the rumored Q* breakthrough means for autonomous problem solving.",
            content="Full content about Q star...",
            category="AGENTIC_AI",
            sub_category="Research",
            source_name="AI Insider",
            image_url="https://images.unsplash.com/photo-1655635643532-fa9ba2648cbe?auto=format&fit=crop&w=800&q=80",
            published_at=datetime.datetime.now()
        ),
        Article(
            title="Local LLMs on Apple Silicon",
            slug="local-llms-apple-silicon",
            summary="How M3 Max chips are making local AI development a reality for engineers.",
            content="Full content...",
            category="AGENTIC_AI",
            sub_category="Hardware",
            source_name="Hardware Today",
            image_url="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
            published_at=datetime.datetime.now()
        ),
        Article(
            title="Multi-Agent Systems in Production",
            slug="multi-agent-systems",
            summary="Case studies of companies replacing traditional workflows with multi-agent swarms.",
            content="Full content...",
            category="AGENTIC_AI",
            sub_category="Enterprise",
            source_name="Tech Enterprise",
            image_url="https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=800&q=80",
            published_at=datetime.datetime.now()
        ),

        # TECH TRENDS
        Article(
            title="Cloud Optimization Trends 2024",
            slug="cloud-optimization-trends-2024",
            summary="The major shifts in cloud infrastructure and DevOps practices.",
            content="Full content about Cloud optimization...",
            category="TECH_TRENDS",
            sub_category="Cloud",
            source_name="DevOps Weekly",
            image_url="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
            published_at=datetime.datetime.now()
        ),
        Article(
            title="The Rust Migration Wave",
            slug="rust-migration-wave",
            summary="Why C++ codebases are increasingly being rewritten in Rust.",
            content="Full content...",
            category="TECH_TRENDS",
            sub_category="Developer Tools",
            source_name="Code Journal",
            image_url="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
            published_at=datetime.datetime.now()
        ),
        Article(
            title="Cybersecurity in the GenAI Era",
            slug="cybersecurity-genai",
            summary="How threat actors are using LLMs, and how defenders are fighting back.",
            content="Full content...",
            category="TECH_TRENDS",
            sub_category="Security",
            source_name="SecNews",
            image_url="https://images.unsplash.com/photo-1510511459019-5efa32040003?auto=format&fit=crop&w=800&q=80",
            published_at=datetime.datetime.now()
        ),
        Article(
            title="Tech Hiring: The Return of the Whiteboard?",
            slug="tech-hiring-whiteboard",
            summary="Companies are ditching take-home assignments due to ChatGPT. What's next?",
            content="Full content...",
            category="TECH_TRENDS",
            sub_category="Jobs",
            source_name="HR Tech",
            image_url="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
            published_at=datetime.datetime.now()
        ),
        Article(
            title="PostgreSQL Dominance Continues",
            slug="postgres-dominance",
            summary="Why the open-source relational database is still the default choice for new startups.",
            content="Full content...",
            category="TECH_TRENDS",
            sub_category="Data",
            source_name="Data Eng Weekly",
            image_url="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
            published_at=datetime.datetime.now()
        )
    ]
    
    db.add_all(articles)
    db.commit()
    db.close()

if __name__ == "__main__":
    seed_more_articles()
    print("Database seeded with more articles.")
