import os
from typing import Optional
import openai

def is_openai_available() -> bool:
    return bool(os.getenv("OPENAI_API_KEY"))

def get_ai_provider() -> Optional[openai.Client]:
    if is_openai_available():
        return openai.Client(api_key=os.getenv("OPENAI_API_KEY"))
    return None
