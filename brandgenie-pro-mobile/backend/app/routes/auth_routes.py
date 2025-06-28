from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError
import uuid

from app.database import SessionLocal
from app.models.user import User
from app.models.company import Company
from app.schemas.auth import (
    UserRegister,
    CompanyRegister,
    UserLogin,
    UserResponse,
    CompanyResponse,
)
from app.auth.jwt_handler import create_access_token, decode_access_token
from app.auth.password_handler import hash_password, verify_password

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login/user")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# app/routes/auth_routes.py

@router.post("/register-user/company", response_model=dict)
def register_user_company(data: UserRegister, db: Session = Depends(get_db)):
    # 1) ensure email unused
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(400, "Email already registered")

    # 2) resolve company by code or by numeric ID
    if data.company_code:
        company = db.query(Company).filter(Company.company_code == data.company_code).first()
        if not company:
            raise HTTPException(404, "Invalid company code")
        resolved_id   = company.id
        resolved_code = data.company_code

    elif data.company_id:
        company = db.query(Company).filter(Company.id == data.company_id).first()
        if not company:
            raise HTTPException(404, "Invalid company ID")
        resolved_id   = company.id
        resolved_code = company.company_code

    else:
        raise HTTPException(400, "Must provide company_id or company_code")

    # 3) create the user, storing both fields
    new_user = User(
        full_name     = data.full_name,
        email         = data.email,
        password_hash = hash_password(data.password),
        role          = "company_user",
        company_id    = resolved_id,
        company_code  = resolved_code,   # ← NEW
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "Company user registered successfully"}



@router.post("/register-user/independent", response_model=dict)
def register_user_independent(data: UserRegister, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(400, "Email already registered")
    new_user = User(
        full_name=data.full_name,
        email=data.email,
        password_hash=hash_password(data.password),
        role="independent",
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Independent user registered successfully"}


@router.post("/register/company", response_model=dict)
def register_company(data: CompanyRegister, db: Session = Depends(get_db)):
    if db.query(Company).filter(Company.email == data.email).first():
        raise HTTPException(400, "Email already registered")

    company_code = str(uuid.uuid4())
    new_company = Company(
        company_name=data.company_name,
        email=data.email,
        password_hash=hash_password(data.password),
        owner_full_name=data.owner_full_name,
        company_code=company_code,
    )
    db.add(new_company)
    db.commit()
    db.refresh(new_company)

    return {"message": "Company registered successfully", "company_code": company_code}


@router.post("/login/user", response_model=dict)
def login_user(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(401, "Invalid credentials")
    token = create_access_token({"sub": str(user.id), "role": user.role})
    return {"access_token": token, "token_type": "bearer"}


@router.post("/login/company", response_model=dict)
def login_company(data: UserLogin, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.email == data.email).first()
    if not company or not verify_password(data.password, company.password_hash):
        raise HTTPException(401, "Invalid credentials")
    token = create_access_token({"sub": str(company.id), "role": "company"})
    return {"access_token": token, "token_type": "bearer"}


@router.get("/get-company-code", response_model=dict)
def get_company_code(email: str, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.email == email).first()
    if not company:
        raise HTTPException(404, "Company not found.")
    return {"company_code": company.company_code}


# ——— New endpoints for fetching the currently-logged in profile ———

@router.get("/user/me", response_model=UserResponse)
def read_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    # 1️⃣ Decode & validate JWT
    try:
        payload = decode_access_token(token)
        user_id = int(payload.get("sub"))
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    # 2️⃣ Load the user
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 3️⃣ If they belong to a company, look up its code
    company_code = None
    if user.company_id:
        company = db.query(Company).get(user.company_id)
        company_code = company.company_code if company else None

    # 4️⃣ Return exactly the fields your schema expects
    return {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role,
        "company_id": user.company_id,
        "company_code": company_code,
    }

@router.get("/company/me", response_model=CompanyResponse)
def read_current_company(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    try:
        payload = decode_access_token(token)
        company_id = int(payload.get("sub"))
    except JWTError:
        raise HTTPException(401, "Invalid or expired token")

    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(404, "Company not found")
    return company
