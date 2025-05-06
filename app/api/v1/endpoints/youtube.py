from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.schema import PostCreate, Post
from app.crud import post as crud_post
from app.db.session import get_db
from app.services.yt_analytics_v2 import get_service, fetch_channel_metrics
from datetime import date, timedelta
from dateutil.relativedelta import relativedelta
router = APIRouter()

# @router.post("/", response_model=Post)
# def create_new_post(post: PostCreate, db: Session = Depends(get_db)):
#     return crud_post.create_post(db, post)

# @router.get("/", response_model=list[Post])
# def list_posts(db: Session = Depends(get_db)):
#     return crud_post.get_posts(db)



today = date.today()
formatted_date = today.isoformat() 


yesterday = date.today() - timedelta(days=3)
formatted_yesterday = yesterday.isoformat() 

last_week = today - timedelta(weeks=1)
formatted_last_week = last_week.isoformat()

last_month = today - relativedelta(months=1)
formatted_last_month = last_month.isoformat()

last_year = today - relativedelta(years=1)
formatted_last_year = last_year.isoformat()

frequency = "daily"
@router.get("/yt-metrics")
def get_yt_metrics(frequency:str,start_date:str= yesterday.isoformat(),end_date:str=formatted_date):
    service = get_service()
  
    if frequency == "weekly":
        data = fetch_channel_metrics(service, formatted_last_week, end_date)
        
    elif frequency == "monthly":
        data = fetch_channel_metrics(service, formatted_last_month, end_date)
        
    elif frequency == "yearly":
        data = fetch_channel_metrics(service, formatted_last_year, end_date)
        
    elif frequency == "daily":
        # Fetch daily metrics
        data = fetch_channel_metrics(service, start_date, end_date)    
    data = fetch_channel_metrics(service, start_date, end_date)
    return data
