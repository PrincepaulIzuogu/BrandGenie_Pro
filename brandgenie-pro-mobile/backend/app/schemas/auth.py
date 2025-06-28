from pydantic import BaseModel, EmailStr
from typing import Optional

class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    company_id: Optional[int] = None
    company_code: Optional[str] = None 

class CompanyRegister(BaseModel):
    company_name: str
    email: EmailStr
    password: str
    owner_full_name: str

class CompanyRegisterResponse(BaseModel):
    message: str
    company_code: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# app/schemas/auth.py
from pydantic import BaseModel, EmailStr
from typing import Optional

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str
    company_id: Optional[int]
    company_code: Optional[str] = None   # ← add this field

    class Config:
        orm_mode = True


class CompanyResponse(BaseModel):
    id: int
    company_name: str
    email: EmailStr
    owner_full_name: str
    company_code: str

    class Config:
        orm_mode = True
