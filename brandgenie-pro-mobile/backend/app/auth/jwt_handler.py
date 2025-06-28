# app/auth/jwt_handler.py

from datetime import datetime, timedelta
from jose import jwt
from app.config import SECRET_KEY, ALGORITHM

def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=30)) -> str:
    """
    Create a JWT access token.

    :param data: payload data (e.g. {"sub": str(user_id), "role": role})
    :param expires_delta: timedelta until token expiration (default 30 minutes)
    :return: encoded JWT string
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str) -> dict:
    """
    Decode and validate a JWT access token.

    :param token: the JWT string
    :return: the decoded payload dict
    :raises: jose.JWTError on invalid/expired tokens
    """
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
