
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy.future import select
from typing import List
import logging
from sqlalchemy import delete
from datetime import datetime, timedelta

from app.database import (
    SessionLocal,
    User,
    UserOut,
    Group,
    Tool,
    Project,
    DriveFile,
    GroupMember,
    ToolPermission,
    ProjectMember,
    DocumentPermission,
    EditUserRequest
)

router = APIRouter(prefix="/api/users", tags=["Users"])


# Dependency for async DB session
async def get_db():
    async with SessionLocal() as session:
        yield session


def calculate_end(start: datetime, value: int, unit: str) -> datetime:
    if unit == "hour":
        return start + timedelta(hours=value)
    elif unit == "day":
        return start + timedelta(days=value)
    elif unit == "month":
        return start + timedelta(days=30 * value)
    elif unit == "year":
        return start + timedelta(days=365 * value)
    else:
        raise ValueError(f"Invalid unit: {unit}")


# List all users (basic)
@router.get("", response_model=List[UserOut])
async def list_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User))
    return result.scalars().all()


# List users by company with detailed info
@router.get("/by-company/{company_id}", response_model=List[UserOut])
async def get_users_by_company(company_id: int, db: AsyncSession = Depends(get_db)):
    stmt = select(User).where(User.company_id == company_id).options(
        selectinload(User.group_memberships).selectinload(GroupMember.group),
        selectinload(User.tool_permissions).selectinload(ToolPermission.tool),
        selectinload(User.project_memberships).selectinload(ProjectMember.project),
        selectinload(User.document_permissions).selectinload(DocumentPermission.document),
    )
    users = (await db.execute(stmt)).scalars().all()

    results = []
    for u in users:
        results.append(UserOut(
            id=u.id,
            email=u.email,
            full_name=u.full_name,
            role=u.role,
            is_active=u.is_active,
            contract_expiry=u.contract_expiry,
            groups=[gm.group.name for gm in u.group_memberships],
            tools=[{
                "name": tp.tool.title,
                "access_start": tp.access_start,
                "access_end": tp.access_end
            } for tp in u.tool_permissions],
            projects=[{
                "name": pm.project.name,
                "access_start": pm.access_start,
                "access_end": pm.access_end
            } for pm in u.project_memberships],
            documents=[{
                "name": dp.document.path,
                "access_start": dp.access_start,
                "access_end": dp.access_end
            } for dp in u.document_permissions],
        ))

    return results



@router.delete("/{user_id}")
async def delete_user(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    await db.delete(user)
    await db.commit()

    return {"message": f"User with ID {user_id} deleted successfully."}

@router.put("/{user_id}")
async def edit_user(user_id: int, data: EditUserRequest, db: AsyncSession = Depends(get_db)):
    logging.info(f"Received edit request for user_id={user_id} with data: {data}")
    
    # Fetch user
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    now = datetime.utcnow()
    user.contract_expiry = calculate_end(now, data.contract_duration.value, data.contract_duration.unit)

    # Clear previous assignments
    await db.execute(delete(GroupMember).where(GroupMember.user_id == user_id))
    await db.execute(delete(ToolPermission).where(ToolPermission.user_id == user_id))
    await db.execute(delete(ProjectMember).where(ProjectMember.user_id == user_id))
    await db.execute(delete(DocumentPermission).where(DocumentPermission.user_id == user_id))

    # Groups
    for group_name in data.groups:
        group_result = await db.execute(select(Group).where(Group.name == group_name))
        group = group_result.scalars().first()
        if group:
            db.add(GroupMember(user_id=user_id, group_id=group.id))

    # Tools
    for t in data.tools:
        tool_result = await db.execute(select(Tool).where(Tool.title == t.name))
        tool = tool_result.scalars().first()
        if tool:
            access_end = calculate_end(now, t.duration.value, t.duration.unit)
            db.add(ToolPermission(
                user_id=user_id,
                tool_id=tool.id,
                access_start=now,
                access_end=access_end
            ))

    # Projects
    for p in data.projects:
        project_result = await db.execute(select(Project).where(Project.name == p.name))
        project = project_result.scalars().first()
        if project:
            access_end = calculate_end(now, p.duration.value, p.duration.unit)
            db.add(ProjectMember(
                user_id=user_id,
                project_id=project.id,
                access_start=now,
                access_end=access_end
            ))

    # Documents
    for d in data.documents:
        doc_result = await db.execute(select(DriveFile).where(DriveFile.path == d.name))
        doc = doc_result.scalars().first()
        if doc:
            access_end = calculate_end(now, d.duration.value, d.duration.unit)
            db.add(DocumentPermission(
                user_id=user_id,
                document_id=doc.id,
                access_start=now,
                access_end=access_end
            ))

    await db.commit()
    return {"message": "User updated successfully"}