# app/services/instagram_dashboard.py

import os
import requests
from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import JSONResponse
from starlette.responses import RedirectResponse
from pydantic import BaseModel, Field
from typing import Any, List, Optional
from sqlalchemy.orm import Session

from app.services.oauth_storage import get_instagram_token
from app.models.models import store_instagram_data, store_access_token
from app.db.session import get_db, SessionLocal

router = APIRouter()

# --- Pydantic schemas for responses ---
class UserInsights(BaseModel):
    date: str = Field(..., description="ISO date of the metric")
    follower_count: int
    reach: int
    views: int
    accounts_engaged: int
    comments: int
    likes: int
    saves: int
    shares: int
    total_interactions: int

class MediaItem(BaseModel):
    id: str
    caption: Optional[str]
    timestamp: str
    like_count: int
    comments_count: int
    saves_count: Optional[int]
    shares_count: Optional[int]
    reach: Optional[int]
    impressions: Optional[int]

class ProfileOverview(BaseModel):
    username: str
    profile_picture_url: str
    followers_count: int
    follows_count: int
    bio: Optional[str]
    link_in_bio: Optional[str]
    profile_views: Optional[int]  # <-- New


class AudienceInsights(BaseModel):
    reach: Optional[int]
    views: Optional[int]
    online_followers: Optional[Any]
    profile_views: Optional[int]
    website_clicks: Optional[int]

class DashboardData(BaseModel):
    profile: ProfileOverview
    user_insights: List[UserInsights]
    recent_media: List[MediaItem]
    top_media: List[MediaItem]  # Top media sorted by impressions
    total_followers: int
    audience_insights: AudienceInsights
    engagement_rate: Optional[float] = Field(
        None, description="Average engagement rate across recent posts"
    )

# --- Constants ---
API_VERSION = 'v22.0'
BASE_URL = 'https://graph.facebook.com'

# --- OAuth routes ---
@router.get("/login")
def login():
    auth_url = (
        f"https://www.facebook.com/{API_VERSION}/dialog/oauth"
        f"?client_id={os.getenv('APP_ID')}"
        f"&redirect_uri={os.getenv('REDIRECT_URI')}"
        f"&scope=instagram_basic,pages_show_list,pages_read_engagement,instagram_manage_insights,instagram_business_manage_insights"
        f"&response_type=code"
    )
    return RedirectResponse(auth_url)

@router.get("/callback")
def callback(request: Request):
    code = request.query_params.get("code")
    if not code:
        raise HTTPException(400, "No code provided")
    # Exchange code for long-lived token (implementation omitted)
    long_token = "...obtained..."
    db = SessionLocal()
    store_access_token(db=db, access_token=long_token)
    db.close()
    return JSONResponse({"access_token": long_token})

# --- Helper to get Instagram User ID ---
def _get_ig_user_id(access_token: str) -> str:
    resp = requests.get(
        f"{BASE_URL}/{API_VERSION}/me/accounts",
        params={"access_token": access_token}
    ).json()
    if not resp.get("data"):
        raise HTTPException(400, 'No Facebook pages found.')
    page_id = resp["data"][0]["id"]
    resp2 = requests.get(
        f"{BASE_URL}/{API_VERSION}/{page_id}",
        params={"fields": "instagram_business_account", "access_token": access_token}
    ).json()
    ig = resp2.get("instagram_business_account")
    if not ig:
        raise HTTPException(400, 'No Instagram business account linked.')
    store_instagram_data(db=SessionLocal(), facebook_page_id=page_id, instagram_user_id=ig['id'])
    return ig['id']

# --- Profile fetcher ---
def _fetch_user_profile(ig_user_id: str, token: str) -> dict:
    url = f"{BASE_URL}/{API_VERSION}/{ig_user_id}"
    params = {
        "fields": "username,profile_picture_url,followers_count,follows_count,biography,website",
        "access_token": token
    }
    resp = requests.get(url, params=params).json()
    if 'followers_count' not in resp:
        raise HTTPException(400, f"Profile error: {resp}")
    return {
        "username": resp["username"],
        "profile_picture_url": resp["profile_picture_url"],
        "followers_count": resp["followers_count"],
        "follows_count": resp["follows_count"],
        "bio": resp.get("biography"),
        "link_in_bio": resp.get("website")
    }

def _fetch_profile_views(ig_user_id: str, token: str) -> Optional[int]:
    url = f"{BASE_URL}/{API_VERSION}/{ig_user_id}/insights"
    params = {
        "metric": "profile_views",
        "period": "day",
        "access_token": token
    }
    resp = requests.get(url, params=params).json()
    if "data" not in resp:
        return None
    # Get most recent day's value
    try:
        return resp["data"][0]["values"][-1]["value"]
    except (KeyError, IndexError):
        return None


# --- Insight fetchers ---
METRIC_DEFS = {
    'time_series': 'follower_count,reach',
    'total_values': 'views,accounts_engaged,comments,likes,saves,shares,total_interactions'
}

def _fetch_time_series(ig_user_id: str, token: str):
    url = f"{BASE_URL}/{API_VERSION}/{ig_user_id}/insights"
    params = {"metric": METRIC_DEFS['time_series'], "period": "day", "access_token": token}
    resp = requests.get(url, params=params).json()
    if 'data' not in resp:
        raise HTTPException(400, f"Time series error: {resp}")
    return resp['data']

def _fetch_total_values(ig_user_id: str, token: str):
    url = f"{BASE_URL}/{API_VERSION}/{ig_user_id}/insights"
    params = {"metric": METRIC_DEFS['total_values'], "period": "day", "metric_type": "total_value", "access_token": token}
    resp = requests.get(url, params=params).json()
    if 'data' not in resp:
        raise HTTPException(400, f"Total values error: {resp}")
    return resp['data']

# --- Media fetcher ---

def _fetch_recent_media(ig_user_id: str, token: str) -> List[MediaItem]:
    url = f"{BASE_URL}/{API_VERSION}/{ig_user_id}/media"
    params = {"fields": "id,caption,timestamp,like_count,comments_count,insights.metric(views,reach)", "access_token": token}
    resp = requests.get(url, params=params).json()
    items = []
    for item in resp.get('data', []):
        ins = {i['name']: i.get('values', [{}])[0].get('value') for i in item.get('insights', {}).get('data', [])}
        items.append(MediaItem(
            id=item['id'],
            caption=item.get('caption'),
            timestamp=item['timestamp'],
            like_count=item['like_count'],
            comments_count=item['comments_count'],
            saves_count=ins.get('saves'),
            shares_count=ins.get('shares'),
            reach=ins.get('reach'),
            impressions=ins.get('impressions')
        ))
    return items

# --- Audience & Actions Insights fetchers ---
def _fetch_daily_reach(ig_user_id: str, token: str) -> int:
    url = f"{BASE_URL}/{API_VERSION}/{ig_user_id}/insights"
    params = {"metric": "reach", "period": "day", "access_token": token}
    resp = requests.get(url, params=params).json()
    if 'data' not in resp:
        raise HTTPException(400, f"Daily reach error: {resp}")
    return resp['data'][0]['values'][0]['value']


def _fetch_daily_views(ig_user_id: str, token: str) -> int:
    url = f"{BASE_URL}/{API_VERSION}/{ig_user_id}/insights"
    params = {"metric": "views", "period": "day", "metric_type": "total_value", "access_token": token}
    resp = requests.get(url, params=params).json()
    data = resp.get('data')
    if not data or 'total_value' not in data[0]:
        return 0
    return data[0]['total_value'].get('value', 0)


def _fetch_online_followers(ig_user_id: str, token: str) -> int:
    url = f"{BASE_URL}/{API_VERSION}/{ig_user_id}/insights"
    params = {"metric": "online_followers", "period": "lifetime", "access_token": token}
    resp = requests.get(url, params=params).json()
    if 'data' not in resp:
        raise HTTPException(400, f"Online followers error: {resp}")
    return resp['data'][0]['values'][0]['value']


def _fetch_profile_views(ig_user_id: str, token: str) -> int:
    url = f"{BASE_URL}/{API_VERSION}/{ig_user_id}/insights"
    params = {"metric": "profile_views", "period": "day", "metric_type": "total_value", "access_token": token}
    resp = requests.get(url, params=params).json()
    data = resp.get('data')
    if not data or 'total_value' not in data[0]:
        return 0
    return data[0]['total_value'].get('value', 0)


def _fetch_website_clicks(ig_user_id: str, token: str) -> int:
    url = f"{BASE_URL}/{API_VERSION}/{ig_user_id}/insights"
    params = {"metric": "website_clicks", "period": "day", "metric_type": "total_value", "access_token": token}
    resp = requests.get(url, params=params).json()
    data = resp.get('data')
    if not data or 'total_value' not in data[0]:
        return 0
    return data[0]['total_value'].get('value', 0)

# --- Route ---
@router.get("/instagram/dashboard", response_model=DashboardData)
def instagram_dashboard(user_id: int = 1, db: Session = Depends(get_db)) -> DashboardData:
    """
    Instagram dashboard endpoint.
    - recent_media: all media with insights
    - top_media: top 5 by impressions
    """
    token = get_instagram_token(db=db, user_id=user_id)
    if not token:
        raise HTTPException(401, "No Instagram token; please connect your account.")
    ig_user_id = _get_ig_user_id(token)

    # Fetch profile and profile views, merge them
    profile_data = _fetch_user_profile(ig_user_id, token)
    profile_views = _fetch_profile_views(ig_user_id, token)
    profile_data["profile_views"] = profile_views
    profile = ProfileOverview(**profile_data)

    ts = _fetch_time_series(ig_user_id, token)
    tv = _fetch_total_values(ig_user_id, token)
    dates = [pt['end_time'][:10] for pt in ts[0]['values']]
    
    insights = []
    for idx, dt in enumerate(dates):
        row = {m['name']: m['values'][idx]['value'] for m in ts}
        for m in tv:
            row[m['name']] = m.get('total_value', {}).get('value', 0)
        insights.append(UserInsights(date=dt, **row))

    media = _fetch_recent_media(ig_user_id, token)

    # Compute engagement rate
    if media and profile.followers_count:
        total_engagements = sum(m.like_count + m.comments_count for m in media)
        engagement_rate = round((total_engagements / (len(media) * profile.followers_count)) * 100, 2)
    else:
        engagement_rate = None

    # Compute top media by impressions
    top_media = sorted(media, key=lambda m: m.impressions or 0, reverse=True)[:5]

    # Audience insights
    audience = AudienceInsights(
        reach=_fetch_daily_reach(ig_user_id, token),
        views=_fetch_daily_views(ig_user_id, token),
        online_followers=_fetch_online_followers(ig_user_id, token),
        profile_views=profile_views,
        website_clicks=_fetch_website_clicks(ig_user_id, token)
    )

    return DashboardData(
        profile=profile,
        user_insights=insights,
        recent_media=media,
        top_media=top_media,
        total_followers=profile.followers_count,
        audience_insights=audience,
        engagement_rate=engagement_rate
    )
