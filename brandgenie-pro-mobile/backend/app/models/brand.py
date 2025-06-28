from sqlalchemy import Column, Integer, String, Text
from app.database import Base

class Brand(Base):
    __tablename__ = 'brands'
    id = Column(Integer, primary_key=True, index=True)
    website = Column(String, nullable=False)
    summary = Column(Text, nullable=False)
