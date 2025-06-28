from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.user import User
from app.models.company import Company
from app.utils.email_utils import send_email
from app.schemas.password_reset import ForgotPasswordRequest, ResetPasswordRequest
import random
from passlib.context import CryptContext

router = APIRouter()

# Initialize password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Helper to generate a random 6-digit code
def generate_code():
    return str(random.randint(100000, 999999))

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ===============================
# Forgot Password for User
# ===============================
@router.post("/forgot-password/user")
def forgot_password_user(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    code = generate_code()
    user.reset_code = code
    db.commit()

    send_email(
        to_email=user.email,
        subject="Password Reset Code - BrandGenie",
        body=f"Your reset code is: {code}"
    )

    return {"message": "Reset code sent successfully."}

# ===============================
# Forgot Password for Company
# ===============================
@router.post("/forgot-password/company")
def forgot_password_company(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.email == request.email).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found.")

    code = generate_code()
    company.reset_code = code
    db.commit()

    send_email(
        to_email=company.email,
        subject="Password Reset Code - BrandGenie",
        body=f"Your reset code is: {code}"
    )

    return {"message": "Reset code sent successfully."}

# ===============================
# Reset Password for User
# ===============================
@router.post("/reset-password/user")
def reset_password_user(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user or user.reset_code != request.code:
        raise HTTPException(status_code=400, detail="Invalid reset code or user not found.")

    # Hash the new password before saving it
    hashed_password = pwd_context.hash(request.new_password)

    # Update the user's password hash
    user.password = hashed_password
    user.reset_code = None
    db.commit()

    return {"message": "Password reset successful."}

# ===============================
# Reset Password for Company
# ===============================
@router.post("/reset-password/company")
def reset_password_company(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.email == request.email).first()
    if not company or company.reset_code != request.code:
        raise HTTPException(status_code=400, detail="Invalid reset code or company not found.")

    # Hash the new password before saving it
    hashed_password = pwd_context.hash(request.new_password)

    # Update the company's password hash
    company.password_hash = hashed_password
    company.reset_code = None
    db.commit()

    return {"message": "Password reset successful."}
