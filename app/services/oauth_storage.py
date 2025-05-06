# app/services/oauth_storage.py

# TEMPORARY MOCK FOR DEMO PURPOSES
# In production, you'd fetch from DB using user_id

# You can store it globally for now if testing only one user
from app.db.session import SessionLocal
from app.models.models import User
from sqlalchemy.orm import Session

# db = SessionLocal()
INSTAGRAM_TOKENS = {
    1: "EAAbBlGQzAxcBOZBd5AvYrLH8rJ8yVexzCKVN3eVr1S6JX9brNJJfMEx0qBeg8MfRdOO3ZCSRaikzPr1DWXsgorHaLKj0VLgjDea6CbT0EmO0vN4d6J18ZC7lTDqmypoZBDSZAZAfSwbvVikyFO7L6ZB5MPhcGUv5cHOT1el8GJCNgGlsZBLH86V3sX3A"
}

# oauth_storage.py
def get_instagram_token(db: Session, user_id: int=1):
    record = db.query(User).filter(User.id == user_id).first()
    if record:
        return record.access_token  # adjust this to your schema
    return None


import requests

def check_token_validity(access_token):
    app_id = 'YOUR_APP_ID'  # Replace with your Facebook app ID
    app_secret = 'YOUR_APP_SECRET'  # Replace with your Facebook app secret
    
    # Make a request to the debug_token endpoint
    url = f"https://graph.facebook.com/v19.0/debug_token"
    params = {
        "input_token": access_token,  # Token to check
        "access_token": f"{app_id}|{app_secret}"  # App access token
    }
    
    response = requests.get(url, params=params)
    data = response.json()
    
    if "error" in data:
        print(f"Error: {data['error']['message']}")
        return False  # Token is invalid
    
    # If valid, return token info
    print(f"Token is valid. Expires at: {data['data']['expires_at']}")
    return True  # Token is valid

# Example usage
access_token = 'YOUR_LONG_LIVED_ACCESS_TOKEN'  # Replace with your token
check_token_validity(access_token)


import requests

def refresh_long_lived_token(expired_token):
    app_id = 'YOUR_APP_ID'  # Replace with your Facebook app ID
    app_secret = 'YOUR_APP_SECRET'  # Replace with your Facebook app secret
    
    # Make a request to exchange the expired token for a new long-lived token
    url = "https://graph.facebook.com/v19.0/oauth/access_token"
    params = {
        "grant_type": "fb_exchange_token",
        "client_id": app_id,  # Your app ID
        "client_secret": app_secret,  # Your app secret
        "fb_exchange_token": expired_token  # The expired long-lived token
    }
    
    response = requests.get(url, params=params)
    data = response.json()
    
    if "error" in data:
        print(f"Error refreshing token: {data['error']['message']}")
        return None  # Token refresh failed
    
    new_token = data.get("access_token")
    if new_token:
        print(f"New long-lived access token: {new_token}")
        return new_token  # Return the new token
    else:
        print("Error: No access token returned")
        return None  # Something went wrong

# Example usage
expired_token = 'YOUR_EXPIRED_LONG_LIVED_TOKEN'  # Replace with your expired token
new_token = refresh_long_lived_token(expired_token)
