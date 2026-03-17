from dotenv import load_dotenv
import os
load_dotenv()
from fastapi import FastAPI
from app.database import engine, Base
from fastapi.middleware.cors import CORSMiddleware
import app.models
from app.routers import auth, users, orders, rates, shipments, dashboard

app = FastAPI(title="LogiMeds API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  #URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(orders.router)
app.include_router(rates.router)
app.include_router(shipments.router)
app.include_router(dashboard.router)

@app.get("/")
def root():
    return {"message": "LogiMeds Backend Running !!"}