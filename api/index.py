import sys
import os
import traceback

current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(current_dir, "..", "backend")

# Ensure all possible backend paths are in sys.path
for p in [
    backend_dir,
    os.path.join(current_dir, "backend"),
    os.path.join(os.getcwd(), "backend"),
    current_dir
]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)

try:
    from main import app
except Exception as e:
    from fastapi import FastAPI
    from fastapi.responses import PlainTextResponse
    app = FastAPI(title="WHT Startup Error Handler")
    error_trace = traceback.format_exc()
    print(f"[VERCEL STARTUP FATAL ERROR]:\n{error_trace}")
    
    @app.api_route("/{path_name:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"])
    def catch_startup_error(path_name: str):
        return PlainTextResponse(
            f"WHT Backend Startup Error on Vercel:\n\n{error_trace}", 
            status_code=500
        )
