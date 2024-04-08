from flask_sqlalchemy import SQLAlchemy
from dataclasses import dataclass
from datetime import datetime

db = SQLAlchemy()

@dataclass
class Availability(db.Model):
    __tablename__ = 'availability'
    id: int = db.Column(db.Integer, primary_key=True)
    last_update: datetime = db.Column(db.DateTime, primary_key=True)
    available_bikes: int = db.Column(db.Integer)
    available_stands: int = db.Column(db.Integer)
    status: str = db.Column(db.String)

@dataclass
class Station(db.Model):
    __tablename__ = 'stations'
    id: int = db.Column(db.Integer, primary_key=True)
    last_update: datetime = db.Column(db.DateTime)
    name: str = db.Column(db.String)
    available_bikes: int = db.Column(db.Integer)
    available_stands: int = db.Column(db.Integer)
    status: str = db.Column(db.String)
    lat: float = db.Column(db.Float)
    lng: float = db.Column(db.Float)

@dataclass
class Weather(db.Model):
    __tablename__ = 'weather'
    date_time: datetime = db.Column(db.DateTime, primary_key=True)
    temperature: float = db.Column(db.Float)
    precipitation: float = db.Column(db.Float)
    wind: float = db.Column(db.Float)
