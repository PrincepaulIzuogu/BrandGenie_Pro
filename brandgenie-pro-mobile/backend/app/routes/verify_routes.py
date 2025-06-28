from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random
from app.database import SessionLocal
from app.models.verification import VerificationCode
from app.models.user import User
from app.models.company import Company
from app.schemas.verification import VerifyCodeRequest
from app.utils.email_utils import send_email

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/send-verification-code")
def send_verification_code(email: str, db: Session = Depends(get_db)):
    verification_code = str(random.randint(100000, 999999))
    verification = VerificationCode(
        email=email,
        code=verification_code,
        expires_at=datetime.utcnow() + timedelta(minutes=15)
    )
    db.add(verification)
    db.commit()

    send_email(
        to_email=email,
        subject="Your BrandGenie Pro Verification Code",
        body=f"Your verification code is: {verification_code}"
    )

    return {"message": "Verification code sent"}

@router.post("/verify-email")
def verify_email(data: VerifyCodeRequest, db: Session = Depends(get_db)):
    verification = db.query(VerificationCode).filter(
        VerificationCode.email == data.email,
        VerificationCode.code == data.code,
        VerificationCode.expires_at > datetime.utcnow()
    ).first()

    if not verification:
        raise HTTPException(status_code=400, detail="Invalid or expired verification code")

    user = db.query(User).filter(User.email == data.email).first()

    if not user:
        user = db.query(Company).filter(Company.email == data.email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User or Company not found")

    user.is_verified = True
    db.delete(verification)
    db.commit()
    return {"message": "Email verified successfully"}
