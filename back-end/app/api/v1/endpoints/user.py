from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app import db
from app.models.models import User
from app.db.session import SessionLocal, get_db  # Import the session
import hashlib
import os
from jose import JWTError, jwt
router = APIRouter()
db = SessionLocal()
class UserSignup(BaseModel):
    email: str
    password: str
    username: str

class UserLogin(BaseModel):
    email: str
    password: str

def hash_password(password: str, salt: bytes) -> str:
    """Hash password with SHA-256 and salt"""
    return hashlib.sha256(salt + password.encode()).hexdigest()

@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(user: UserSignup, db: Session = Depends(get_db)):
    # Normalize email
    email = user.email.lower()
    
    # Check if email exists
    existing_user = db.query(User).filter_by(email=email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Generate salt and hash password
    salt = os.urandom(16)  # 16 random bytes
    hashed_pw = hash_password(user.password, salt)
    
    # Create new user
    new_user = User(
        email=email,
        password=hashed_pw,
        username=user.username,
        salt=salt.hex()  # Store salt as hex string
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"message": "User created successfully"}

SECRET_KEY = "your-secret-key-here"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/login")
async def login(user: UserLogin, db: Session = Depends(get_db)):
    # Normalize email
    email = user.email.lower()
    
    # Find user
    db_user = db.query(User).filter_by(email=email).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Convert hex salt back to bytes
    try:
        salt = bytes.fromhex(db_user.salt)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Invalid salt format"
        )
    
    # Hash provided password
    hashed_pw = hash_password(user.password, salt)
    
    # Compare hashes
    if not hashed_pw == db_user.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Create JWT token
    access_token = create_access_token(
        data={"sub": str(db_user.id), "email": db_user.email}
    )
    
    # Return user data and token
    return {
        "user": {
            "id": str(db_user.id),
            "username": db_user.username,
            "email": db_user.email,
            'ig_is_connected': str(db_user.ig_is_connected),
            'yt_is_connected': str(db_user.yt_is_connected),
        },  
        "token": access_token
    }


from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": str(user.id),
        "username": user.username,
        "email": user.email,
        'ig_is_connected': str(user.ig_is_connected),
        'yt_is_connected': str(user.yt_is_connected),
    }

@router.get("/me")
async def read_current_user(current_user: dict = Depends(get_current_user)):
    print(current_user)
    return current_user