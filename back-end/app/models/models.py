from sqlalchemy import Boolean, Column, DateTime, String, Integer
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey
from app.db.session import Base, get_db  # Importing Base and get_db from your session.py
from sqlalchemy.orm import Session

from sqlalchemy import create_engine, Column, String, Integer
from sqlalchemy.ext.declarative import declarative_base

from sqlalchemy.exc import SQLAlchemyError
import requests
import os



class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)  # Store hashed only
    salt = Column(String, nullable=False)  # Store salt as hex string
    # youtube
    yt_is_connected = Column(Boolean, default=0)  # 0 for not connected, 1 for connected
    yt_token = Column(String)
    yt_refresh_token = Column(String)
    yt_expiry = Column(DateTime)
    yt_auth_state = Column(String, nullable=True) 
    # Optional social fields
    ig_is_connected = Column(Boolean, default=0) 
    instagram_page_name =  facebook_user_id = Column(String, nullable=True)
    
    instagram_user_id = Column(String, nullable=True)
    facebook_page_id = Column(String, nullable=True)
    access_token = Column(String, nullable=True)  # Optional, if using OAuth


def store_access_token(db: Session,email:str, access_token: str):
    try:
        # Check if the data already exists
        user = db.query(User).filter_by(email = email).first()
        
      
            # Create new record
        user.access_token = access_token
        user.ig_is_connected = True
        db.commit()
        print(f"Acess token stored successfully.")

    except Exception as e:
        db.rollback()
        print(f"Error storing data: {e}")




def store_instagram_data(db: Session,email:str,facebook_page_id: str,  instagram_user_id: str):
    try:
        # Check if the data already exists
        existing_data = db.query(User).filter_by(email= email).first()
        
        if existing_data:

            # Update existing record if user data is already stored
            existing_data.facebook_page_id= facebook_page_id
            existing_data.instagram_user_id = instagram_user_id
            
        # else:
            # Create new record
        # new_data = User(
        #     facebook_page_id=facebook_page_id,
        #     access_token=access_token,
        #     instagram_user_id=instagram_user_id,
           
        # )
        # db.add(new_data)
    
        db.commit()
        print(f"Data for user {facebook_page_id} stored successfully.")

    except Exception as e:
        db.rollback()
        print(f"Error storing data: {e}")

