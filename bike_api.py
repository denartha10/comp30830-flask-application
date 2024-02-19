import os
import requests
from dotenv import load_dotenv

from sqlalchemy import create_engine, Column, Integer, BIGINT, String, MetaData
from sqlalchemy.orm import sessionmaker, declarative_base

from datetime import datetime, time
import pytz

Base = declarative_base()

class Availability(Base):
    __tablename__ = 'availability'
    id = Column(Integer, primary_key=True)
    last_update = Column(BIGINT, primary_key=True)
    available_bikes = Column(Integer)
    available_stands = Column(Integer)
    status = Column(String)

    def __init__(self, id, up, bikes, stands, status):
        self.id = id
        self.last_update = up
        self.available_bikes = bikes
        self.available_stands = stands
        self.status = status

def api_call():
    load_dotenv()
    api_key = os.getenv('bike_key')
    contract = 'Dublin'
    api_request = requests.get(f'https://api.jcdecaux.com/vls/v1/stations?contract={contract}&apiKey={api_key}')
    if api_request.status_code not in range(200, 299):
        print(api_request.reason)
        return
    data_json = api_request.json()
    return data_json

def engine_params():
    user = 'admin'
    password = 'kukfiv-zubsyd-1Pejpu'
    host = 'database-1.c38umsk2i6vi.eu-north-1.rds.amazonaws.com'
    port = '3306'
    db_name = 'bike_db'
    return f'mysql+mysqlconnector://{user}:{password}@{host}:{port}/{db_name}'

def push_to_db():
    engine = create_engine(engine_params())
    metadata = MetaData()

    Session = sessionmaker(bind=engine)
    session = Session()

    # Add new rows
    for d in api_call():
        new_av = Availability(id = d['number'], up = d['last_update'], bikes = d['available_bikes'], stands = d['available_bike_stands'], status = d['status'])
        session.add(new_av)

    session.commit()
    session.close()

def is_valid_time(now):
    return time(0, 30) <= now <= time(5, 0)

dublin_timezone = pytz.timezone('Europe/Dublin') 
current_time_dublin = datetime.now(dublin_timezone)

if is_valid_time(current_time_dublin.time()):
    push_to_db()