from typing import List, Optional
from fastapi import Depends, HTTPException, APIRouter, Query, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_session
from models.models import Category, RoomRead, Room, RoomCreate

room_router = APIRouter()


@room_router.get("/rooms", response_model=List[RoomRead], tags=["Room"])
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


@room_router.post("/rooms", response_model=RoomRead, tags=["Room"])
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
        "description": new_room.description,
        "images": new_room.images
    }
    return response_data

@room_router.put("/rooms/{room_id}", response_model=RoomRead, tags=["Room"])
async def update_room(room_id: int, updated_room: RoomCreate, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Room).where(Room.id == room_id))
    room = result.scalar_one_or_none()

    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")

    result = await session.execute(select(Category).filter_by(id=updated_room.category_id))
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    room.title = updated_room.title
    room.category_id = updated_room.category_id
    room.price = updated_room.price
    room.images = updated_room.images
    room.description = updated_room.description

    session.add(room)
    await session.commit()
    await session.refresh(room)

    response_data = {
        "id": room.id,
        "title": room.title,
        "category": {"id": category.id, "value": category.value},
        "price": room.price,
        "description": room.description,
        "images": room.images
    }
    return response_data


@room_router.delete("/rooms/{room_id}", response_model=RoomRead, tags=["Room"])
async def delete_room(room_id: int, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Room).where(Room.id == room_id))
    room = result.scalar_one_or_none()

    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")

    await session.delete(room)
    await session.commit()

    category_result = await session.execute(select(Category).filter_by(id=room.category_id))
    category = category_result.scalar_one_or_none()
    category_data = {"id": category.id, "value": category.value} if category else {"id": None, "value": "Unknown"}

    response_data = {
        "id": room.id,
        "title": room.title,
        "category": category_data,
        "price": room.price,
        "description": room.description,
        "images": room.images
    }
    return response_data
