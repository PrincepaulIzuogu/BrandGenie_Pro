import os
import random
import smtplib
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from typing import List

import pytz
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from passlib.context import CryptContext

from app.database import (
    SessionLocal,
    User,
    ProjectMember,
    ToolPermission,
    DocumentPermission,
    DriveFile,
    Tool,
    Project,
    GroupMember,
)

load_dotenv()
router = APIRouter(prefix="/api/adduser", tags=["Add User"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
BERLIN_TZ = pytz.timezone("Europe/Berlin")

# ---------- DB Dependency ----------
async def get_db():
    async with SessionLocal() as session:
        yield session

# ---------- Request Models ----------
class DurationModel(BaseModel):
    items: List[int]
    durationValue: int
    durationType: str

class AddUserPayload(BaseModel):
    fullName: str
    email: EmailStr
    role: str
    durationValue: int
    durationType: str
    groups: List[int]
    projects: DurationModel
    tools: DurationModel
    documents: DurationModel
    company_id: int

# ---------- Email Sender ----------
def send_email(to_email: str, code: str, duration: str):
    from_email = os.getenv("FROM_EMAIL")
    from_name = os.getenv("FROM_NAME")
    email_password = os.getenv("EMAIL_PASSWORD")

    if not all([from_email, email_password, from_name]):
        raise RuntimeError("Missing email credentials in .env")

    msg = MIMEText(
        f"""Hello,\n\nYou've been added to {from_name}.\n\nTemporary Code: {code}\nDuration: {duration}\n\nLogin at: https://brandgenie.pro/login\n\nThanks,\n{from_name} Team"""
    )
    msg["Subject"] = f"Your {from_name} Login Access"
    msg["From"] = from_email
    msg["To"] = to_email

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(from_email, email_password)
        server.send_message(msg)

# ---------- Helper ----------
def calculate_expiry(duration_value: int, duration_type: str) -> datetime:
    now_berlin = datetime.now(BERLIN_TZ)

    delta = {
        "hours": timedelta(hours=duration_value),
        "days": timedelta(days=duration_value),
        "months": timedelta(days=30 * duration_value),
        "years": timedelta(days=365 * duration_value),
    }.get(duration_type)

    if delta is None:
        raise ValueError("Invalid duration type")

    expiry_berlin = now_berlin + delta
    expiry_utc = expiry_berlin.astimezone(pytz.utc)

    return expiry_utc.replace(tzinfo=None)

# ---------- Main Endpoint ----------
@router.post("/")
async def add_user(payload: AddUserPayload, db: AsyncSession = Depends(get_db)):
    normalized_email = payload.email.strip().lower()

    existing_user = await db.execute(select(User).where(User.email == normalized_email))
    if existing_user.scalars().first():
        raise HTTPException(status_code=400, detail="User with this email already exists.")

    temp_code = "".join([str(random.randint(0, 9)) for _ in range(5)])
    contract_expiry = calculate_expiry(payload.durationValue, payload.durationType)

    hashed_code = pwd_context.hash(temp_code)

    user = User(
        full_name=payload.fullName,
        email=normalized_email,
        role=payload.role,
        password_hash=hashed_code,
        temp_code=temp_code,
        contract_expiry=contract_expiry,
        token_expiry=contract_expiry,
        company_id=payload.company_id,
        is_active=True,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    for group_id in payload.groups:
        db.add(GroupMember(user_id=user.id, group_id=group_id))

    project_expiry = calculate_expiry(payload.projects.durationValue, payload.projects.durationType)
    for pid in payload.projects.items:
        db.add(ProjectMember(
            user_id=user.id,
            project_id=pid,
            access_start=datetime.now(BERLIN_TZ).astimezone(pytz.utc).replace(tzinfo=None),
            access_end=project_expiry
        ))

    tool_expiry = calculate_expiry(payload.tools.durationValue, payload.tools.durationType)
    for tid in payload.tools.items:
        db.add(ToolPermission(
            user_id=user.id,
            tool_id=tid,
            access_start=datetime.now(BERLIN_TZ).astimezone(pytz.utc).replace(tzinfo=None),
            access_end=tool_expiry
        ))

    doc_expiry = calculate_expiry(payload.documents.durationValue, payload.documents.durationType)
    for did in payload.documents.items:
        db.add(DocumentPermission(
            user_id=user.id,
            document_id=did,
            access_start=datetime.now(BERLIN_TZ).astimezone(pytz.utc).replace(tzinfo=None),
            access_end=doc_expiry
        ))

    await db.commit()

    send_email(user.email, temp_code, f"{payload.durationValue} {payload.durationType}")

    return {"message": "User created and login email sent."}
