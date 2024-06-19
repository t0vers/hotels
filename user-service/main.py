from contextlib import asynccontextmanager

from alembic import command
from fastapi import FastAPI, Depends
from fastapi_users import FastAPIUsers
from uvicorn import Config
from fastapi.middleware.cors import CORSMiddleware

from auth.auth import auth_backend
from auth.manager import get_user_manager
from auth.schemas import UserRead, UserCreate
from models.user import User

fastapi_users = FastAPIUsers[User, int](
    get_user_manager,
    [auth_backend],
)

app = FastAPI()

current_user = fastapi_users.current_user()

origins = [
    "http://localhost",
    "http://localhost:4200",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept"],
)


@app.get("/protected-route")
def protected_route(user: User = Depends(current_user)):
    return {
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "role_id": user.role_id,
        "is_superuser": user.is_superuser
    }


app.include_router(
    fastapi_users.get_verify_router(UserRead),
    prefix="/auth",
    tags=["auth"],
)

app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/auth/jwt",
    tags=["auth"],
)

app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)
