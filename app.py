from flask import Flask, Response, render_template
from flask_caching import Cache
from flask_sqlalchemy import SQLAlchemy
from utilities.models import Station, Weather
from utilities.map_utilities import determinePinColors, createInfoWindowContent
import pandas as pd
from dotenv import load_dotenv
import os

# Load .env file
load_dotenv()

# decide database for prod or dev
database_uri = os.getenv('DEV_DATABASE_URI')
# database_uri = os.getenv('PROD_DATABASE_URI')

configuration_dictionary = {
    "DEBUG": True,          # some Flask specific configs
    "CACHE_TYPE": "SimpleCache", # Flask-Caching related configs
    "CACHE_DEFAULT_TIMEOUT": 300,
    "SQLALCHEMY_DATABASE_URI": database_uri,
    "SQLALCHEMY_TRACK_MODIFICATIONS": False # to suppress a warning
}

app = Flask(__name__, static_url_path='')
app.config.from_mapping(configuration_dictionary)

db = SQLAlchemy(app)
cache = Cache(app)

stations_dict = {}

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/stations', methods=['GET'])
def get_stations():
    stations = db.session.query(Station).all()
    bike_data = pd.DataFrame(stations)
    bike_data["pin_colors"] = bike_data.apply(determinePinColors, axis=1)
    bike_data["info_html"] = bike_data.apply(createInfoWindowContent, axis=1)
    json_data = bike_data.to_json(orient='records', date_format='iso')
    return Response(json_data, mimetype='application/json')

@app.route('/weather', methods=['GET'])
def get_weather():
    weather = db.session.query(Weather).all()
    weather_data = pd.DataFrame(weather)
    json_data = weather_data.to_json(orient='records', date_format='iso')
    return Response(json_data, mimetype='application/json')

@app.route('/select/<id>', methods=['GET'])
def select_station(id : int):
    print(id)
    select_station = db.session.query(Station).filter_by(id=id).all()
    select_station_data = pd.DataFrame(select_station)
    json_data = select_station_data.to_json(orient='records', date_format='iso')
    return Response(json_data, mimetype='application/json')
        
if __name__ == '__main__':
    app.run(port=5000)
