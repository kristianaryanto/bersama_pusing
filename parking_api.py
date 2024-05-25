from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

# Konfigurasi CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Mengizinkan semua origin
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"], # Mengizinkan metode permintaan yang diijinkan
    allow_headers=["*"], # Mengizinkan semua header
)

class Car(BaseModel):
    licensee: str

class ParkedCar(Car):
    arrival: datetime
    leave: Optional[datetime]
    is_parked: bool

cars = []
min_licensee_length = 4
pay_per_hour = 3000
pay_first_hour = 5000
total_places = 10

# 1. Mendapatkan daftar kendaraan yang sedang parkir
@app.get("/parked-cars", response_model=List[ParkedCar])
async def get_parked_cars():
    return [car for car in cars if car.is_parked]

# 2. Menambahkan kendaraan ke tempat parkir
@app.post("/parked-cars", response_model=ParkedCar)
async def park_car(car: Car):
    if len(car.licensee) < min_licensee_length:
        raise HTTPException(status_code=400, detail="License plate number is too short")
    if len(cars) >= total_places:
        raise HTTPException(status_code=400, detail="Parking is full")
    new_car = ParkedCar(**car.dict(), arrival=datetime.now(), leave=None, is_parked=True)
    cars.append(new_car)
    return new_car

# 3. Mengeluarkan kendaraan dari tempat parkir dan mengetahui rincian pembayaran
@app.put("/parked-cars/{licensee}", response_model=ParkedCar)
async def leave_parking_lot(licensee: str):
    for car in cars:
        if car.licensee == licensee and car.is_parked:
            car.leave = datetime.now()
            car.is_parked = False
            hours_parked = (car.leave - car.arrival).seconds // 3600
            bill = pay_first_hour + max(0, hours_parked - 1) * pay_per_hour
            return {**car.dict(), "bill": bill}
    raise HTTPException(status_code=404, detail="Car not found or already left")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
