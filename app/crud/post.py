# from sqlalchemy.orm import Session
# from app.models.models import Post
# from app.schemas.schema import PostCreate

# def create_post(db: Session, post: PostCreate):
#     db_post = Post(title=post.title, content=post.content)
#     db.add(db_post)
#     db.commit()
#     db.refresh(db_post)
#     return db_post

# def get_posts(db: Session):
#     return db.query(Post).all()
