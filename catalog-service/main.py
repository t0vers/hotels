from datetime import datetime, date, timedelta
from typing import List, Optional

import requests
from fastapi import FastAPI, Depends, HTTPException, Request, Query
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models.hotel import Room, get_session, Booking, RoomRead, BookingRead, BookingCreate, RoomCreate, Category, \
    CategoryCreate, CategoryRead

app = FastAPI()


@app.post("/categories", response_model=CategoryRead, tags=["Category"])
async def create_category(category: CategoryCreate, session: AsyncSession = Depends(get_session)):
    new_category = Category(value=category.value)

    session.add(new_category)
    await session.commit()
    await session.refresh(new_category)

    return new_category


@app.get("/rooms", response_model=List[RoomRead], tags=["Room"])
async def get_rooms(category_id: Optional[int] = Query(None), session: AsyncSession = Depends(get_session)):
    query = select(Room)
    if category_id is not None and category_id != 0:
        query = query.filter_by(category_id=category_id)

    result = await session.execute(query)
    rooms = result.scalars().all()

    response_data = []
    for room in rooms:
        category_result = await session.execute(select(Category).filter_by(id=room.category_id))
        category = category_result.scalar_one_or_none()
        category_data = {"id": category.id, "value": category.value} if category else {"id": None, "value": "Unknown"}
        response_data.append({
            "id": room.id,
            "title": room.title,
            "category": category_data,
            "price": room.price,
            "description": room.description,
            "images": room.images
        })

    return response_data

@app.get("/rooms/{room_id}", response_model=RoomRead, tags=["Room"])
async def get_room_by_id(room_id: int, session: AsyncSession = Depends(get_session)):
    result = await session.execute(
        select(Room).filter_by(id=room_id).options(selectinload(Room.category))
    )
    room = result.scalar_one_or_none()

    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")

    category_data = {
        "id": room.category.id,
        "value": room.category.value
    } if room.category else {
        "id": None,
        "value": "Unknown"
    }

    response_data = {
        "id": room.id,
        "title": room.title,
        "category": category_data,
        "price": room.price,
        "description": room.description,
        "images": room.images
    }

    return response_data


@app.post("/rooms", response_model=RoomRead, tags=["Room"])
async def create_room(request: Request, room: RoomCreate, session: AsyncSession = Depends(get_session)):
    auth_token = request.headers.get('Authorization')
    # await is_auth(auth_token)

    result = await session.execute(select(Category).filter_by(id=room.category_id))
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    new_room = Room(
        title=room.title,
        category_id=room.category_id,
        price=room.price,
        images=room.images,
        description=room.description
    )

    session.add(new_room)
    await session.commit()
    await session.refresh(new_room)

    response_data = {
        "id": new_room.id,
        "title": new_room.title,
        "category": {"id": category.id, "value": category.value},
        "price": new_room.price,
        "description": new_room.description
    }
    return response_data


@app.get("/user/bookings", response_model=List[BookingRead], tags=["Booking"])
async def get_user_bookings(request: Request, session: AsyncSession = Depends(get_session)):
    auth_token = request.headers.get('Authorization')
    user_data = await is_auth(auth_token)
    user_id = user_data["id"]

    result = await session.execute(
        select(Booking).where(Booking.user_id == user_id).options(selectinload(Booking.room)))
    bookings = result.scalars().all()
    return bookings


@app.get("/bookings", response_model=List[BookingRead], tags=["Booking"])
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


@app.post("/bookings", response_model=BookingRead, tags=["Booking"])
async def create_booking(request: Request, booking: BookingCreate, session: AsyncSession = Depends(get_session)):
    auth_token = request.headers.get('Authorization')
    # user_data = await is_auth(auth_token)
    # user_id = user_data["id"]

    start_date = booking.start_date.replace(tzinfo=None)
    end_date = booking.end_date.replace(tzinfo=None)

    if await check_overlapping_bookings(session, booking.room_id, start_date, end_date):
        raise HTTPException(status_code=400, detail="Room is already booked for the selected dates")

    new_booking = Booking(
        room_id=booking.room_id,
        user_id=41,
        start_date=start_date,
        end_date=end_date
    )
    session.add(new_booking)
    await session.commit()
    await session.refresh(new_booking)
    return new_booking


@app.get("/available-rooms", response_model=List[date], tags=["Room"])
async def get_available_rooms(
    room_id: int = Query(..., description="ID комнаты, для которой проверяется доступность"),
    session: AsyncSession = Depends(get_session),
):
    try:
        # Retrieve the room's bookings
        result = await session.execute(
            select(Booking).where(Booking.room_id == room_id)
        )
        bookings = result.scalars().all()

        # Extract booked dates from bookings
        booked_dates = []
        for booking in bookings:
            start_date = booking.start_date.date()
            end_date = booking.end_date.date()

            # Add all dates in the range [start_date, end_date]
            delta = end_date - start_date
            for i in range(delta.days + 1):
                booked_dates.append(start_date + timedelta(days=i))

        # Return unique booked dates
        return list(set(booked_dates))

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/categories", response_model=CategoryRead, tags=["Category"])
async def create_category(category: CategoryCreate, session: AsyncSession = Depends(get_session)):
    new_category = Category(value=category.value)

    session.add(new_category)
    await session.commit()
    await session.refresh(new_category)

    return new_category


@app.get("/categories", response_model=List[CategoryRead], tags=["Category"])
async def get_categories(request: Request, session: AsyncSession = Depends(get_session)):
    # auth_token = request.headers.get('Authorization')
    # await is_auth(auth_token)
    result = await session.execute(select(Category))
    categories = result.scalars().all()
    return categories


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
