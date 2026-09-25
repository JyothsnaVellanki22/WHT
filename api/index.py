import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(current_dir, "..", "backend")

# Ensure the api directory is primary in sys.path
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)
if os.path.isdir(backend_dir) and backend_dir not in sys.path:
    sys.path.append(backend_dir)

try:
    from main import app
except Exception as e:
    import traceback
    from fastapi import FastAPI
    from fastapi.responses import HTMLResponse
    app = FastAPI(title="WHT Startup Error Handler")
    error_trace = traceback.format_exc()
    print(f"[VERCEL STARTUP FATAL ERROR]:\n{error_trace}")
    
    @app.api_route("/{path_name:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"])
    def catch_startup_error(path_name: str = ""):
        html = f"""
        <html>
            <body style="font-family: monospace; background: #0f172a; color: #f87171; padding: 2rem;">
                <h2>WHT Backend Startup Error on Vercel</h2>
                <pre style="background: #1e293b; padding: 1.5rem; border-radius: 8px; overflow-x: auto; color: #f1f5f9;">{error_trace}</pre>
            </body>
        </html>
        """
        return HTMLResponse(content=html, status_code=500)

