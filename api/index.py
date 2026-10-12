import os
import sys
import shutil

# Ensure backend directory is in the Python search path
current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(current_dir)
backend_dir = os.path.join(root_dir, "backend")

if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Ensure database is in /tmp for write permissions in Vercel serverless environment
tmp_db = "/tmp/cybertwin.db"
src_db = os.path.join(backend_dir, "cybertwin.db")

if os.environ.get("VERCEL") or not os.environ.get("DATABASE_URL"):
    try:
        if os.path.exists(src_db) and not os.path.exists(tmp_db):
            os.makedirs("/tmp", exist_ok=True)
            shutil.copy2(src_db, tmp_db)
    except Exception as e:
        print(f"Warning copying db to /tmp: {e}")
    os.environ["DATABASE_URL"] = f"sqlite:///{tmp_db}"

from main import app
