# app/routers/groups.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List, Optional

from app.database import (
    SessionLocal,
    Group,
    GroupMember,
    GroupMemberOut,
    GroupCreate,
    GroupOut,
    GroupMessage,
    GroupMessageCreate,
    GroupMessageOut,
    User,
    Company,
)

router = APIRouter(prefix="/api/groups", tags=["Groups"])

# Dependency to get DB session
async def get_db():
    async with SessionLocal() as session:
        yield session

# ----------------------
# GET: List All Groups
# ----------------------
@router.get("", response_model=List[GroupOut])
async def get_groups(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Group).options(
            selectinload(Group.members).selectinload(GroupMember.user)
        )
    )
    groups = result.scalars().unique().all()

    output = []

    for group in groups:
        member_out = []
        for member in group.members:
            if member.user:
                member_out.append(GroupMemberOut(
                    id=member.id,
                    user_id=member.user_id,
                    full_name=member.user.full_name
                ))

        output.append(GroupOut(
            id=group.id,
            name=group.name,
            created_at=group.created_at,
            members=member_out
        ))

    return output


# ----------------------
# POST: Create New Group
# ----------------------
@router.post("", response_model=GroupOut)
async def create_group(data: GroupCreate, db: AsyncSession = Depends(get_db)):
    group = Group(
        name=data.name,
        company_id=data.company_id,
        created_by_user_id=data.created_by_user_id,
        created_by_company_id=data.created_by_company_id
    )
    db.add(group)
    await db.commit()
    await db.refresh(group)

    for uid in data.member_ids or []:
        member = GroupMember(group_id=group.id, user_id=uid)
        db.add(member)

    await db.commit()
    await db.refresh(group, attribute_names=["members"])
    return group

# ----------------------
# GET: Messages for a Group
# ----------------------
@router.get("/messages/{group_id}", response_model=List[GroupMessageOut])
async def get_group_messages(group_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(GroupMessage).where(GroupMessage.group_id == group_id).order_by(GroupMessage.timestamp)
    )
    messages = result.scalars().all()

    enriched = []
    for msg in messages:
        sender_name = None
        if msg.sender_user_id:
            user_result = await db.execute(select(User).where(User.id == msg.sender_user_id))
            user = user_result.scalar_one_or_none()
            sender_name = user.full_name if user else None
        elif msg.sender_company_id:
            company_result = await db.execute(select(Company).where(Company.id == msg.sender_company_id))
            company = company_result.scalar_one_or_none()
            sender_name = company.company_name if company else None

        enriched.append(GroupMessageOut(
            id=msg.id,
            group_id=msg.group_id,
            content=msg.content,
            timestamp=msg.timestamp,
            sender_user_id=msg.sender_user_id,
            sender_company_id=msg.sender_company_id,
            sender_name=sender_name
        ))

    return enriched

# ----------------------
# GET: Single Group by ID
# ----------------------
@router.get("/{group_id}", response_model=GroupOut)
async def get_group_by_id(group_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Group).where(Group.id == group_id).options(
            selectinload(Group.members).selectinload(GroupMember.user)
        )
    )
    group = result.scalar_one_or_none()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    member_out = []
    for member in group.members:
        if member.user:
            member_out.append(GroupMemberOut(
                id=member.id,
                user_id=member.user_id,
                full_name=member.user.full_name
            ))

    return GroupOut(
        id=group.id,
        name=group.name,
        created_at=group.created_at,
        members=member_out
    )


# ----------------------
# POST: Send a Group Message
# ----------------------
@router.post("/messages", response_model=GroupMessageOut)
async def send_group_message(payload: GroupMessageCreate, db: AsyncSession = Depends(get_db)):
    msg = GroupMessage(
        group_id=payload.group_id,
        content=payload.content,
        sender_user_id=payload.sender_user_id,
        sender_company_id=payload.sender_company_id
    )
    db.add(msg)
    await db.commit()
    await db.refresh(msg)

    sender_name = None
    if msg.sender_user_id:
        user_result = await db.execute(select(User).where(User.id == msg.sender_user_id))
        user = user_result.scalar_one_or_none()
        sender_name = user.full_name if user else None
    elif msg.sender_company_id:
        company_result = await db.execute(select(Company).where(Company.id == msg.sender_company_id))
        company = company_result.scalar_one_or_none()
        sender_name = company.company_name if company else None

    return GroupMessageOut(
        id=msg.id,
        group_id=msg.group_id,
        content=msg.content,
        timestamp=msg.timestamp,
        sender_user_id=msg.sender_user_id,
        sender_company_id=msg.sender_company_id,
        sender_name=sender_name
    )


# ----------------------
# GET: Groups for a specific user
# ----------------------
@router.get("/user/{user_id}", response_model=List[GroupOut])
async def get_groups_for_user(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Group)
        .join(GroupMember)
        .where(GroupMember.user_id == user_id)
        .options(selectinload(Group.members).selectinload(GroupMember.user))
    )
    groups = result.scalars().unique().all()

    output = []

    for group in groups:
        member_out = []
        for member in group.members:
            if member.user:
                member_out.append(GroupMemberOut(
                    id=member.id,
                    user_id=member.user_id,
                    full_name=member.user.full_name
                ))

        output.append(GroupOut(
            id=group.id,
            name=group.name,
            created_at=group.created_at,
            members=member_out
        ))

    return output

