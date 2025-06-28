from pydantic import BaseModel

class BrandCreate(BaseModel):
    website: str

class BrandOut(BaseModel):
    id: int
    website: str
    summary: str

    class Config:
        orm_mode = True
