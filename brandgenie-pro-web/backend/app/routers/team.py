# app/routers/team.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import SessionLocal, Team, TeamCreate, TeamOut

router = APIRouter()

async def get_db():
    async with SessionLocal() as session:
        yield session

@router.post("/teams", response_model=TeamOut)
async def create_team(team: TeamCreate, db: AsyncSession = Depends(get_db)):
    db_team = Team(company_id=team.company_id, name=team.name)
    db.add(db_team)
    await db.commit()
    await db.refresh(db_team)
    return db_team

@router.get("/teams", response_model=list[TeamOut])
async def list_teams(company_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Team).where(Team.company_id == company_id))
    return result.scalars().all()
