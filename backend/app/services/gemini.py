import os
import json
import logging
import google.generativeai as genai
from typing import Dict, Any, Optional
from pathlib import Path
from app.core.config import settings

logger = logging.getLogger(__name__)

PROMPT_PATH = Path(__file__).parent.parent / "prompts" / "analyzer_system.md"

class GeminiService:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-flash-latest')
        else:
            logger.warning("GOOGLE_API_KEY not found. Gemini Service will fail if called.")
            self.model = None

    def _load_prompt_template(self) -> str:
        if not PROMPT_PATH.exists():
            raise FileNotFoundError(f"Prompt file not found at {PROMPT_PATH}")
        return PROMPT_PATH.read_text()

    async def analyze_resume(self, resume_text: str) -> Dict[str, Any]:
        if not self.model:
            raise ValueError("Google API Key is missing. Cannot perform analysis.")

        try:
            # 1. Prepare Prompt
            template = self._load_prompt_template()
            final_prompt = template.replace("{{RESUME_TEXT}}", resume_text)

            # 2. Call Gemini (Force JSON expectation in the prompt is key, 
            # but we can also use generation_config for strict JSON if available, 
            # for now relying on the strong system prompt).
            response = self.model.generate_content(
                final_prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            
            # 3. Parse Response
            response_text = response.text
            # Clean up potential markdown fences if Gemini keeps them despite mime_type
            if response_text.startswith("```json"):
                response_text = response_text.replace("```json", "").replace("```", "")
            
            data = json.loads(response_text)
            return data

        except Exception as e:
            logger.error(f"Gemini Analysis Failed: {str(e)}")
            raise e
