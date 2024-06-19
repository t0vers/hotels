from typing import List

from fastapi import Depends, APIRouter, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database.database import get_session
from models.models import CategoryCreate, CategoryRead, Category

category_router = APIRouter()


@category_router.get("/categories", response_model=List[CategoryRead], tags=["Category"])
async def get_categories(request: Request, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Category))
    categories = result.scalars().all()
    return categories
