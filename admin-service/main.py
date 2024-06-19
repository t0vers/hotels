from fastapi import FastAPI

from controllers.booking import booking_router
from controllers.category import category_router
from controllers.room import room_router

app = FastAPI()

app.include_router(category_router)
app.include_router(booking_router)
app.include_router(room_router)