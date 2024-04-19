from sqlalchemy import create_engine, Column, Integer, String, DateTime, Float
from sqlalchemy.orm import sessionmaker, declarative_base
from datetime import datetime, time
import requests
import pytz

# Set up timezone for Dublin
current_time_dublin = datetime.now(pytz.timezone('Europe/Dublin'))

Base = declarative_base()

# Define Availability class for database model
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

# Define Stations class for database model
class Stations(Base):
    __tablename__ = 'stations'
    id = Column(Integer, primary_key=True)
    last_update = Column(DateTime)
    name = Column(String)
    available_bikes = Column(Integer)
    available_stands = Column(Integer)
    status = Column(String)
    lat = Column(Float)
    lng = Column(Float)

    def __init__(self, id, up, name, bikes, stands, status, lat, lng):
        self.id = id
        self.last_update = up
        self.name = name
        self.available_bikes = bikes
        self.available_stands = stands
        self.status = status
        self.lat = lat
        self.lng = lng


# Function to make API call and return JSON data
def api_call():
    api_key = 'c3888c0fb1578a56ea9015668577aa754fcbecd6'
    contract = 'Dublin'
    api_request = requests.get(f'https://api.jcdecaux.com/vls/v1/stations?contract={contract}&apiKey={api_key}')
    if api_request.status_code not in range(200, 299):
        print(api_request.reason)
        return []
    data_json = api_request.json()
    return data_json

# Function to set up database connection parameters
def engine_params():
    user = 'root'
    password = 'password'
    host = 'localhost'
    port = '4321'
    db_name = 'comp30830'
    return f'mysql+mysqlconnector://{user}:{password}@{host}:{port}/{db_name}'

data = api_call()

stations = [
    Stations(
        id = d['number'],
        up = datetime.fromtimestamp(d['last_update']/1000),
        name = d['address'], 
        bikes = d['available_bikes'], 
        stands = d['available_bike_stands'], 
        status = d['status'], 
        lat = d['position']['lat'], 
        lng = d['position']['lng']
    )
    for d in data
]

availabilities = [
    Availability(
        id = d['number'], 
        up = datetime.fromtimestamp(d['last_update']/1000), 
        bikes = d['available_bikes'], 
        stands = d['available_bike_stands'], 
        status = d['status']
    )
    for d in data
]

# Function to push data to the database
def push_to_db(stations: list[Stations], availabilities: list[Availability]):

    # create an engine instanse and a session
    engine = create_engine(engine_params())

    # create a session factory
    session_factory = sessionmaker(bind=engine)

    # start a session
    session = session_factory()

    # delete all the existing Stations from the stations table
    session.query(Stations).delete()
    
    try:
        # add all the new stations
        session.add_all(stations)
        session.commit()
    except:
        print("Failed to update stations")
        return False


    try:
        session.add_all(availabilities)
        session.commit()
    except:
        print("Failed to update the availabilities table")
        return False

    session.close()
    return True


# Function to check if the stations are closed
def is_closed(now):
    return time(0, 30) <= now <= time(5, 0)


# Main execution
if not is_closed(current_time_dublin.time()):
    data_push_successful = push_to_db(stations, availabilities)
    if data_push_successful:
        print("\nData pushed successfully\n")
    else:
        print("\nFailed to update table. Please check code\n")
