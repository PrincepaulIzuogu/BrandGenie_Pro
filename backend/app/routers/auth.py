from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from jose import jwt, JWTError
from datetime import datetime, timedelta
from email.message import EmailMessage
import smtplib
import os

from app.database import (
    SessionLocal, User, Company, CompanyCreate, UserOut,
    VerificationToken, LoginRequest, StaffLoginRequest
)
from passlib.context import CryptContext



router = APIRouter()

# Constants
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
FROM_EMAIL = os.getenv("FROM_EMAIL")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
FROM_NAME = os.getenv("FROM_NAME", "BrandGenie Pro")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# -----------------------
# Utility Functions
# -----------------------
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

async def get_db():
    async with SessionLocal() as session:
        yield session

async def send_verification_email(email: str, code: str):
    try:
        msg = EmailMessage()
        msg["Subject"] = "Verify your BrandGenie Pro Account"
        msg["From"] = f"{FROM_NAME} <{FROM_EMAIL}>"
        msg["To"] = email
        msg.set_content(f"Your verification code is: {code}\nIt expires in 10 minutes.")
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(FROM_EMAIL, EMAIL_PASSWORD)
            smtp.send_message(msg)
    except Exception as e:
        print("❌ Email failed:", e)
        raise HTTPException(status_code=500, detail="Failed to send verification email.")


# -----------------------
# Registration
# -----------------------
@router.post("/register/company")
async def register_company(data: CompanyCreate, db: AsyncSession = Depends(get_db)):
    normalized_email = data.email.strip().lower()
    result = await db.execute(select(Company).where(Company.email == normalized_email))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Company already exists.")
    company = Company(
        company_name=data.company_name,
        email=normalized_email,
        owner_full_name=data.owner_full_name,
        password_hash=hash_password(data.password),
    )
    db.add(company)
    await db.commit()
    await db.refresh(company)
    return {"message": "Company registered", "company_id": company.id}


# -----------------------
# Email Verification
# -----------------------
@router.post("/send-verification-code")
async def send_code(email: str = Query(...), db: AsyncSession = Depends(get_db)):
    code = str(datetime.utcnow().timestamp()).split('.')[-1][:6]
    token = VerificationToken(
        email=email.strip().lower(),
        token=code,
        expires_at=datetime.utcnow() + timedelta(minutes=10)
    )
    db.add(token)
    await db.commit()
    await send_verification_email(email, code)
    return {"message": "Verification code sent."}


@router.get("/verify-email")
async def verify_email(email: str, code: str, db: AsyncSession = Depends(get_db)):
    normalized_email = email.strip().lower()
    result = await db.execute(select(VerificationToken).where(
        VerificationToken.email == normalized_email,
        VerificationToken.token == code,
        VerificationToken.expires_at > datetime.utcnow()
    ))
    token = result.scalars().first()
    if not token:
        raise HTTPException(status_code=400, detail="Invalid or expired verification code.")
    await db.delete(token)
    await db.commit()
    return {"message": "Email verified."}


# -----------------------
# Staff Login (Token-Based)
# -----------------------

@router.post("/login/staff")
async def login_staff(payload: StaffLoginRequest, db: AsyncSession = Depends(get_db)):
    normalized_email = payload.email.strip().lower()
    print(f"🔍 Login attempt for: {normalized_email}")
    print(f"🔐 Provided token: {payload.token}")

    result = await db.execute(select(User).where(User.email == normalized_email))
    user = result.scalars().first()

    if not user:
        print("❌ No user found with that email.")
        raise HTTPException(status_code=401, detail="Invalid credentials.")

    print(f"📦 Found user: {user.full_name}")
    print(f"🧠 Stored hashed password: {user.password_hash}")
    print(f"📆 Token expiry: {user.token_expiry}")
    print(f"📆 Current time: {datetime.utcnow()}")

    if not user.token_expiry or user.token_expiry < datetime.utcnow():
        print("❌ Token has expired.")
        raise HTTPException(status_code=401, detail="Invalid or expired token.")

    if not pwd_context.verify(payload.token, user.password_hash):
        print("❌ Token does not match the stored hash.")
        raise HTTPException(status_code=401, detail="Invalid token.")

    print("✅ Token verified successfully!")

    payload_data = {
        "sub": str(user.email),
        "user_id": user.id,
        "role": user.role,
        "exp": datetime.utcnow() + timedelta(minutes=30)
    }
    access_token = jwt.encode(payload_data, SECRET_KEY, algorithm=ALGORITHM)
    print("🎟️ Access token issued.")

    return {"access_token": access_token, "token_type": "bearer"}



# -----------------------
# Company Login
# -----------------------
@router.post("/login/company")
async def login_company(payload: LoginRequest, db: AsyncSession = Depends(get_db)):
    normalized_email = payload.email.strip().lower()
    result = await db.execute(select(Company).where(Company.email == normalized_email))
    company = result.scalars().first()
    if not company or not pwd_context.verify(payload.password, company.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials.")
    payload = {
        "sub": str(company.email),
        "company_id": company.id,
        "role": "company",
        "exp": datetime.utcnow() + timedelta(minutes=60)
    }
    access_token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": access_token, "token_type": "bearer"}


# -----------------------
# Get Current Company
# -----------------------
async def get_current_company(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        result = await db.execute(select(Company).where(Company.email == email.strip().lower()))
        company = result.scalars().first()
        if not company:
            raise HTTPException(status_code=404, detail="Company not found")
        return company
    except JWTError:
        raise HTTPException(status_code=403, detail="Invalid token")

@router.get("/company/me")
async def read_current_company(current_company: Company = Depends(get_current_company)):
    return {
        "id": current_company.id,
        "company_name": current_company.company_name,
        "email": current_company.email,
        "owner_full_name": current_company.owner_full_name,
        "created_at": current_company.created_at,
    }


# -----------------------
# Get Current Staff User
# -----------------------
async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalars().first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=403, detail="Invalid token")

@router.get("/user/me", response_model=UserOut)
async def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user
