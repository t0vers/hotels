from datetime import datetime, timedelta
from typing import List, Optional

import requests
from fastapi import FastAPI, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.hotel import Room, get_session, Booking, RoomRead, BookingRead, BookingCreate, RoomCreate

app = FastAPI()


@app.get("/rooms", response_model=List[RoomRead], tags=["Room"])
async def get_rooms(request: Request, session: AsyncSession = Depends(get_session)):
    auth_token = request.headers.get('Authorization')
    # await is_auth(auth_token)
    result = await session.execute(select(Room))
    rooms = result.scalars().all()
    return rooms


@app.post("/rooms", response_model=RoomRead, tags=["Room"])
async def create_room(request: Request, room: RoomCreate, session: AsyncSession = Depends(get_session)):
    auth_token = request.headers.get('Authorization')
    # await is_auth(auth_token)
    new_room = Room(**room.dict())
    session.add(new_room)
    await session.commit()
    await session.refresh(new_room)
    return new_room


@app.get("/bookings", response_model=List[BookingRead], tags=["Booking"])
async def get_bookings(request: Request, session: AsyncSession = Depends(get_session)):
    auth_token = request.headers.get('Authorization')
    # await is_auth(auth_token)
    result = await session.execute(select(Booking).options(selectinload(Booking.room)))
    bookings = result.scalars().all()
    return bookings


@app.get("/bookings", response_model=List[BookingRead], tags=["Booking"])
async def get_bookings(request: Request, session: AsyncSession = Depends(get_session)):
    auth_token = request.headers.get('Authorization')
    # await is_auth(auth_token)
    result = await session.execute(select(Booking).options(selectinload(Booking.room)))
    bookings = result.scalars().all()
    return bookings


@app.post("/bookings", response_model=BookingRead, tags=["Booking"])
async def create_booking(request: Request, booking: BookingCreate, session: AsyncSession = Depends(get_session)):
    auth_token = request.headers.get('Authorization')
    # await is_auth(auth_token)

    # Convert dates to naive datetime
    start_date = booking.start_date.replace(tzinfo=None)
    end_date = booking.end_date.replace(tzinfo=None)

    # Check for overlapping bookings
    overlapping_bookings = await session.execute(
        select(Booking).where(
            and_(
                Booking.room_id == booking.room_id,
                Booking.end_date > start_date,
                Booking.start_date < end_date
            )
        )
    )
    if overlapping_bookings.scalars().first():
        raise HTTPException(status_code=400, detail="Room is already booked for the selected dates")

    new_booking = Booking(
        room_id=booking.room_id,
        start_date=start_date,
        end_date=end_date
    )
    session.add(new_booking)
    await session.commit()
    await session.refresh(new_booking)
    return new_booking


@app.get("/rooms/{room_id}/availability", response_model=List[str], tags=["Room"])
async def get_room_availability(room_id: int, request: Request, session: AsyncSession = Depends(get_session)):
    auth_token = request.headers.get('Authorization')
    # await is_auth(auth_token)

    today = datetime.utcnow().date()
    future_date = today + timedelta(days=30)

    result = await session.execute(
        select(Booking).where(
            and_(
                Booking.room_id == room_id,
                Booking.end_date >= today,
                Booking.start_date <= future_date
            )
        )
    )
    bookings = result.scalars().all()

    booked_dates = set()
    for booking in bookings:
        start_date = booking.start_date.date()
        end_date = booking.end_date.date()
        while start_date < end_date:
            booked_dates.add(start_date)
            start_date += timedelta(days=1)

    available_dates = []
    current_date = today
    while current_date <= future_date:
        if current_date not in booked_dates:
            available_dates.append(current_date.isoformat())
        current_date += timedelta(days=1)

    return available_dates


async def is_auth(auth_token: str):

    if not auth_token:
        raise HTTPException(status_code=400, detail="Authorization header missing")

    if not auth_token.startswith("Bearer "):
        raise HTTPException(status_code=400, detail="Invalid Authorization header format")

    auth_token = auth_token.split(" ")[1]

    headers = {
        "Authorization": f"Bearer {auth_token}"
    }

    try:
        response = requests.get('http://user-app:8000/protected-route', headers=headers)
        if not response.ok:
            raise HTTPException(status_code=401, detail="Unauthorized access")
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=401, detail="Unauthorized access")

    return True
