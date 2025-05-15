from fastapi import FastAPI
from fastapi.security import OAuth2PasswordBearer
from app.api.v1.endpoints import youtube

from app.api.v1.endpoints.instagram import router as instagram_router
from app.api.v1.endpoints.user import router as user_router
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="user/login")

# Update CORS middleware to include Authorization header
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*", "Authorization"],  # Explicitly allow Authorization
)
# Include routes
app.include_router(youtube.router, prefix="/youtube", tags=["Youtube"])



app.include_router(
    instagram_router,
    prefix="/instagram",
    tags=["Instagram"]
)

app.include_router(
    user_router,
    prefix="/user",
    tags=["User"]
)