from fastapi import FastAPI
from fastapi.params import Depends
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from models.user import users

app = FastAPI()

SQLALCHEMY_DATABASE_URL = "postgresql://postgres:1q2w3e4r5t!Q@postgres:5432/hotels"
engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/users")
async def get_users(db: SessionLocal = Depends(get_db)):
    nusers = db.query(users).all()
    return nusers

@app.get("/")
def hello_world():
    return "Hello world!"

