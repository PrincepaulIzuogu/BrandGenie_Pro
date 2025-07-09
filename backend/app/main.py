# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database import Base, engine
from app.routers import auth, company, team, messages, copilot, canva, google, calendar, media, trello, drive, projects, users, groups, tools, adduser

app = FastAPI(title="BrandGenie Pro Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded files
app.mount("/media", StaticFiles(directory="uploaded_media"), name="media")

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get("/")
def health_check():
    return {"status": "Backend is running"}


# Include all routers
app.include_router(auth.router, prefix="/api")
app.include_router(company.router, prefix="/api")
app.include_router(team.router, prefix="/api")
app.include_router(messages.router, prefix="/api")
app.include_router(copilot.router, prefix="/api")
app.include_router(canva.router)
app.include_router(google.router)
app.include_router(calendar.router, prefix="/api")
app.include_router(media.router)
app.include_router(trello.router, prefix="/api")
app.include_router(drive.router)
app.include_router(projects.router)
app.include_router(users.router)
app.include_router(groups.router)
app.include_router(tools.router)
app.include_router(adduser.router)
