from datetime import datetime
from typing import List, Optional

from fastapi import FastAPI, Depends
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models.hotel import Room, get_session, Booking

app = FastAPI()

class RoomCreate(BaseModel):
    title: str
    room_class: int
    price: int

# Pydantic модель для возврата данных Room
class RoomRead(BaseModel):
    id: int
    title: str
    room_class: int
    price: int

    class Config:
        orm_mode: True

# Pydantic модель для создания записей Booking
class BookingCreate(BaseModel):
    room_id: int
    start_date: datetime
    end_date: datetime

# Pydantic модель для возврата данных Booking
class BookingRead(BaseModel):
    id: int
    room_id: int
    start_date: datetime
    end_date: datetime
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        orm_mode: True

@app.get("/rooms", response_model=List[RoomRead])
async def get_rooms(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Room))
    rooms = result.scalars().all()
    return rooms

@app.post("/rooms", response_model=RoomRead)
async def create_room(room: RoomCreate, session: AsyncSession = Depends(get_session)):
    new_room = Room(**room.dict())
    session.add(new_room)
    await session.commit()
    await session.refresh(new_room)
    return new_room

@app.get("/bookings", response_model=List[BookingRead])
async def get_bookings(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Booking))
    bookings = result.scalars().all()
    return bookings

@app.post("/bookings", response_model=BookingRead)
async def create_booking(booking: BookingCreate, session: AsyncSession = Depends(get_session)):
    new_booking = Booking(**booking.dict())
    session.add(new_booking)
    await session.commit()
    await session.refresh(new_booking)
    return new_booking