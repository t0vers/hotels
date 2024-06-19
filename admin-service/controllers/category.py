from typing import List

from fastapi import Depends, APIRouter, Request, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_session
from models.models import CategoryCreate, CategoryRead, Category
from services.auth import is_auth

category_router = APIRouter()


@category_router.post("/categories", response_model=CategoryRead, tags=["Category"])
async def create_category(request: Request, category: CategoryCreate, session: AsyncSession = Depends(get_session)):
    auth_token = request.headers.get('Authorization')
    user_data = await is_auth(auth_token)

    if user_data["role_id"] != 2:
        raise HTTPException(status_code=403, detail="Permission Denied")

    new_category = Category(value=category.value)

    session.add(new_category)
    await session.commit()
    await session.refresh(new_category)

    return new_category


@category_router.get("/categories", response_model=List[CategoryRead], tags=["Category"])
async def get_categories(request: Request, session: AsyncSession = Depends(get_session)):
    auth_token = request.headers.get('Authorization')
    user_data = await is_auth(auth_token)

    if user_data["role_id"] != 2:
        raise HTTPException(status_code=403, detail="Permission Denied")

    result = await session.execute(select(Category))
    categories = result.scalars().all()
    return categories


@category_router.put("/categories/{category_id}", response_model=CategoryRead, tags=["Category"])
async def update_category(request: Request, category_id: int, updated_category: CategoryCreate,
                          session: AsyncSession = Depends(get_session)):
    auth_token = request.headers.get('Authorization')
    user_data = await is_auth(auth_token)

    if user_data["role_id"] != 2:
        raise HTTPException(status_code=403, detail="Permission Denied")

    result = await session.execute(select(Category).where(Category.id == category_id))
    category = result.scalar_one_or_none()

    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")

    category.value = updated_category.value

    session.add(category)
    await session.commit()
    await session.refresh(category)
    return category


@category_router.delete("/categories/{category_id}", response_model=CategoryRead, tags=["Category"])
async def delete_category(request: Request, category_id: int, session: AsyncSession = Depends(get_session)):
    auth_token = request.headers.get('Authorization')
    user_data = await is_auth(auth_token)

    if user_data["role_id"] != 2:
        raise HTTPException(status_code=403, detail="Permission Denied")

    result = await session.execute(select(Category).where(Category.id == category_id))
    category = result.scalar_one_or_none()

    if category is None:
        raise HTTPException(status_code=404, detail="Category not found")

    await session.delete(category)
    await session.commit()
    return category
