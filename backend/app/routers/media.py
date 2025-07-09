from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Optional
import shutil
import os
from datetime import datetime
from app.database import SessionLocal, MediaAsset

router = APIRouter()

MEDIA_UPLOAD_DIR = "uploaded_media"
os.makedirs(MEDIA_UPLOAD_DIR, exist_ok=True)

async def get_db():
    async with SessionLocal() as session:
        yield session

@router.post("/api/media/upload")
async def upload_media_file(
    file: UploadFile = File(...),
    uploaded_by_user_id: Optional[int] = Form(None),
    uploaded_by_company_id: Optional[int] = Form(None),
    db: AsyncSession = Depends(get_db),
):
    # Validate file type
    allowed_types = ["video/mp4", "image/png", "image/jpeg"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    filename = f"{timestamp}_{file.filename}"
    filepath = os.path.join(MEDIA_UPLOAD_DIR, filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Save metadata in DB
    asset = MediaAsset(
        filename=filename,
        filetype=file.content_type,
        uploaded_by_user_id=uploaded_by_user_id,
        uploaded_by_company_id=uploaded_by_company_id,
    )
    db.add(asset)
    await db.commit()
    await db.refresh(asset)

    return {
        "message": "Upload successful",
        "filename": filename,
        "file_url": f"/media/{filename}"  # ✅ Corrected path
    }
