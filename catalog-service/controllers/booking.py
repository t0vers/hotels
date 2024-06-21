from datetime import datetime, date, timedelta
from typing import List

from fastapi import Depends, HTTPException, Query, Request, APIRouter
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from database.database import get_session
from models.models import Booking, BookingRead, BookingCreate
from services.auth import is_auth

booking_router = APIRouter()


@booking_router.get("/user/bookings", response_model=List[BookingRead], tags=["Booking"])
async def get_user_bookings(request: Request, session: AsyncSession = Depends(get_session)):
    auth_token = request.headers.get('Authorization')
    user_data = await is_auth(auth_token)
    user_id = user_data["id"]

    result = await session.execute(
        select(Booking).where(Booking.user_id == user_id).options(selectinload(Booking.room)))
    bookings = result.scalars().all()
    return bookings


@booking_router.get("/bookings", response_model=List[BookingRead], tags=["Booking"])
async def get_bookings(request: Request, session: AsyncSession = Depends(get_session)):
    auth_token = request.headers.get('Authorization')
    # await is_auth(auth_token)
    result = await session.execute(select(Booking).options(selectinload(Booking.room)))
    bookings = result.scalars().all()
    return bookings


async def check_overlapping_bookings(session: AsyncSession, room_id: int, start_date: datetime,
                                     end_date: datetime) -> bool:
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


@booking_router.post("/bookings", response_model=BookingRead, tags=["Booking"])
async def create_booking(request: Request, booking: BookingCreate, session: AsyncSession = Depends(get_session)):
    auth_token = request.headers.get('Authorization')
    user_data = await is_auth(auth_token)
    user_id = user_data["id"]

    start_date = booking.start_date.replace(tzinfo=None)
    end_date = booking.end_date.replace(tzinfo=None)

    if await check_overlapping_bookings(session, booking.room_id, start_date, end_date):
        raise HTTPException(status_code=400, detail="В выбранном промежутке номер уже забронирован")

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


@booking_router.delete("/bookings/{booking_id}", response_model=BookingRead, tags=["Booking"])
async def delete_booking(request: Request, booking_id: int, session: AsyncSession = Depends(get_session)):
    auth_token = request.headers.get('Authorization')
    await is_auth(auth_token)

    result = await session.execute(select(Booking).where(Booking.id == booking_id))
    booking = result.scalar_one_or_none()

    if booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")

    await session.delete(booking)
    await session.commit()
    return booking


@booking_router.get("/available-rooms", response_model=List[date], tags=["Room"])
async def get_available_rooms(
        room_id: int = Query(..., description="ID комнаты, для которой проверяется доступность"),
        session: AsyncSession = Depends(get_session),
):
    try:
        result = await session.execute(
            select(Booking).where(Booking.room_id == room_id)
        )
        bookings = result.scalars().all()

        booked_dates = []
        for booking in bookings:
            start_date = booking.start_date.date()
            end_date = booking.end_date.date()

            delta = end_date - start_date
            for i in range(delta.days + 1):
                booked_dates.append(start_date + timedelta(days=i))

        return list(set(booked_dates))

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
