from typing import Optional

from fastapi import Request, Depends, requests
from fastapi_users import BaseUserManager, fastapi_users, models, IntegerIDMixin
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from fastapi_users.authentication import JWTStrategy
from httpx import AsyncClient

from auth.auth import SECRET
from auth.schemas import UserRead, UserCreate
from database.database import get_user_db

conf = ConnectionConfig(
    MAIL_USERNAME="srp-bez@mail.ru",
    MAIL_PASSWORD="AR1R6nEzDbSX4AdnzJag",
    MAIL_FROM="srp-bez@mail.ru",
    MAIL_PORT=587,
    MAIL_SERVER="smtp.mail.ru",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
)

fast_mail = FastMail(conf)


class UserManager(IntegerIDMixin, BaseUserManager[UserCreate, UserRead]):
    verification_token_secret = SECRET
    reset_password_token_secret = SECRET

    async def on_after_register(self, user: UserRead, request: Request):
        async with AsyncClient() as client:
            response = await client.post(
                f"{request.base_url}auth/request-verify-token",
                json={"email": user.email}
            )
            response.raise_for_status()

    async def send_verify_message(self, email: str, token: str):
        message = MessageSchema(
            subject="Verify your email",
            recipients=[email],
            body=f"{token}",
            subtype="html"
        )
        await fast_mail.send_message(message)

    async def on_after_request_verify(self, user: UserRead, token: str, request: Request):
        await self.send_verify_message(user.email, token)


def get_user_manager(user_db=Depends(get_user_db)):
    yield UserManager(user_db)
