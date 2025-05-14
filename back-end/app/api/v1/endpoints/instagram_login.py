# EAAbBlGQzAxcBO15TFMdqTSuGZAqvHN0UJrza2ZALSmm5LHDpPZCimk24bZAfNyEnwbWiLnFGQrOo2DP8xbSUZC5rBb8Wz3gpN7ergVbs5ewNwhA8vO07CDFftC43ZCiZA783aa4lYuyZCe4PL9Pp0QhfAt38pbYpKhHLjiTG3zKhdcHIFeksRXZCbuQQjtndIw5FSIeOSAvBQd3BYtxDYWZAFxLClZCRNEZD
# IGAAJZBtDKorZCBBZAE9RbUFpYUkzZA2VlZATIyVTRSVVFqYWxhZAGs3UjYyb01iZADA0X1lPelNKMXVjSEFNZAl9XelVSa3o4RHVwYng1ZAER4SFNUMnhRbjU5UVQ2V25zeVRvamVvZAW9DaE1kVzJZANWVsV2tvY2lXUWtsV2t5U1JKRlhaVQZDZD


import os
import requests
from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse, JSONResponse
from dotenv import load_dotenv
from fastapi import APIRouter, Depends
load_dotenv()
router = APIRouter()

# APP_ID = os.getenv("APP_ID")
# APP_SECRET = os.getenv("APP_SECRET")
# REDIRECT_URI = "REDIRECT_URI")

APP_ID =  1901692940649239
APP_SECRET = '4c22c2891b8edb645ec7349f9296dbaf'
REDIRECT_URI = 'http://localhost:8080/auth/callback'



SCOPES = "instagram_basic pages_show_list pages_read_engagement"

@router.get("/login")
def login():
    auth_url = (
        "https://www.facebook.com/v19.0/dialog/oauth"
        f"?client_id={APP_ID}"
        f"&redirect_uri={REDIRECT_URI}"
        f"&scope={SCOPES}"
        f"&response_type=code"
    )
    return RedirectResponse(auth_url)

@router.get("/callback")
def callback(request: Request):
    code = request.query_params.get("code")
    if not code:
        return JSONResponse({"error": "No code provided"}, status_code=400)

    # Exchange code for short-lived access token
    token_res = requests.get(
        "https://graph.facebook.com/v19.0/oauth/access_token",
        params={
            "client_id": APP_ID,
            "redirect_uri": REDIRECT_URI,
            "client_secret": APP_SECRET,
            "code": code
        }
    )
    data = token_res.json()

    if "access_token" not in data:
        return JSONResponse({"error": data}, status_code=400)

    short_token = data["access_token"]
    print(short_token)
    # Exchange for long-lived token
    long_token_res = requests.get(
        "https://graph.facebook.com/v19.0/oauth/access_token",
        params={
            "grant_type": "fb_exchange_token",
            "client_id": APP_ID,
            "client_secret": APP_SECRET,
            "fb_exchange_token": short_token
        }
    )
    long_token = long_token_res.json().get("access_token")
    return JSONResponse({"access_token": long_token})
