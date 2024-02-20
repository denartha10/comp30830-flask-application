import openmeteo_requests

import requests_cache
from retry_requests import retry

from sqlalchemy import create_engine, Column, DateTime, Float
from sqlalchemy.orm import sessionmaker, declarative_base

from datetime import datetime, time
import pytz

dublin_timezone = pytz.timezone('Europe/Dublin') 
current_time_dublin = datetime.now(dublin_timezone)

Base = declarative_base()

class Weather(Base):
    __tablename__ = 'weather'
    date_time = Column(DateTime, primary_key=True)
    temperature = Column(Float)
    precipitation = Column(Float)
    wind = Column(Float)

    def __init__(self, date, temp, prec, wind):
        self.date_time = date
        self.temperature = temp
        self.precipitation = prec
        self.wind = wind

def api_call():
	url = "https://api.open-meteo.com/v1/forecast"
	params = {
		"latitude": 53.35, #Dublin lat
		"longitude": 6.26, #Dublin lng
		"current": ["temperature_2m", "precipitation", "wind_speed_10m"]
	}
	cache_session = requests_cache.CachedSession('.cache', expire_after = 3600)
	retry_session = retry(cache_session, retries = 5, backoff_factor = 0.2)
	openmeteo = openmeteo_requests.Client(session = retry_session)
	api_request = openmeteo.weather_api(url, params=params)
	return api_request[0].Current()

def engine_params():
    user = 'admin'
    password = 'kukfiv-zubsyd-1Pejpu'
    host = 'comp30830.c38umsk2i6vi.eu-north-1.rds.amazonaws.com'
    port = '3306'
    db_name = 'bike_db'
    return f'mysql+mysqlconnector://{user}:{password}@{host}:{port}/{db_name}'

def push_to_db():
    engine = create_engine(engine_params())

    Session = sessionmaker(bind=engine)
    session = Session()

    # Add new rows
    current = api_call()
    current_temperature = current.Variables(0).Value()
    current_precipitation = current.Variables(1).Value()
    current_wind_speed = current.Variables(2).Value()
    new_av = Weather(date = current_time_dublin, temp = current_temperature, prec = current_precipitation, wind = current_wind_speed)
    session.add(new_av)

    session.commit()
    session.close()

def is_closed(now):
    return time(0, 30) <= now <= time(5, 0)

if not is_closed(current_time_dublin.time()):
    push_to_db()