from flask import Flask, Response, abort, render_template, request, send_from_directory
from flask_caching import Cache
from flask_sqlalchemy import SQLAlchemy

import requests
import openmeteo_requests

from utilities.map_utilities import determinePinColors, createInfoWindowContent
import pandas as pd
from dotenv import load_dotenv
import os

from utilities.prediction_utilities import convert_date_and_time_to_day_hour, get_predictions, get_temp_rain_wind
from sqlalchemy.exc import SQLAlchemyError

# Load .env file
load_dotenv()

database_uri = os.getenv('DEV_DATABASE_URI')

configuration_dictionary = {
    "DEBUG": True,          # some Flask specific configs
    "CACHE_TYPE": "SimpleCache", # Flask-Caching related configs
    "CACHE_DEFAULT_TIMEOUT": 300,
    "SQLALCHEMY_DATABASE_URI": database_uri,
    "SQLALCHEMY_TRACK_MODIFICATIONS": False # to suppress a warning
}

app = Flask(__name__, static_url_path='', static_folder='public')
app.config.from_mapping(configuration_dictionary)

db = SQLAlchemy(app)
cache = Cache(app)

stations_dict = {}

@app.route('/')
def index():
    visited = request.cookies.get("visited") if request.cookies.get("visited") else "false"
    print(visited)
    return render_template("index.html", visited=visited)

@app.route('/stations', methods=['GET'])
def get_stations():
    api_key = 'c3888c0fb1578a56ea9015668577aa754fcbecd6'
    contract = 'Dublin'
    api_request = requests.get(f'https://api.jcdecaux.com/vls/v1/stations?contract={contract}&apiKey={api_key}')
    if api_request.status_code not in range(200, 299):
        print(api_request.reason)
        return []
    data_json = api_request.json()
    df = pd.DataFrame(data_json)
    bike_data = df[['number', 'address', 'position', 'available_bikes', 'available_bike_stands', 'status']]
    
    bike_data['lat'] = bike_data['position'].apply(lambda x: x['lat'])
    bike_data['lng'] = bike_data['position'].apply(lambda x: x['lng'])
    del bike_data['position']
    
    print(bike_data["lat"])
    new_column_names = {
    'number': 'id',
    'address': 'name',
    'available_bike_stands': 'available_stands',
    'status': 'status',
    }
    bike_data = bike_data.rename(columns=new_column_names)
    
    bike_data["pin_colors"] = bike_data.apply(determinePinColors, axis=1)
    bike_data["info_html"] = bike_data.apply(createInfoWindowContent, axis=1)
    
    json_data = bike_data.to_json(orient='records', date_format='iso')
    response = Response(json_data, mimetype='application/json')
    response.set_cookie("visited", "true")
    return response

@app.route('/weather', methods=['GET'])
def get_weather():
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
		"latitude": 53.35, #Dublin lat
		"longitude": 6.26, #Dublin lng
		"current": ["temperature_2m", "precipitation", "wind_speed_10m"]
	}
    openmeteo = openmeteo_requests.Client()
    api_request = openmeteo.weather_api(url, params=params)
    api_return = api_request[0].Current()
    weather_data = pd.DataFrame(api_return)
    json_data = weather_data.to_json(orient='records', date_format='iso')
    return Response(json_data, mimetype='application/json')

@app.route('/select/id', methods=['GET'])
def select_station(id):
    select_station = db.session.query.filter_by(id=id).all() # Getting a warning about the filter by here??
    if select_station is None:
        abort(404) 
    select_station_data = pd.DataFrame(select_station)
    json_data = select_station_data.to_json(orient='records', date_format='iso')
    return Response(json_data, mimetype='application/json')

@app.route('/predict', methods=['GET'])
def get_prediction():
    date = request.args.get("date")
    time = request.args.get("time")
    station_id = request.args.get("id")
    if date and time and station_id:
        (day, hour) = convert_date_and_time_to_day_hour(date, time)
        params = get_temp_rain_wind(date, hour)

        if params:
            (temp, wind, rain) = params
            prediction = get_predictions(day, hour, temp, rain, wind, station_id)
            return_dict = {
                "prediction": prediction,
                "temp": temp,
                "rain": rain,
                "wind": wind,
            }
            return return_dict
        else:
             abort(404)
    else:
         abort(404) 
         
@app.route('/bike_data/bike_avg.json')
def serve_bike_avg_json():
    bike_data_dir = os.path.join(app.root_path, 'bike_data')
    return send_from_directory(bike_data_dir, 'bike_avg.json')
    
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

if __name__ == '__main__':
    app.run(port=5000)
