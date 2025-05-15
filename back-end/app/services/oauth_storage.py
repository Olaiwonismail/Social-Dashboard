# app/services/oauth_storage.py



import os
from dotenv import load_dotenv

load_dotenv()  # loads environment variables from .env into os.environ


# You can store it globally for now if testing only one user
import os
from app.db.session import SessionLocal
from app.models.models import User
from sqlalchemy.orm import Session

APP_ID = os.getenv("FB_APP_ID")
APP_SECRET = os.getenv("FB_APP_SECRET")


db = SessionLocal()
# oauth_storage.py
def get_instagram_token(db: Session, email: str) -> str | None:
    """Retrieve Instagram access token from database"""
    try:
        record = db.query(User).filter(User.email == email).first()
        return record.access_token if record else None
    except Exception as e:
        print(f"Database error: {str(e)}")
        return None


import requests
def check_token_validity(access_token: str) -> bool:
    """Check if Instagram access token is valid"""
    try:
        url = "https://graph.facebook.com/v19.0/debug_token"
        params = {
            "input_token": access_token,
            "access_token": f"{APP_ID}|{APP_SECRET}"
        }
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        
        if "error" in data:
            print(f"Token error: {data['error']['message']}")
            return False
            
        token_data = data.get('data', {})
        
        # Handle potential missing expires_at field
        if 'expires_at' in token_data:
            print(f"Token valid until: {token_data['expires_at']}")
            return True
            
        print("Token is valid with no expiration")
        return True
        
    except requests.exceptions.RequestException as e:
        print(f"API request failed: {str(e)}")
        return False
    except KeyError as e:
        print(f"Unexpected response format: {str(e)}")
        return False
# Example usage
# access_token = 'YOUR_LONG_LIVED_ACCESS_TOKEN'  # Replace with your token
# check_token_validity(access_token)


import requests
def refresh_long_lived_token(expired_token: str) -> str | None:
    """Refresh long-lived Instagram token"""
    try:
        url = "https://graph.facebook.com/v19.0/oauth/access_token"
        params = {
            "grant_type": "fb_exchange_token",
            "client_id": APP_ID,
            "client_secret": APP_SECRET,
            "fb_exchange_token": expired_token
        }
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        
        if "error" in data:
            print(f"Refresh error: {data['error']['message']}")
            return None
            
        return data.get("access_token")
        
    except requests.exceptions.RequestException as e:
        print(f"Refresh request failed: {str(e)}")
        return None

# Example usage
# expired_token = 'YOUR_EXPIRED_LONG_LIVED_TOKEN'  # Replace with your expired token
# new_token = refresh_long_lived_token(expired_token)
