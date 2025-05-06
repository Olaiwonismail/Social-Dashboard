from fastapi import FastAPI
from app.api.v1.endpoints import youtube
from app.api.v1.endpoints.instagram_login import router as instagram_login_router
from app.api.v1.endpoints.instagram import router as instagram_router
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],            # let any front-end access your API
    allow_credentials=True,         # allow cookies/auth if you need them
    allow_methods=["*"],            # allow GET, POST, PUT, DELETE…
    allow_headers=["*"],            # allow any headers
)

# Include routes
app.include_router(youtube.router, prefix="/api/v1/posts", tags=["Posts"])



app.include_router(
    instagram_router,
    prefix="/instagram",
    tags=["Instagram"]
)