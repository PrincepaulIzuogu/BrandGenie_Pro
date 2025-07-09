# routers/tools.py
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from app.database import Tool, ToolCreate, ToolOut, ToolPermissionOut, ToolPermission, SessionLocal

router = APIRouter(prefix="/api/tools", tags=["Tools"])

async def get_db():
    async with SessionLocal() as session:
        yield session

@router.get("/", response_model=List[ToolOut])
async def get_tools(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Tool))
    tools = result.scalars().all()

    # Remove duplicates by title (case-insensitive)
    seen_titles = set()
    unique_tools = []
    for tool in tools:
        title_lower = tool.title.lower()
        if title_lower not in seen_titles:
            seen_titles.add(title_lower)
            unique_tools.append(tool)

    return unique_tools


@router.post("/", response_model=ToolOut)
async def create_tool(payload: ToolCreate, db: AsyncSession = Depends(get_db)):
    tool = Tool(**payload.dict())
    db.add(tool)
    await db.commit()
    await db.refresh(tool)
    return tool


@router.get("/permissions/tools", response_model=List[ToolPermissionOut])
async def get_tool_permissions(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ToolPermission))
    return result.scalars().all()


