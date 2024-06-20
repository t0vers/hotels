from asyncio.log import logger
from typing import List

import httpx
from fastapi import Depends, HTTPException, Request, APIRouter
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from database.database import get_session
from models.models import Booking, BookingRead, BookingReadWithUser, UserRead, RoomRead
from services.auth import is_auth

booking_router = APIRouter()


@booking_router.get("/user/bookings/{user_id}", response_model=List[BookingRead], tags=["Booking"])
async def get_user_bookings(request: Request, user_id: int, session: AsyncSession = Depends(get_session)):
    auth_token = request.headers.get('Authorization')
    user_data = await is_auth(auth_token)

    if user_data["role_id"] != 2:
        raise HTTPException(status_code=403, detail="Permission Denied")

    result = await session.execute(
        select(Booking).where(Booking.user_id == user_id).options(selectinload(Booking.room)))
    bookings = result.scalars().all()
    return bookings


@booking_router.delete("/api/admin/bookings/{booking_id}", response_model=BookingRead, tags=["Booking"])
async def delete_category(request: Request, booking_id: int, session: AsyncSession = Depends(get_session)):
    auth_token = request.headers.get('Authorization')
    user_data = await is_auth(auth_token)

    if user_data["role_id"] != 2:
        raise HTTPException(status_code=403, detail="Permission Denied")

    result = await session.execute(select(Booking).where(Booking.id == booking_id))
    booking = result.scalar_one_or_none()

    if booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")

    await session.delete(booking)
    await session.commit()
    return booking


@booking_router.get("/api/admin/bookings", response_model=List[BookingReadWithUser], tags=["Booking"])
async def get_bookings(request: Request, session: AsyncSession = Depends(get_session)):
    global room
    auth_token = request.headers.get('Authorization')
    # await is_auth(auth_token)

    result = await session.execute(
        select(Booking).options(selectinload(Booking.room))
    )
    bookings = result.scalars().all()

    booking_with_user_data = []
    for booking in bookings:
        try:
            user_data = await get_user_data(booking.user_id)
            room_data = await get_room_data(booking.room_id)
            user = UserRead(**user_data)
            room = RoomRead(**room_data)
        except HTTPException as e:
            if (e.status_code == 404) or (user_data is None or room_data is None):
                user = None
            else:
                raise e
        except Exception as e:
            logger.error(f"Error fetching user data: {e}")
            user = None
        booking_data = BookingRead.from_orm(booking).dict()
        booking_data["user"] = user
        booking_data["room"] = room
        if user is not None:
            booking_data["user_id"] = user.id
        booking_with_user_data.append(BookingReadWithUser(**booking_data))

    return booking_with_user_data


async def get_user_data(user_id: int) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.get(f"http://user-app:8000/users/{user_id}")
        if response.status_code == 404:
            raise HTTPException(status_code=404, detail="User not found")
        response.raise_for_status()
        user_data = response.json()
        return user_data


async def get_room_data(room_id: int) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.get(f"http://catalog-app:8001/rooms/{room_id}")
        if response.status_code == 404:
            raise HTTPException(status_code=404, detail="Room not found")
        response.raise_for_status()
        room_data = response.json()
        return room_data
