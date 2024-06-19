from datetime import datetime, date, timedelta
from typing import List

from fastapi import Depends, HTTPException, Query, Request, APIRouter
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from database.database import get_session
from models.models import Booking, BookingRead, BookingCreate

booking_router = APIRouter()


@booking_router.get("/user/bookings/{user_id}", response_model=List[BookingRead], tags=["Booking"])
async def get_user_bookings(request: Request, user_id: int, session: AsyncSession = Depends(get_session)):
    auth_token = request.headers.get('Authorization')
    # user_data = await is_auth(auth_token)

    result = await session.execute(
        select(Booking).where(Booking.user_id == user_id).options(selectinload(Booking.room)))
    bookings = result.scalars().all()
    return bookings


@booking_router.delete("/bookings/{booking_id}", response_model=BookingRead, tags=["Booking"])
async def delete_category(booking_id: int, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Booking).where(Booking.id == booking_id))
    booking = result.scalar_one_or_none()

    if booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")

    await session.delete(booking)
    await session.commit()
    return booking



@booking_router.get("/bookings", response_model=List[BookingRead], tags=["Booking"])
async def get_bookings(request: Request, session: AsyncSession = Depends(get_session)):
    auth_token = request.headers.get('Authorization')
    # await is_auth(auth_token)
    result = await session.execute(select(Booking).options(selectinload(Booking.room)))
    bookings = result.scalars().all()
    return bookings
