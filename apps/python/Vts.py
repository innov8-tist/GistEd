from fastapi import FastAPI
from pydantic import BaseModel
import datetime

app = FastAPI()
class ChatMessage(BaseModel):
    id: str
    sender: str
    content: str
    timestamp: datetime.datetime

@app.post("/log-message/")
async def log_message(message: ChatMessage):
    print(f"Received Message: {message}")
    return {"status": "Message logged successfully"}
