# backend/database/models.py
from sqlalchemy import Column, Integer, String
from database.database import Base

class NameEntry(Base):
    __tablename__ = "names"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
