# app/routers/canva.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import RedirectResponse
import secrets
import urllib.parse
import httpx
from datetime import datetime, timedelta
import os


from app.database import SessionLocal, CanvaIntegration

router = APIRouter()



CANVA_CLIENT_ID = os.getenv("CANVA_CLIENT_ID")
CANVA_CLIENT_SECRET = os.getenv("CANVA_CLIENT_SECRET")
CANVA_REDIRECT_URI = os.getenv("CANVA_REDIRECT_URI")
CANVA_OAUTH_AUTHORIZE_URL = "https://api.canva.com/oauth/authorize"
CANVA_OAUTH_TOKEN_URL = "https://api.canva.com/v1/oauth/token"

state_store = {}

async def get_db():
    async with SessionLocal() as session:
        yield session

@router.get("/oauth/canva/start")
async def canva_oauth_start(company_id: int):
    state = secrets.token_urlsafe(32)
    state_store[state] = {"company_id": company_id, "expires": datetime.utcnow() + timedelta(minutes=10)}
    params = {
        "client_id": CANVA_CLIENT_ID,
        "redirect_uri": CANVA_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid offline_access",
        "state": state,
    }
    url = f"{CANVA_OAUTH_AUTHORIZE_URL}?{urllib.parse.urlencode(params)}"
    return RedirectResponse(url)

@router.get("/oauth/canva/callback")
async def canva_oauth_callback(code: str, state: str, db: AsyncSession = Depends(get_db)):
    state_data = state_store.pop(state, None)
    if not state_data:
        raise HTTPException(status_code=400, detail="Invalid state")

    company_id = state_data["company_id"]

    async with httpx.AsyncClient() as client:
        response = await client.post(
            CANVA_OAUTH_TOKEN_URL,
            data={
                "grant_type": "authorization_code",
                "code": code,
                "client_id": CANVA_CLIENT_ID,
                "client_secret": CANVA_CLIENT_SECRET,
                "redirect_uri": CANVA_REDIRECT_URI,
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )

    if response.status_code != 200:
        print("❌ Canva Token Exchange Failed:", response.text)
        raise HTTPException(status_code=500, detail="Failed to exchange Canva token")

    token_data = response.json()

    integration = CanvaIntegration(
        company_id=company_id,
        canva_account_id=token_data.get("account_id", "unknown"),
        access_token=token_data["access_token"],
        refresh_token=token_data.get("refresh_token"),
        expires_at=datetime.utcnow() + timedelta(seconds=token_data.get("expires_in", 3600))
    )
    db.add(integration)
    await db.commit()

    return {"message": "✅ Canva Connected Successfully"}
