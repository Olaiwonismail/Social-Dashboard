# app/services/yt_analytics.py

import os
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build


SCOPES = ['https://www.googleapis.com/auth/yt-analytics.readonly']
# CLIENT_SECRETS_FILE = 'client_secret.json'
# CLIENT_SECRETS_FILE = 'app/client_secret.json'
CLIENT_SECRETS_FILE = os.path.join(os.path.dirname(__file__), 'client_secret.json')
# CLIENT_SECRETS_FILE = os.path.join(os.path.dirname(__file__), 'client_secret.json')

API_SERVICE_NAME = 'youtubeAnalytics'
API_VERSION = 'v2'

def get_service():
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'  # Only for dev
    flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRETS_FILE, SCOPES)
    credentials = flow.run_local_server(
        host="localhost",
        port=8081,
        authorization_prompt_message="Please authorize in your browser.",
        success_message="Authentication complete. You can close this window.",
        # redirect_uri="http://127.0.0.1:8000/docs",
    )
    return build(API_SERVICE_NAME, API_VERSION, credentials=credentials)

def fetch_channel_metrics(service, start_date, end_date):
    return service.reports().query(
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

# uvicorn app.main:app --reload --port 8080