# app/routers/messages.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import SessionLocal, Message, MessageCreate, MessageOut, User

router = APIRouter()

async def get_db():
    async with SessionLocal() as session:
        yield session

@router.post("/messages", response_model=MessageOut)
async def send_message(message: MessageCreate, db: AsyncSession = Depends(get_db)):
    db_message = Message(team_id=message.team_id, sender_id=message.sender_id, content=message.content)
    db.add(db_message)
    await db.commit()
    await db.refresh(db_message)
    return db_message

@router.get("/messages", response_model=list[MessageOut])
async def get_team_messages(team_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Message).where(Message.team_id == team_id).order_by(Message.created_at))
    return result.scalars().all()

@router.get("/chat/senders")
async def get_chat_senders(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.company_id == select(User.company_id).where(User.id == user_id).scalar_subquery()))
    users = result.scalars().all()
    return [{"id": u.id, "name": u.full_name} for u in users if u.id != user_id]
