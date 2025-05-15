# app/api/v1/endpoints/yt_metrics.py (updated)

import os
  # loads environment variables from .env into os.environ

from fastapi import APIRouter, HTTPException, Query, Depends
from dateutil.relativedelta import relativedelta
from typing import Optional
from fastapi.responses import RedirectResponse
from pydantic import BaseModel 
from app.services.yt_analytics_v2 import (
    fetch_dashboard_data,
    get_services,
    get_authorization_url,
    validate_authorization_code,
    validate_dates
)
from app.db.session import SessionLocal
from app.models.models import User
import requests
# In yt_analytics_v2.py
from google.auth.exceptions import RefreshError  # Add this import

# Rest of your imports
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
router = APIRouter()

FE_YOUTUBE_REDIRECT_URI = os.getenv("FE_YOUTUBE_REDIRECT_URI")

class YouTubeAuthResponse(BaseModel):
    authorization_url: str

class YouTubeCallback(BaseModel):
    state: str
    code: str
 
class UserEmail(BaseModel):
    email : str

_email = {
    'email': None
}
@router.post("/auth/initiate")
async def initiate_youtube_auth(email: UserEmail):
    email = email.email
    _email['email'] = email
    try:
        auth_url = get_authorization_url(email)
        print(f"Authorization URL: {auth_url}")
        return {auth_url}
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Authorization initiation failed: {str(e)}"
        )


 
@router.get("/auth/callback")
async def youtube_auth_callback(code: str):
    email = _email['email']
    success = validate_authorization_code(code, email)
    if not success:
        raise HTTPException(400, "Invalid authorization code")
    return RedirectResponse(url=FE_YOUTUBE_REDIRECT_URI)

from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta

@router.post("/yt-metrics")
def get_yt_metrics(
    email: UserEmail,
    frequency: Optional[str] = Query('daily'),
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
):
    email__ = email.email
    try:
        # Default end_date to 2 days ago (YouTube data delay)
        today = datetime.utcnow().date()
        max_end_date = today - timedelta(days=2)
        end_date = end_date or max_end_date.isoformat()

        # Validate end_date first
        try:
            end_date_obj = datetime.strptime(end_date, "%Y-%m-%d").date()
        except ValueError:
            raise HTTPException(400, "Invalid end_date format. Use YYYY-MM-DD")

        # Calculate start_date based on frequency if not provided
        if not start_date:
            if frequency == "weekly":
                start_date_obj = end_date_obj - timedelta(weeks=1)
            elif frequency == "monthly":
                start_date_obj = end_date_obj - relativedelta(months=1)
            elif frequency == "yearly":
                start_date_obj = end_date_obj - relativedelta(years=1)
            elif frequency == "daily":
                start_date_obj = end_date_obj - timedelta(days=1)
            else:
                raise HTTPException(400, "Invalid frequency parameter")
            
            start_date = start_date_obj.isoformat()

        # Now validate both dates
        start_date, end_date = validate_dates(start_date, end_date)
        
        return fetch_dashboard_data(email__, start_date, end_date)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(502, detail=str(e))

@router.post("/disconnect")
def disconnect_youtube(email: UserEmail):
    db = SessionLocal()
    email = email.email
    try:
        user = db.query(User).filter_by(email=email).first()
        if not user:
            raise HTTPException(404, "User not found")
        
        if user.yt_token:
            # Revoke Google credentials
            creds = Credentials(token=user.yt_token)
            try:
                revoke_url = "https://oauth2.googleapis.com/revoke"
                requests.post(revoke_url, params={'token': creds.token})
            except requests.exceptions.RequestException:
                pass
            
            # Clear user data
            user.yt_token = None
            user.yt_refresh_token = None
            user.yt_expiry = None
            user.yt_is_connected = False
            db.commit()
        
        return {"message": "YouTube disconnected successfully"}
    finally:
        db.close()