from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from controllers.booking import booking_router
from controllers.category import category_router
from controllers.room import room_router

app = FastAPI()

app.include_router(category_router)
app.include_router(booking_router)
app.include_router(room_router)


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