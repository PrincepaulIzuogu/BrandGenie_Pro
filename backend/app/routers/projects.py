from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List

from app.database import (
    SessionLocal,
    Project,
    ProjectMember,
    ProjectCreate,
    ProjectOut,
    UserOut
)

router = APIRouter(prefix="/api/projects", tags=["Projects"])

# Dependency
async def get_db():
    async with SessionLocal() as session:
        yield session

# ----------------------
# List All Projects
# ----------------------
@router.get("", response_model=List[ProjectOut])
async def get_projects(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Project).options(
        selectinload(Project.members).selectinload(ProjectMember.user),
    ))
    projects = result.scalars().unique().all()

    project_list = []

    for project in projects:
        members_out = []
        for member in project.members:
            user = member.user
            members_out.append(UserOut(
                id=user.id,
                email=user.email,
                full_name=user.full_name,
                role=user.role,
                is_active=user.is_active,
                contract_expiry=user.contract_expiry,
                groups=[],
                tools=[],
                projects=[],
                documents=[]
            ))
        
        project_list.append(ProjectOut(
            id=project.id,
            name=project.name,
            end_date=project.end_date,
            status=project.status,
            company_id=project.company_id,
            created_by_user_id=project.created_by_user_id,
            created_by_company_id=project.created_by_company_id,
            created_at=project.created_at,
            members=members_out
        ))

    return project_list

# ----------------------
# Create New Project
# ----------------------
@router.post("", response_model=ProjectOut)
async def create_project(data: ProjectCreate, db: AsyncSession = Depends(get_db)):
    project = Project(
        name=data.name,
        end_date=data.end_date,
        status=data.status,
        company_id=data.company_id,
        created_by_user_id=data.created_by_user_id,
        created_by_company_id=data.created_by_company_id
    )
    db.add(project)
    await db.commit()
    await db.refresh(project)

    # Add members
    for user_id in data.member_ids:
        member = ProjectMember(project_id=project.id, user_id=user_id)
        db.add(member)

    await db.commit()
    await db.refresh(project, attribute_names=["members"])
    return project
