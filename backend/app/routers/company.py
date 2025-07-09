# app/routers/company.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import SessionLocal, Company, CompanyCreate

router = APIRouter()

async def get_db():
    async with SessionLocal() as session:
        yield session

@router.post("/company/register")
async def register_company(data: CompanyCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Company).where(Company.email == data.email))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Company already exists.")
    new_company = Company(
        company_name=data.company_name,
        email=data.email,
        owner_full_name=data.owner_full_name,
        password_hash=data.password  # assumes hash is done externally
    )
    db.add(new_company)
    await db.commit()
    await db.refresh(new_company)
    return {"message": "Company registered", "company_id": new_company.id}

@router.get("/company/list")
async def list_companies(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Company))
    return result.scalars().all()
