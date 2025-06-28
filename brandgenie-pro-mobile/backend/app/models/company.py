from sqlalchemy import Column, Integer, String
from app.database import Base
from sqlalchemy.orm import relationship
import uuid  # For generating unique company codes

class Company(Base):
    __tablename__ = 'companies'
    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    owner_full_name = Column(String, nullable=False)
    reset_code = Column(String, nullable=True)
    company_code = Column(String, unique=True, nullable=False, default=str(uuid.uuid4()))  # ✅ ADD THIS LINE

        # Establish back-reference with users
    users = relationship("User", back_populates="company")
