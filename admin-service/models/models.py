from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func, ARRAY
from sqlalchemy.orm import relationship

from database.database import Base


class Category(Base):
    __tablename__ = "category"

    id = Column(Integer, primary_key=True, index=True)
    value = Column(String, nullable=False)
    rooms = relationship("Room", back_populates="category")


class Room(Base):
    __tablename__ = "room"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    category_id = Column(Integer, ForeignKey('category.id'))
    description = Column(String)
    category = relationship("Category", back_populates="rooms")
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
    category_id: int
    description: str
    price: int
    images: Optional[List[str]] = None


class RoomRead(BaseModel):
    id: int
    title: str
    category: dict
    description: str
    price: int
    images: List[str]

    class Config:
        orm_mode: True


class BookingCreate(BaseModel):
    room_id: int
    start_date: datetime
    end_date: datetime


class BookingRead(BaseModel):
    id: int
    room_id: int
    user_id: int
    start_date: datetime
    end_date: datetime
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        orm_mode: True


class CategoryCreate(BaseModel):
    value: str

class CategoryRead(BaseModel):
    id: int
    value: str

    class Config:
        orm_mode: True
