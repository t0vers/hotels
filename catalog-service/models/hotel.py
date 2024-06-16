from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func, ARRAY
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import relationship, declarative_base, sessionmaker


SQLALCHEMY_DATABASE_URL = "postgresql+asyncpg://postgres:1q2w3e4r5t!Q@catalog-postgres:5433/hotel"

Base = declarative_base()

engine = create_async_engine(SQLALCHEMY_DATABASE_URL, echo=True)
async_session_maker = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def get_session() -> AsyncSession:
    async with async_session_maker() as session:
        yield session

class Room(Base):
    __tablename__ = "room"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    room_class = Column(Integer)
    images = Column(ARRAY(String))
    price = Column(Integer)
    bookings = relationship("Booking", back_populates="room")


class Booking(Base):
    __tablename__ = "booking"

    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("room.id"), nullable=False)
    user_id = Column(Integer, nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    room = relationship("Room", back_populates="bookings")


class RoomCreate(BaseModel):
    title: str
    room_class: int
    price: int
    images: Optional[List[str]] = None


class RoomRead(BaseModel):
    id: int
    title: str
    room_class: int
    price: int

    class Config:
        orm_mode: True

class BookingCreate(BaseModel):
    room_id: int
    start_date: datetime
    end_date: datetime

class BookingRead(BaseModel):
    id: int
    room_id: int
    start_date: datetime
    end_date: datetime
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        orm_mode: True