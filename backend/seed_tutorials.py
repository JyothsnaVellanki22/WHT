from database import SessionLocal, engine, Base
from models import BlogPost, Subscriber, Newsletter, EmailLog
from datetime import datetime, timedelta

Base.metadata.create_all(bind=engine)

def seed_database():
    db = SessionLocal()

    # Clear existing if needed or check if empty
    if db.query(BlogPost).count() == 0:
        print("Seeding practical AI tutorials...")
        tutorials = [
            BlogPost(
                title="Building a Local Autonomous Coding Agent with Ollama and LangChain",
                slug="building-local-autonomous-coding-agent-ollama-langchain",
                category="AI TUTORIAL",
                tech_stack="Python, Ollama, LangChain, Llama 3",
                difficulty="INTERMEDIATE",
                author="Jyothsna Vellanki",
                read_time="6 MIN READ",
                image_url="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
                summary="Step-by-step practical guide for students: Setup local LLMs with Ollama, construct an AST tool execution pipeline in LangChain, and build an agent that autonomously reviews and refactors Python code.",
                content="""
<h3>1. What You Will Learn & Build</h3>
<p>In this hands-on tutorial, we build a local autonomous coding assistant that runs completely offline on your computer using <strong>Ollama</strong> and <strong>LangChain</strong>. No OpenAI API keys or cloud costs required.</p>

<h3>2. Prerequisites & Environment Setup</h3>
<p>Install Ollama from <code>ollama.ai</code> and run the following terminal command to pull the 8B coding model:</p>
<pre><code># Pull the local open-weights model
ollama run llama3:8b

# Install python dependencies in your virtualenv
pip install langchain langchain-community langchain-core pydantic</code></pre>

<h3>3. Defining the AST Code Reviewer Tool</h3>
<p>We write a Python tool that inspects files, runs Python's built-in <code>ast</code> parser to detect syntax issues, and suggests refactors:</p>
<pre><code>import ast
from langchain.tools import tool

@tool
def analyze_python_code(source_code: str) -> str:
    \"\"\"Parses Python code and checks for AST syntax errors or anti-patterns.\"\"\"
    try:
        tree = ast.parse(source_code)
        num_functions = len([node for node in ast.walk(tree) if isinstance(node, ast.FunctionDef)])
        return f"Code syntax is valid! Found {num_functions} functions."
    except SyntaxError as e:
        return f"Syntax Error on line {e.lineno}: {e.msg}"</code></pre>

<h3>4. Binding the Agent to Ollama</h3>
<pre><code>from langchain_community.llms import Ollama
from langchain.agents import create_react_agent, AgentExecutor
from langchain_core.prompts import PromptTemplate

llm = Ollama(model="llama3:8b", temperature=0.2)
tools = [analyze_python_code]

# Initialize agent loop
print("Agent ready! Provide your code snippet to analyze.")</code></pre>

<h3>5. Practical Takeaways for Students</h3>
<ul>
  <li>Local LLM orchestration is free, fast, and confidential for student projects.</li>
  <li>Binding deterministic AST tools eliminates model hallucination when inspecting code.</li>
</ul>
"""
            ),
            BlogPost(
                title="Fine-Tuning Llama 3 with LoRA and PyTorch: Step-by-Step Practical Guide",
                slug="fine-tuning-llama-3-lora-pytorch-guide",
                category="HANDS-ON GUIDE",
                tech_stack="PyTorch, Hugging Face, PEFT, LoRA",
                difficulty="PRO",
                author="WHT Tech Team",
                read_time="8 MIN READ",
                image_url="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
                summary="Learn parameter-efficient fine-tuning (PEFT) on consumer GPUs. We cover dataset formatting, QLoRA 4-bit quantization, Hugging Face SFTTrainer, and evaluating loss curves.",
                content="""
<h3>1. Introduction to QLoRA & Parameter-Efficient Fine-Tuning</h3>
<p>Fine-tuning modern foundation models no longer requires an 8x A100 GPU cluster. With <strong>QLoRA (Quantized Low-Rank Adaptation)</strong>, we can fine-tune an 8-billion parameter model on a single 16GB VRAM GPU.</p>

<h3>2. Setting Up the Training Pipeline</h3>
<pre><code>pip install torch transformers datasets peft bitsandbytes trl accelerate</code></pre>

<h3>3. Loading the 4-Bit Quantized Base Model</h3>
<pre><code>import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
from peft import LoraConfig, get_peft_model

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.float16,
)

model_id = "meta-llama/Meta-Llama-3-8B"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    quantization_config=bnb_config,
    device_map="auto"
)</code></pre>

<h3>4. Configuring the LoRA Adapters</h3>
<pre><code>peft_config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=["q_proj", "v_proj"],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)
model = get_peft_model(model, peft_config)
print("Trainable parameters:", model.print_trainable_parameters())</code></pre>

<h3>5. Summary & Evaluation</h3>
<p>By training only 0.1% of total parameters, training converges in under 45 minutes on custom technical instruction datasets.</p>
"""
            ),
            BlogPost(
                title="Production RAG with ChromaDB, FastEmbed & Hybrid Search",
                slug="production-rag-chromadb-fastembed-hybrid-search",
                category="TOOLS & FRAMEWORKS",
                tech_stack="ChromaDB, FastEmbed, Python, Vector DB",
                difficulty="BEGINNER",
                author="WHT Editorial",
                read_time="5 MIN READ",
                image_url="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
                summary="Build a blazing-fast Retrieval-Augmented Generation system. Learn vector embedding creation, cosine similarity querying, reranking, and context injection into LLM prompts.",
                content="""
<h3>1. Why Standard Prompting Fails for Custom Data</h3>
<p>LLMs possess broad public knowledge but have zero context on your private code, documentation, or textbooks. <strong>RAG (Retrieval-Augmented Generation)</strong> connects your private knowledge base directly to LLM queries.</p>

<h3>2. Installing Vector Database & Embeddings</h3>
<pre><code>pip install chromadb fastembed langchain</code></pre>

<h3>3. Ingesting Documents & Querying</h3>
<pre><code>import chromadb
from chromadb.utils import embedding_functions

client = chromadb.Client()
collection = client.create_collection("tech_docs")

# Add student textbook snippets
collection.add(
    documents=[
        "Transformers rely on multi-head self-attention mechanisms to weigh token dependencies.",
        "Backpropagation computes gradient vectors through reverse-mode automatic differentiation."
    ],
    ids=["doc1", "doc2"]
)

# Semantic search query
results = collection.query(
    query_texts=["How does self-attention work in neural nets?"],
    n_results=1
)
print("Retrieved context:", results['documents'])</code></pre>
"""
            )
        ]
        for t in tutorials:
            db.add(t)
        db.commit()
        print("Added 3 practical learning tutorials.")

    # Seed initial subscribers if empty
    if db.query(Subscriber).count() == 0:
        print("Seeding initial student subscribers...")
        sample_emails = [
            "alex.chen@university.edu",
            "sarah.miller@mit.edu",
            "rahul.sharma@iit.ac.in",
            "david.kim@stanford.edu",
            "elena.rostova@dev.io"
        ]
        for email in sample_emails:
            db.add(Subscriber(email=email))
        db.commit()
        print("Added 5 sample student subscribers.")

    # Seed initial newsletters if empty
    if db.query(Newsletter).count() == 0:
        print("Seeding sample weekly newsletter...")
        nl = Newsletter(
            edition="Edition #12",
            title="Mastering Local LLM Tool Calling & DeepSeek-R1 Distillations",
            subject="WHT Weekly #12: Local Tool Calling, LoRA Fine-Tuning, & Python Agents",
            tech_spotlight="Ollama 0.5 + DeepSeek-R1 Distill",
            content="""
Welcome to this week's WHT Learning Dispatch! Here is what we're building this week:

1. **Local Tool-Calling Deep Dive**: How to bind deterministic Python functions to Ollama models.
2. **PyTorch Quantization Breakdown**: What is NF4 quantization and why does it save 70% VRAM?
3. **Student Project Idea**: Build a local terminal CLI agent that monitors git diffs before you push!
            """,
            recipient_count=5
        )
        db.add(nl)
        db.commit()
        print("Added sample newsletter edition.")

    db.close()
    print("Database seeding complete!")

if __name__ == "__main__":
    seed_database()
