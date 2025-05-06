from datetime import date

from typing import Optional
from pydantic import BaseModel, Field , ConfigDict

class PostCreate(BaseModel):
    title: str
    content: str

class Post(BaseModel):
    id: int
    title: str
    content: str

    class Config:
        orm_mode = True


class YouTubeDailyMetrics(BaseModel):
    """
    Pydantic model representing daily YouTube analytics metrics for a channel.
    """
    
    d_date: date = Field(..., description="Date of the metrics")
    views: int = Field(..., ge=0, description="Total views for the day")
    estimated_minutes_watched: int = Field(
        ..., ge=0, description="Total minutes watched for the day"
    )
    average_view_duration: float = Field(
        ..., ge=0, description="Average view duration in seconds"
    )
    average_view_percentage: float = Field(
        ..., ge=0, le=100, description="Average percentage of video watched"
    )
    subscribers_gained: int = Field(..., ge=0, description="Number of new subscribers")
    subscribers_lost: int = Field(..., ge=0, description="Number of lost subscribers")
    likes: int = Field(..., ge=0, description="Number of likes")
    dislikes: int = Field(..., ge=0, description="Number of dislikes")
    shares: int = Field(..., ge=0, description="Number of shares")
    comments: int = Field(..., ge=0, description="Number of comments")
    ad_impressions: Optional[int] = Field(
        None, ge=0, description="Ad impressions (if available)"
    )
    annotation_impressions: Optional[int] = Field(
        None, ge=0, description="Annotation impressions (if available)"
    )
    annotation_click_through_rate: Optional[float] = Field(
        None, ge=0, le=100, description="Annotation click-through rate percentage"
    )

    class Config:
        schema_extra = {
            "example": {
                "d_date": "2024-04-01",
                "views": 12345,
                "estimated_minutes_watched": 67890,
                "average_view_duration": 120.5,
                "average_view_percentage": 56.7,
                "subscribers_gained": 150,
                "subscribers_lost": 10,
                "likes": 200,
                "dislikes": 5,
                "shares": 30,
                "comments": 25,
                "ad_impressions": 5000,
                "annotation_impressions": 300,
                "annotation_click_through_rate": 2.5,
            }
        }

    
