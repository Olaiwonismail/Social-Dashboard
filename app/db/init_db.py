import sys, os
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), "app")))

from db.session import engine
from models.models import Base  # Adjust if your model file is named differently

Base.metadata.create_all(bind=engine)
