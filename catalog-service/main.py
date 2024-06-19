import requests
from fastapi import FastAPI, HTTPException

from controllers.category import category_router
from controllers.room import room_router

app = FastAPI()

app.include_router(room_router)
app.include_router(category_router)
app.include_router(category_router)

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
