from typing import List

from fastapi import Depends, APIRouter, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_session
from models.models import CategoryCreate, CategoryRead, Category

category_router = APIRouter()


@category_router.post("/categories", response_model=CategoryRead, tags=["Category"])
async def create_category(category: CategoryCreate, session: AsyncSession = Depends(get_session)):
    new_category = Category(value=category.value)

    session.add(new_category)
    await session.commit()
    await session.refresh(new_category)

    return new_category


@category_router.post("/categories", response_model=CategoryRead, tags=["Category"])
async def create_category(category: CategoryCreate, session: AsyncSession = Depends(get_session)):
    new_category = Category(value=category.value)

    session.add(new_category)
    await session.commit()
    await session.refresh(new_category)

    return new_category


@category_router.get("/categories", response_model=List[CategoryRead], tags=["Category"])
async def get_categories(request: Request, session: AsyncSession = Depends(get_session)):
    # auth_token = request.headers.get('Authorization')
    # await is_auth(auth_token)
    result = await session.execute(select(Category))
    categories = result.scalars().all()
    return categories
