# app/routers/google.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from starlette.responses import RedirectResponse
from datetime import datetime, timedelta
import httpx
import os


from app.database import SessionLocal, GoogleCalendarIntegration

router = APIRouter()



GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")

async def get_db():
    async with SessionLocal() as session:
        yield session

@router.get("/api/google/auth")
async def google_oauth_start():
    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email",
        "access_type": "offline",
        "prompt": "consent",
    }
    auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?{urllib.parse.urlencode(params)}"
    return RedirectResponse(auth_url)

@router.get("/api/google/calendar/start")
async def google_calendar_oauth_start(company_id: int):
    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email",
        "access_type": "offline",
        "prompt": "consent",
        "state": str(company_id),
    }
    full_url = f"https://accounts.google.com/o/oauth2/v2/auth?{urllib.parse.urlencode(params)}"
    return RedirectResponse(full_url)

@router.get("/api/google/calendar/callback")
async def google_calendar_callback(code: str, state: str = Query(...), db: AsyncSession = Depends(get_db)):
    async with httpx.AsyncClient() as client:
        token_response = await client.post(
            url="https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "redirect_uri": GOOGLE_REDIRECT_URI,
                "grant_type": "authorization_code",
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )

    if token_response.status_code != 200:
        raise HTTPException(status_code=400, detail="Google Calendar token exchange failed")

    token_data = token_response.json()
    company_id = int(state)

    db_token = GoogleCalendarIntegration(
        company_id=company_id,
        access_token=token_data["access_token"],
        refresh_token=token_data.get("refresh_token"),
        expires_at=datetime.utcnow() + timedelta(seconds=token_data.get("expires_in", 3600))
    )
    db.add(db_token)
    await db.commit()

    redirect_url = f"http://localhost:5173/tools/googlecalender/google?connected=true"
    return RedirectResponse(redirect_url)

@router.get("/api/google/status")
async def google_status(company_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(GoogleCalendarIntegration)
        .where(GoogleCalendarIntegration.company_id == company_id)
        .order_by(GoogleCalendarIntegration.created_at.desc())
    )
    integration = result.scalars().first()

    if integration and integration.expires_at > datetime.utcnow():
        return {
            "connected": True,
            "email": "dummy@email.com"
        }

    return {"connected": False, "email": None}
