# backend/main.py
from fastapi import FastAPI, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from database import models, database

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=database.engine)

class NameInput(BaseModel):
    name: str

@app.post("/submit-name")
def submit_name(payload: NameInput, db: Session = Depends(database.get_db)):
    name_entry = models.NameEntry(name=payload.name)
    db.add(name_entry)
    db.commit()
    db.refresh(name_entry)
    return {"message": f"Hello, {name_entry.name}!"}
