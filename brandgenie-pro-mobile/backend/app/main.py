from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth_routes, analyze, verify_routes, password_reset_routes  # ✅ added password reset
from app.database import Base, engine

app = FastAPI()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Allow all origins (frontend localhost etc.)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create all tables in the database
Base.metadata.create_all(bind=engine)

# Include all routers
app.include_router(auth_routes.router, prefix="/api", tags=["auth"])
app.include_router(analyze.router, prefix="/api", tags=["analyze"])
app.include_router(verify_routes.router, prefix="/api", tags=["verify"])
app.include_router(password_reset_routes.router, prefix="/api", tags=["password_reset"])  # ✅ include password reset

@app.get("/")
def root():
    return {"message": "BrandGenie Pro Backend Running with Authentication, Analyze, Email Verification, and Password Reset"}
