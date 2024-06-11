from datetime import datetime
from typing import AsyncGenerator

from fastapi import Depends
from fastapi_users_db_sqlalchemy import SQLAlchemyUserDatabase, SQLAlchemyBaseUserTable
from sqlalchemy import Column, Boolean, String, Integer, TIMESTAMP, ForeignKey
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from models.user import Role

SQLALCHEMY_DATABASE_URL = "postgresql+asyncpg://postgres:1q2w3e4r5t!Q@user-db:5432/hotels"
Base = declarative_base()

engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL
)

async_session_maker = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class User(SQLAlchemyBaseUserTable[int], Base):
    id = Column("id", Integer, primary_key=True)
    email = Column("email", String, nullable=False)
    username = Column("username", String, nullable=False)
    registered_at = Column("registered_at", TIMESTAMP, default=datetime.now())
    role_id = Column("role_id", Integer, ForeignKey(Role.c.id))
    hashed_password: str = Column(String(length=1024), nullable=False)
    is_active: bool = Column(Boolean, default=True, nullable=False)
    is_superuser: bool = Column(Boolean, default=True, nullable=False)
    is_verified: bool = Column(Boolean, default=False, nullable=False)


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        yield session


async def get_user_db(session: AsyncSession = Depends(get_async_session)):
    yield SQLAlchemyUserDatabase(session, User)