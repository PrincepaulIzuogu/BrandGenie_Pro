# app/routers/copilot.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
import os
from dotenv import load_dotenv
from app.database import SessionLocal, CopilotRequest, CopilotResponse
router = APIRouter()

# Load env variables
load_dotenv()

# API Configuration
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
OPENROUTER_MODEL = "gpt-4o"  # Model used



# ✅ CoPilot generation function
async def generate_copilot_response(prompt: str) -> str:
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }

    body = {
        "model": OPENROUTER_MODEL,
        "messages": [
            {"role": "system", "content": (
                "You are an expert AI assistant that helps users write social media captions, hashtags, email subject lines, "
                "and content ideas. Always generate catchy, creative, and engaging outputs. Keep them short and effective."
            )},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 500,
        "temperature": 0.7,
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(OPENROUTER_API_URL, headers=headers, json=body)
        response.raise_for_status()
        data = response.json()

        return data["choices"][0]["message"]["content"]

@router.post("/copilot/chat", response_model=CopilotResponse)
async def copilot_chat(request: CopilotRequest):
    try:
        ai_response = await generate_copilot_response(request.prompt)
        return CopilotResponse(response=ai_response)
    except Exception as e:
        print("❌ Copilot Error:", str(e))
        raise HTTPException(status_code=500, detail="Failed to generate AI response.")
