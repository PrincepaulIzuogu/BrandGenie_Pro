# app/routers/calendar.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import SessionLocal, CalendarEvent, CalendarEventCreate

router = APIRouter()

async def get_db():
    async with SessionLocal() as session:
        yield session

@router.post("/calendar/events")
async def create_calendar_event(event: CalendarEventCreate, db: AsyncSession = Depends(get_db)):
    db_event = CalendarEvent(
        title=event.title,
        description=event.description,
        start_time=event.start_time,
        end_time=event.end_time,
        all_day=event.all_day,
        company_id=event.company_id,
        created_by_user_id=event.created_by_user_id,
        created_by_company_id=event.created_by_company_id
    )
    db.add(db_event)
    await db.commit()
    await db.refresh(db_event)
    return db_event

@router.get("/calendar/events")
async def get_calendar_events(company_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(CalendarEvent).where(CalendarEvent.company_id == company_id)
    )
    return result.scalars().all()

@router.delete("/calendar/events/{event_id}")
async def delete_calendar_event(event_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(CalendarEvent).where(CalendarEvent.id == event_id)
    )
    event = result.scalars().first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    await db.delete(event)
    await db.commit()
    return {"message": "Event deleted"}
