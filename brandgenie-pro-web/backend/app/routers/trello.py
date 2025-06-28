from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import (
    SessionLocal, KanbanColumn, KanbanTask,
    KanbanColumnCreate, KanbanColumnOut,
    KanbanTaskCreate, KanbanTaskOut
)

router = APIRouter(prefix="/trello")


async def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        await db.close()

# Create Column
@router.post("/columns", response_model=KanbanColumnOut)
async def create_column(column: KanbanColumnCreate, db: AsyncSession = Depends(get_db)):
    new_column = KanbanColumn(**column.dict())
    db.add(new_column)
    await db.commit()
    await db.refresh(new_column)
    return new_column

# Get Columns (with tasks)
@router.get("/columns", response_model=list[KanbanColumnOut])
async def get_columns(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(KanbanColumn).where(KanbanColumn.company_id == 1))
    columns = result.scalars().all()

    # Inject default columns and tasks if none exist
    if not columns:
        default_data = {
            "To Do": ["Design homepage", "Write email copy"],
            "In Progress": ["Prepare slide deck"],
            "Done": [],
        }

        for title, task_list in default_data.items():
            new_col = KanbanColumn(title=title, company_id=1)
            db.add(new_col)
            await db.flush()  # So we get new_col.id before commit

            for content in task_list:
                db.add(KanbanTask(content=content, column_id=new_col.id, company_id=1))

        await db.commit()
        result = await db.execute(select(KanbanColumn).where(KanbanColumn.company_id == 1))
        columns = result.scalars().all()

    return columns




# Create Task
@router.post("/tasks", response_model=KanbanTaskOut)
async def create_task(task: KanbanTaskCreate, db: AsyncSession = Depends(get_db)):
    new_task = KanbanTask(**task.dict())
    db.add(new_task)
    await db.commit()
    await db.refresh(new_task)
    return new_task

# Get Tasks by Column ID
@router.get("/columns/{column_id}/tasks", response_model=list[KanbanTaskOut])
async def get_tasks(column_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(KanbanTask).where(KanbanTask.column_id == column_id))
    return result.scalars().all()

# Delete Task
@router.delete("/tasks/{task_id}")
async def delete_task(task_id: int, db: AsyncSession = Depends(get_db)):
    task = await db.get(KanbanTask, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    await db.delete(task)
    await db.commit()
    return {"message": "Task deleted"}

# Delete Column
@router.delete("/columns/{column_id}")
async def delete_column(column_id: int, db: AsyncSession = Depends(get_db)):
    column = await db.get(KanbanColumn, column_id)
    if not column:
        raise HTTPException(status_code=404, detail="Column not found")
    await db.delete(column)
    await db.commit()
    return {"message": "Column deleted"}
