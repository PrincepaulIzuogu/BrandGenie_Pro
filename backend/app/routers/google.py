from fastapi import APIRouter

router = APIRouter()

@router.get("/google-status")
def google_status():
    return {"message": "Google router is working"}

