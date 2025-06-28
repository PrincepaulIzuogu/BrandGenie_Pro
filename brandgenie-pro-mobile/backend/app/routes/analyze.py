from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import httpx
from app.database import SessionLocal
from app.models.brand import Brand
from app.schemas.brand import BrandCreate, BrandOut
from app.config import OPENROUTER_API_KEY

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/analyze", response_model=BrandOut)
async def analyze_brand(data: BrandCreate, db: Session = Depends(get_db)):
    headers = {
        'Authorization': f'Bearer {OPENROUTER_API_KEY}',
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://brandgenie.pro',
        'X-Title': 'BrandGenie Pro - Onboarding Analysis',
    }
    payload = {
        "model": "openai/gpt-3.5-turbo",
        "messages": [
            {
                "role": "user",
                "content": f"You are a smart assistant. Summarize what the website {data.website} is about. Use a professional and concise tone.",
            }
        ],
        "temperature": 0.7,
    }

    async with httpx.AsyncClient() as client:
        response = await client.post('https://openrouter.ai/api/v1/chat/completions', headers=headers, json=payload)
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Brand analysis failed")

        summary = response.json()['choices'][0]['message']['content']

    brand = Brand(website=data.website, summary=summary)
    db.add(brand)
    db.commit()
    db.refresh(brand)
    return brand

@router.get("/brand/{brand_id}", response_model=BrandOut)
def get_brand(brand_id: int, db: Session = Depends(get_db)):
    brand = db.query(Brand).filter(Brand.id == brand_id).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    return brand
