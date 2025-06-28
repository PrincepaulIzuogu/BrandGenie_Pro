# app/routers/drive.py

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Form
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from datetime import datetime
from app.database import DriveFile, SessionLocal, DriveFileCreate, DriveFileOut, DocumentPermission
from sqlalchemy.future import select
import os

router = APIRouter(prefix="/api/drive", tags=["Drive"])

# Dependency
async def get_db():
    async with SessionLocal() as session:
        yield session

# -------------------------
# List files for a company
# -------------------------
@router.get("/files/{company_id}", response_model=List[DriveFileOut])
async def list_files(company_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(DriveFile).where(DriveFile.company_id == company_id))
    return result.scalars().all()

# ---------------------
# Upload new file(s)
# ---------------------
@router.post("/upload", response_model=List[DriveFileOut])
async def upload_files(
    company_id: int = Form(...),
    uploaded_by_user_id: Optional[int] = Form(None),
    files: List[UploadFile] = File(...),
    db: AsyncSession = Depends(get_db),
):
    uploaded_entries = []

    for file in files:
        contents = await file.read()
        size = len(contents)

        # Extract folder path and file name
        full_path = file.filename.replace("\\", "/")
        folder_path = os.path.dirname(full_path)
        filename = os.path.basename(full_path)

        file_entry = DriveFile(
            filename=filename,
            filetype=file.content_type or "application/octet-stream",
            is_folder=False,
            path=folder_path + '/' if folder_path else "My Drive/",
            size=size,
            company_id=company_id,
            uploaded_by_user_id=uploaded_by_user_id,
            created_at=datetime.utcnow(),
            modified=datetime.utcnow(),
        )
        db.add(file_entry)
        uploaded_entries.append(file_entry)

    await db.commit()
    return uploaded_entries

# ---------------------
# Create folder
# ---------------------
@router.post("/create-folder", response_model=DriveFileOut)
async def create_folder(
    data: DriveFileCreate,
    db: AsyncSession = Depends(get_db)
):
    folder = DriveFile(**data.dict())
    folder.is_folder = True
    folder.created_at = datetime.utcnow()
    folder.modified = datetime.utcnow()
    db.add(folder)
    await db.commit()
    return folder

# ---------------------
# Delete file or folder
# ---------------------
@router.delete("/delete/{file_id}")
async def delete_file(file_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(DriveFile).where(DriveFile.id == file_id))
    file = result.scalar_one_or_none()

    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    await db.delete(file)
    await db.commit()
    return {"detail": "Deleted"}

# ---------------------
# Rename file or folder
# ---------------------
@router.put("/rename/{file_id}", response_model=DriveFileOut)
async def rename_file(
    file_id: int,
    new_name: str = Form(...),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(DriveFile).where(DriveFile.id == file_id))
    file = result.scalar_one_or_none()

    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    file.filename = new_name
    file.modified = datetime.utcnow()
    await db.commit()
    return file



@router.get("/user-documents/{user_id}", response_model=List[DriveFileOut])
async def get_documents_for_user(user_id: int, db: AsyncSession = Depends(get_db)):
    now = datetime.utcnow()

    result = await db.execute(
        select(DriveFile)
        .join(DocumentPermission)
        .where(
            DocumentPermission.user_id == user_id,
            DocumentPermission.access_start <= now,
            DocumentPermission.access_end >= now
        )
    )
    documents = result.scalars().all()
    return documents


# ---------------------
# List documents assigned to a user
# ---------------------
@router.get("/permissions/{user_id}", response_model=List[DriveFileOut])
async def get_user_documents(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(DriveFile)
        .join(DocumentPermission)
        .where(DocumentPermission.user_id == user_id)
    )
    documents = result.scalars().all()
    return documents


