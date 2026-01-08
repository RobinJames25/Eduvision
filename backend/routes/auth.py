from fastapi import APIRouter, Depends, Response, Request, HTTPException
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.schemas.auth import SignUpRequest, SignInRequest, AuthResponse
from backend.services.auth_service import signup_user, signin_user
from backend.core.security import verify_token
from backend.models.user import User

router = APIRouter(tags=["Authentication"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Helper to set the cookie consistently
def set_auth_cookie(response: Response, token: str):
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=3600 * 24,
        samesite="lax",
        secure=False
    )


@router.post("/signup")
def signup(payload: SignUpRequest, response: Response, db: Session = Depends(get_db)):
    user, token = signup_user(
        db,
        email=payload.email,
        full_name=payload.full_name,
        password=payload.password
    )
    set_auth_cookie(response, token)
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
    }


@router.post("/signin")
def signin(payload: SignInRequest, response: Response, db: Session = Depends(get_db)):
    user, token = signin_user(db, payload.email, payload.password)
    set_auth_cookie(response, token)
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name
    }

@router.post("/signout")
def signout(response: Response):
    response.delete_cookie("access_token")
    return {
        "message": "Successfully logged out"
    }

@router.get("/me")
def get_me(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    payload = verify_token(token)
    user = db.query(User).filter(User.id == payload.get("sub")).first()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name
    }