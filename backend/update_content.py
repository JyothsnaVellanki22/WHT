from database import SessionLocal
from models import Article

def update_article_content():
    db = SessionLocal()
    
    # Generic realistic long-form content to inject
    long_content_ai = """
    <h2>The Shifting Landscape</h2>
    <p>We are witnessing a monumental shift in how software architectures are designed. The traditional approach of rigid, predefined backend endpoints is giving way to dynamic, intelligent systems capable of reasoning.</p>
    
    <h2>Why This Matters</h2>
    <p>For years, developers have focused on writing explicit logic. Now, with the rise of autonomous agents, the focus is shifting towards orchestration. This means creating environments where AI agents can interact, access tools, and make decisions to achieve a goal.</p>
    
    <ul>
        <li><strong>Tool Integration:</strong> Agents can now natively call APIs, query databases, and execute code.</li>
        <li><strong>Memory Management:</strong> Modern frameworks allow agents to retain context over long interactions.</li>
        <li><strong>Multi-Agent Swarms:</strong> Complex tasks are broken down and handled by specialized agents working together.</li>
    </ul>

    <h2>Looking Ahead</h2>
    <p>The role of the software engineer is evolving. Those who master the orchestration of these agentic workflows will have a significant advantage in the job market. It's no longer just about writing code; it's about guiding intelligence.</p>
    """
    
    long_content_trends = """
    <h2>The Current State of the Industry</h2>
    <p>The technology sector is currently undergoing a massive realignment. After years of unchecked growth, companies are now fiercely focused on efficiency, profitability, and operational excellence.</p>
    
    <h2>Key Drivers of Change</h2>
    <p>Several factors are contributing to this paradigm shift:</p>
    <ul>
        <li><strong>Cloud Repatriation:</strong> Some organizations are moving workloads back on-premise to control spiraling cloud costs.</li>
        <li><strong>The Rise of Rust:</strong> Performance-critical applications are being rewritten in memory-safe languages.</li>
        <li><strong>AI Integration:</strong> Every product roadmap now features an AI integration strategy, fundamentally changing how products are built.</li>
    </ul>
    
    <h2>What This Means for You</h2>
    <p>As the market tightens, having a deep, specialized skill set is more important than ever. Generalists are struggling, but engineers who can optimize systems, reduce costs, or seamlessly integrate AI are in incredibly high demand.</p>
    """

    articles = db.query(Article).all()
    
    for article in articles:
        if article.category == "AGENTIC_AI":
            article.content = long_content_ai
        else:
            article.content = long_content_trends
            
    db.commit()
    db.close()

if __name__ == "__main__":
    update_article_content()
    print("Article content updated successfully.")
