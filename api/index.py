import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

backend_dir = os.path.join(current_dir, "..", "backend")
if os.path.isdir(backend_dir) and backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

try:
    from main import app
except Exception as e:
    import traceback
    from fastapi import FastAPI
    from fastapi.responses import PlainTextResponse
    app = FastAPI(title="WHT Startup Error Handler")
    error_trace = traceback.format_exc()
    print(f"[VERCEL STARTUP FATAL ERROR]:\n{error_trace}")
    
    @app.api_route("/{path_name:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"])
    def catch_startup_error(path_name: str = ""):
        return PlainTextResponse(
            f"WHT Backend Startup Error on Vercel:\n\n{error_trace}", 
            status_code=500
        )

