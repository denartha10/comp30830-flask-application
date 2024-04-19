from flask import Flask, Response, abort, render_template, request, send_from_directory
from flask_caching import Cache
from flask_sqlalchemy import SQLAlchemy

import requests
from json import dumps

from utilities.map_utilities import determinePinColors, createInfoWindowContent
import pandas as pd

import os

from utilities.prediction_utilities import convert_date_and_time_to_day_hour, get_predictions, get_temp_rain_wind

configuration_dictionary = {
    "DEBUG": True,          # some Flask specific configs
    "CACHE_TYPE": "SimpleCache", # Flask-Caching related configs
    "CACHE_DEFAULT_TIMEOUT": 300
}

app = Flask(__name__, static_url_path='', static_folder='public')
app.config.from_mapping(configuration_dictionary)

cache = Cache(app)

stations_dict = {}


@app.route('/')
def index():
    visited = request.cookies.get("visited") if request.cookies.get("visited") else "false"
    return render_template("index.html", visited=visited)


@app.route('/stations', methods=['GET'])
def get_stations():
    api_key = 'c3888c0fb1578a56ea9015668577aa754fcbecd6'
    contract = 'Dublin'
    api_request = requests.get(f'https://api.jcdecaux.com/vls/v1/stations?contract={contract}&apiKey={api_key}')
    if api_request.status_code not in range(200, 299):
        abort(404)
    data_json = api_request.json()
    df = pd.DataFrame(data_json)
    bike_data = df[['number', 'address', 'position', 'available_bikes', 'available_bike_stands', 'status']]
    
    bike_data['lat'] = bike_data['position'].apply(lambda x: x['lat'])
    bike_data['lng'] = bike_data['position'].apply(lambda x: x['lng'])
    del bike_data['position']
    
    new_column_names = {
    'number': 'id',
    'address': 'name',
    'available_bike_stands': 'available_stands'
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
        "latitude": 52.54,
        "longitude": 13.41,
        "current": ["temperature_2m", "precipitation", "wind_speed_10m"],
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        json = response.json()["current"]
        data = [{
            "date_time": json['time'],
            "temperature": json["temperature_2m"],
            "precipitation": json["precipitation"],
            "wind": json["wind_speed_10m"]
        }]
        weather = dumps(data)
    else:
        weather = dumps([])
        
    return Response(weather, mimetype='application/json')


@app.route('/select_station')
def serve_bike_avg_json():
    bike_data_dir = os.path.join(app.root_path, 'bike_data')
    return send_from_directory(bike_data_dir, 'bike_avg.json')


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
    
    
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


if __name__ == '__main__':
    app.run(port=5000)
