import requests
from sqlalchemy import create_engine, Column, Integer, Float, String
from sqlalchemy.orm import sessionmaker, declarative_base

Base = declarative_base()

class Station(Base):
    __tablename__ = 'stations'
    id = Column(Integer, primary_key=True)
    total_stands = Column(Integer)
    name = Column(String)
    pos_lat = Column(Float)
    pos_lng = Column(Float)

    def __init__(self, id, stands, name, lat, lng):
        self.id = id
        self.total_stands = stands
        self.name = name
        self.pos_lat = lat
        self.pos_lng = lng

def api_call():
    api_key = 'c3888c0fb1578a56ea9015668577aa754fcbecd6'
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
    db_name = ''
    return f'mysql+mysqlconnector://{user}:{password}@{host}:{port}/{db_name}'

engine = create_engine(engine_params())

Session = sessionmaker(bind=engine)
session = Session()

# Add new rows
for d in api_call():
    new_station = Station(id = d['number'], stands = d['bike_stands'], name = d['address'], lat = d['position']['lat'], lng = d['position']['lng'])
    session.add(new_station)

session.commit()
session.close()