import os
import subprocess
import sys
import time
import signal

root_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(root_dir, "backend")
frontend_dir = os.path.join(root_dir, "frontend")

backend_cmd = [sys.executable, "-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8001"]
frontend_cmd = ["cmd.exe", "/c", "npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]

print("=" * 60)
print("Starting CyberTwin AI Services...")
print("=" * 60)

print(f"[Backend] Starting on http://127.0.0.1:8001 ...")
backend_proc = subprocess.Popen(
    backend_cmd,
    cwd=backend_dir,
    stdout=sys.stdout,
    stderr=sys.stderr
)

# Brief delay to allow backend to bind
time.sleep(2)

print(f"[Frontend] Starting on http://localhost:3000 ...")
frontend_proc = subprocess.Popen(
    frontend_cmd,
    cwd=frontend_dir,
    stdout=sys.stdout,
    stderr=sys.stderr
)

print("=" * 60)
print("CyberTwin AI is running:")
print("  - Frontend UI:  http://localhost:3000")
print("  - Backend API:  http://127.0.0.1:8001")
print("  - API Docs:     http://127.0.0.1:8001/docs")
print("=" * 60)

def handle_exit(signum, frame):
    print("\nShutting down services...")
    try:
        backend_proc.terminate()
    except Exception:
        pass
    try:
        frontend_proc.terminate()
    except Exception:
        pass
    sys.exit(0)

signal.signal(signal.SIGINT, handle_exit)
signal.signal(signal.SIGTERM, handle_exit)

try:
    while True:
        time.sleep(1)
        if backend_proc.poll() is not None:
            print("[Backend] Exited unexpectedly")
            break
        if frontend_proc.poll() is not None:
            print("[Frontend] Exited unexpectedly")
            break
except KeyboardInterrupt:
    handle_exit(None, None)
finally:
    handle_exit(None, None)
