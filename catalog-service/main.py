from datetime import datetime
from typing import List

import requests
from fastapi import FastAPI, Depends, HTTPException, Request, Query
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

    new_room = Room(
        title=room.title,
        room_class=room.room_class,
        price=room.price,
        images=room.images
    )

    session.add(new_room)
    await session.commit()
    await session.refresh(new_room)

    return new_room


@app.get("/user/bookings", response_model=List[BookingRead], tags=["Booking"])
async def get_user_bookings(request: Request, session: AsyncSession = Depends(get_session)):
    auth_token = request.headers.get('Authorization')
    user_data = await is_auth(auth_token)
    print(user_data)
    user_id = user_data["id"]

    result = await session.execute(select(Booking).where(Booking.user_id == user_id).options(selectinload(Booking.room)))
    bookings = result.scalars().all()
    return bookings


@app.get("/bookings", response_model=List[BookingRead], tags=["Booking"])
async def get_bookings(request: Request, session: AsyncSession = Depends(get_session)):
    auth_token = request.headers.get('Authorization')
    await is_auth(auth_token)
    result = await session.execute(select(Booking).options(selectinload(Booking.room)))
    bookings = result.scalars().all()
    return bookings


async def check_overlapping_bookings(session: AsyncSession, room_id: int, start_date: datetime, end_date: datetime) -> bool:
    overlapping_bookings = await session.execute(
        select(Booking).where(
            and_(
                Booking.room_id == room_id,
                Booking.end_date > start_date,
                Booking.start_date < end_date
            )
        )
    )
    return overlapping_bookings.scalars().first() is not None


@app.post("/bookings", response_model=BookingRead, tags=["Booking"])
async def create_booking(request: Request, booking: BookingCreate, session: AsyncSession = Depends(get_session)):
    auth_token = request.headers.get('Authorization')
    user_data = await is_auth(auth_token)
    user_id = user_data["id"]

    start_date = booking.start_date.replace(tzinfo=None)
    end_date = booking.end_date.replace(tzinfo=None)

    if await check_overlapping_bookings(session, booking.room_id, start_date, end_date):
        raise HTTPException(status_code=400, detail="Room is already booked for the selected dates")

    new_booking = Booking(
        room_id=booking.room_id,
        user_id=user_id,
        start_date=start_date,
        end_date=end_date
    )
    session.add(new_booking)
    await session.commit()
    await session.refresh(new_booking)
    return new_booking


@app.get("/available-rooms", response_model=List[RoomRead], tags=["Room"])
async def get_available_rooms(
    request: Request,
    start_date: datetime = Query(..., alias="startDate"),
    end_date: datetime = Query(..., alias="endDate"),
    session: AsyncSession = Depends(get_session),
):
    auth_token = request.headers.get('Authorization')
    await is_auth(auth_token)

    start_date = start_date.replace(tzinfo=None)
    end_date = end_date.replace(tzinfo=None)

    subquery = select(Booking.room_id).where(
        and_(
            Booking.end_date > start_date,
            Booking.start_date < end_date
        )
    ).subquery()

    result = await session.execute(
        select(Room).where(Room.id.not_in(subquery))
    )
    available_rooms = result.scalars().all()
    return available_rooms


async def is_auth(auth_token: str) -> dict:
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
        user_data = response.json()
        return user_data
    except requests.exceptions.RequestException:
        raise HTTPException(status_code=401, detail="Unauthorized access")
