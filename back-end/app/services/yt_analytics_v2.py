# app/services/yt_analytics_v2.py (updated for web flow)

import os
from dotenv import load_dotenv

load_dotenv()  # loads environment variables from .env into os.environ


from datetime import date, datetime, timedelta
import os
from fastapi import HTTPException, status
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from pydantic import BaseModel
from app.db.session import SessionLocal
from app.models.models import User
from typing import Optional, Tuple
# In yt_analytics_v2.py
from google.auth.exceptions import RefreshError  # Add this import
client_id=os.getenv("analytics_client_id")
client_secret=os.getenv("analytics_client_secret")
# Rest of your imports
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

SCOPES = [
    'openid',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/yt-analytics.readonly',
]


CLIENT_SECRETS_FILE = os.path.join(os.path.dirname(__file__), 'client_secret.json')
REDIRECT_URI = os.getenv("analytics_yt_REDIRECT_URI")

client_config = {
        "web": {
            "client_id": client_id,
            "client_secret": client_secret,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "redirect_uris": [REDIRECT_URI],
        }
    }

def get_authorization_url(email: str) -> str:
    """Generate OAuth URL without state"""
   

    flow = Flow.from_client_config(
        client_config=client_config,
        scopes=SCOPES,  # adjust scopes as needed
        redirect_uri=REDIRECT_URI
    )
    
    authorization_url, _ = flow.authorization_url(
        access_type='offline',
        prompt='consent',
        include_granted_scopes='true'
    )
    
    return authorization_url

# In your yt_analytics_v2.py
def validate_authorization_code(code: str, email: str) -> bool:
    """Validate code without state"""
    db = SessionLocal()
    try:
        user = db.query(User).filter_by(email=email).first()
        if not user:
            return False

        flow = Flow.from_client_config(
            client_config=client_config,
            scopes=SCOPES,
            redirect_uri="http://localhost:8080/youtube/auth/callback"
        )
        
        flow.fetch_token(code=code)
        credentials = flow.credentials

        user.yt_token = credentials.token
        user.yt_refresh_token = credentials.refresh_token
        user.yt_expiry = credentials.expiry
        user.yt_is_connected = True
        
        db.commit()
        return True
    except Exception as e:
        db.rollback()
        print(f"Authorization failed: {str(e)}")
        return False
    finally:
        db.close()

        
def get_services(email: str) -> Tuple:
    db = SessionLocal()
    try:
        user = db.query(User).filter_by(email=email).first()
        if not user or not user.yt_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="YouTube not connected"
            )

        creds = Credentials(
            token=user.yt_token,
            refresh_token=user.yt_refresh_token,
            token_uri='https://oauth2.googleapis.com/token',
            client_id=client_id,
            client_secret=client_secret,
        )

        if not creds.valid:
            try:
                creds.refresh(Request())
                # Update credentials in database
                user.yt_token = creds.token
                user.yt_expiry = creds.expiry
                db.commit()
            except RefreshError:
                user.yt_is_connected = False
                db.commit()
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="YouTube authorization expired"
                )

        return (
            build("youtubeAnalytics", "v2", credentials=creds),
            build("youtube", "v3", credentials=creds)
        )
    finally:
        db.close()

# Keep the existing fetch functions (fetch_channel_metrics, fetch_channel_info, etfrom datetime import datetime, timedelta

def validate_dates(start_date: str, end_date: str) -> tuple:
    # Convert string dates to datetime objects
    try:
        start = datetime.strptime(start_date, "%Y-%m-%d").date()
        end = datetime.strptime(end_date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(
            status_code=400, 
            detail="Invalid date format. Use YYYY-MM-DD"
        )

    # Validate date ranges
    today = datetime.utcnow().date()
    
    if start > end:
        raise HTTPException(400, "Start date cannot be after end date")
    
    if end > today:
        raise HTTPException(400, "End date cannot be in the future")
    
    # YouTube Analytics typically has 2-3 day data delay
    # if end > today - timedelta(days=2):
    #     raise HTTPException(400, "End date should be at least 2 days ago")
    
    return start_date, end_date

# Update your fetch_channel_metrics function
def fetch_channel_metrics(email, start_date: str, end_date: str) -> dict:
    try:
        start_date, end_date = validate_dates(start_date, end_date)
        yt_analytics, _ = get_services(email)
        return yt_analytics.reports().query(
            ids='channel==MINE',
            startDate=start_date,
            endDate=end_date,
            metrics=(
                'views,estimatedMinutesWatched,averageViewDuration,'
                'averageViewPercentage,subscribersGained,subscribersLost,'
                'likes,dislikes,shares,comments'
            ),
            dimensions='day',
            sort='day'
        ).execute()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(502, f"YouTube Analytics error: {e}")
def fetch_channel_info(email) -> dict:
    """Fetch basic channel information"""
    try:
        
        _, yt_data = get_services(email)
        print(yt_data.channels())
        response = yt_data.channels().list(
            part="snippet,statistics",
            mine=True
        ).execute()

        print('fetch_channel_info')
        channel = response["items"][0]
        return {
            "channel_info": {
                "id": channel["id"],
                "name": channel["snippet"]["title"],
                "description": channel["snippet"]["description"],
                "thumbnail": channel["snippet"]["thumbnails"]["default"]["url"],
                "subscribers": int(channel["statistics"]["subscriberCount"]),
                "total_views": int(channel["statistics"]["viewCount"]),
                "total_videos": int(channel["statistics"]["videoCount"])
            }
        }
    except Exception as e:
        property(e)
        raise HTTPException(502, f"YouTube Data error: {str(e)}")
import isodate  # pip install isodate

def fetch_all_videos(email: str) -> list:
    """Get ALL uploaded videos using YouTube Data API"""
    try:
        _, yt_data = get_services(email)
        
        all_videos = []
        next_page_token = None
        
        while True:
            # Fetch videos from your channel's uploads
            request = yt_data.search().list(
                part="snippet",
                channelId="UC1Kdlat2N1EOn6jemwf4SeQ",  # Use your actual channel ID
                type="video",
                maxResults=50,
                order="date",
                pageToken=next_page_token
            )
            response = request.execute()
            
            # Collect video IDs
            for item in response.get("items", []):
                if item["id"]["kind"] == "youtube#video":
                    all_videos.append(item["id"]["videoId"])
            
            next_page_token = response.get("nextPageToken")
            if not next_page_token:
                break

        return all_videos

    except Exception as e:
        raise HTTPException(500, f"Failed to fetch videos: {str(e)}")
def fetch_top_videos(email, start_date: str, end_date: str, max_results: int = 5) -> dict:
    try:
        yt_analytics, yt_data = get_services(email)
        
        # Get ALL video IDs (including 0-view videos)
        all_video_ids = fetch_all_videos(email)
        
        # Fetch metadata for all videos
        meta_resp = yt_data.videos().list(
            part='snippet,statistics,contentDetails',
            id=','.join(all_video_ids)
        ).execute().get('items', [])
        
        # Get metrics for videos with views (from Analytics API)
        analytics_data = {}
        if all_video_ids:
            try:
                analytics_rows = yt_analytics.reports().query(
                    ids='channel==MINE',
                    startDate=start_date,
                    endDate=end_date,
                    metrics='views,estimatedMinutesWatched',
                    dimensions='video',
                    filters=f"video=={','.join(all_video_ids)}"
                ).execute().get('rows', [])
                analytics_data = {row[0]: row[1:] for row in analytics_rows}
            except Exception as e:
                # Handle case where no analytics data exists
                pass
        
        # Build combined response
        videos = []
        for meta in meta_resp:
            vid_id = meta["id"]
            analytics = analytics_data.get(vid_id, [0, 0])  # Default to 0 views
            
            videos.append({
                "id": vid_id,
                "title": meta["snippet"]["title"],
                "thumbnail": meta["snippet"]["thumbnails"]["default"]["url"],
                "views": int(analytics[0]) if analytics else 0,
                "watch_time": int(analytics[1]) if analytics else 0,
                "likes": int(meta["statistics"].get("likeCount", 0)),
                "comments": int(meta["statistics"].get("commentCount", 0)),
            })
        
        # Sort by views descending
        sorted_videos = sorted(videos, key=lambda x: x["views"], reverse=True)
        
        return {'top_videos': sorted_videos[:max_results]}
    
    except Exception as e:
        raise HTTPException(502, f"YouTube Data error: {e}")
    
def fetch_demographics(email,start_date: str, end_date: str) -> dict:
    try:
        yt_analytics, _ = get_services(email)
        resp = yt_analytics.reports().query(
            ids='channel==MINE',
            startDate=start_date,
            endDate=end_date,
            metrics='viewerPercentage',
            dimensions='ageGroup,gender'
        ).execute()
        return {'demographics': resp.get('rows', [])}
    except Exception as e:
        raise HTTPException(502, f"YouTube Analytics error: {e}")

def fetch_traffic_sources(email,start_date: str, end_date: str) -> dict:
    try:
        yt_analytics, _ = get_services(email)
        resp = yt_analytics.reports().query(
            ids='channel==MINE',
            startDate=start_date,
            endDate=end_date,
            metrics='views',
            dimensions='insightTrafficSourceType'
        ).execute()
        return {'traffic_sources': resp.get('rows', [])}
    except Exception as e:
        raise HTTPException(502, f"YouTube Analytics error: {e}")

def fetch_geography(email,start_date: str, end_date: str) -> dict:
    try:
        yt_analytics, _ = get_services(email)
        resp = yt_analytics.reports().query(
            ids='channel==MINE',
            startDate=start_date,
            endDate=end_date,
            metrics='views,estimatedMinutesWatched',
            dimensions='country'
        ).execute()
        return {'geography': resp.get('rows', [])}
    except Exception as e:
        raise HTTPException(502, f"YouTube Analytics error: {e}")

def fetch_dashboard_data(email:str,start_date: str, end_date: str) -> dict:
    print('lmaooo')
    try:
        data = {}
        data.update(fetch_channel_info(email))  # Add channel info first

        data["channel_metrics"] = fetch_channel_metrics(email,start_date, end_date)
        
        data.update(fetch_top_videos(email,start_date, end_date))
        data.update(fetch_demographics(email,start_date, end_date))
        data.update(fetch_traffic_sources(email,start_date, end_date))
        data.update(fetch_geography(email,start_date, end_date))
        return data
    except RefreshError:
        global _services_cache
        _services_cache = None
        raise HTTPException(401, "Authorization expired. Please re-authenticate.")