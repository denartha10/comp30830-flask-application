import requests

from sqlalchemy import create_engine, Column, Integer, String, DateTime, Float
from sqlalchemy.orm import sessionmaker, declarative_base

from datetime import datetime, time
import pytz

#find current time
dublin_timezone = pytz.timezone('Europe/Dublin') 
current_time_dublin = datetime.now(dublin_timezone)

Base = declarative_base()

#python objects to push to db with alchemy
class Availability(Base):
    __tablename__ = 'availability'
    id = Column(Integer, primary_key=True)
    last_update = Column(DateTime, primary_key=True)
    available_bikes = Column(Integer)
    available_stands = Column(Integer)
    status = Column(String)

    def __init__(self, id, up, bikes, stands, status):
        self.id = id
        self.last_update = up
        self.available_bikes = bikes
        self.available_stands = stands
        self.status = status

class Stations(Base):
    __tablename__ = 'stations'
    id = Column(Integer, primary_key=True)
    last_update = Column(DateTime)
    available_bikes = Column(Integer)
    available_stands = Column(Integer)
    status = Column(String)
    lat = Column(Float)
    lng = Column(Float)

    def __init__(self, id, up, bikes, stands, status, lat, lng):
        self.id = id
        self.last_update = up
        self.available_bikes = bikes
        self.available_stands = stands
        self.status = status
        self.lat = lat
        self.lng = lng

#retuns json object array of bike stations
def api_call():
    api_key = 'c3888c0fb1578a56ea9015668577aa754fcbecd6'
    contract = 'Dublin'
    api_request = requests.get(f'https://api.jcdecaux.com/vls/v1/stations?contract={contract}&apiKey={api_key}')
    if api_request.status_code not in range(200, 299):
        print(api_request.reason)
        return
    data_json = api_request.json()
    return data_json

#parameters to connect to RDS db
def engine_params():
    user = 'admin'
    password = 'kukfiv-zubsyd-1Pejpu'
    host = 'comp30830.c38umsk2i6vi.eu-north-1.rds.amazonaws.com'
    port = '3306'
    db_name = 'bike_db'
    return f'mysql+mysqlconnector://{user}:{password}@{host}:{port}/{db_name}'

def push_to_db():
    #create connection to db
    engine = create_engine(engine_params())

    #session will allows us to push batches to db at once
    Session = sessionmaker(bind=engine)
    session = Session()
    data = api_call()
    
    #Delete current_av table so theres only ever one block of entries 
    session.query(Stations).delete()
    
    #Add new rows from api_call
    for d in data:
        new_current = Stations(id = d['number'], up = datetime.utcfromtimestamp(d['last_update']/1000), bikes = d['available_bikes'], stands = d['available_bike_stands'], status = d['status'], lat = d['position']['lat'], lng = d['position']['lng'])
        session.add(new_current)
    #Dont have the program crash if theres a duplicate primary key in there.
    try:
        session.commit()
    except:
        #change this to print error to file
        pass
    
    for d in data:
        new_av = Availability(id = d['number'], up = datetime.utcfromtimestamp(d['last_update']/1000), bikes = d['available_bikes'], stands = d['available_bike_stands'], status = d['status'])
        session.add(new_av)
    try:
        session.commit()
    except:
        #change this to print error to file
        pass

    session.close()

#check if the stations are closed
def is_closed(now):
    return time(0, 30) <= now <= time(5, 0)

#if stations open run the whole program
if not is_closed(current_time_dublin.time()):
    push_to_db()