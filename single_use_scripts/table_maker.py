from sqlalchemy import create_engine, Column, Integer, String, Numeric, MetaData, BIGINT, DATETIME
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

def engine_params():
    user = 'admin'
    password = 'kukfiv-zubsyd-1Pejpu'
    host = 'database-1.c38umsk2i6vi.eu-north-1.rds.amazonaws.com'
    port = '3306'
    db_name = ''
    return f'mysql+mysqlconnector://{user}:{password}@{host}:{port}/{db_name}'

engine = create_engine(engine_params())
metadata = MetaData()

# Create a declarative base
Base = declarative_base()

class Station(Base):
    __tablename__ = 'stations'
    id = Column(Integer, primary_key=True)
    total_stands = Column(Integer)
    name = Column(String(128))
    pos_lat = Column(Numeric(precision=8, scale=6))
    pos_lng = Column(Numeric(precision=8, scale=6))

class Availability(Base):
    __tablename__ = 'availability'
    id = Column(Integer, primary_key=True)
    last_update = Column(BIGINT, primary_key=True)
    available_bikes = Column(Integer)
    available_stands = Column(Integer)
    status = Column(String(128))

class Weather(Base):
    __tablename__ = 'weather'
    date_time = Column(DATETIME, primary_key=True)
    temperature = Column(Numeric(precision=6, scale=3))
    precipitation = Column(Numeric(precision=6, scale=3))
    wind = Column(Numeric(precision=6, scale=3))

Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()
session.close()