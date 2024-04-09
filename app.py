from flask import Flask, Response, render_template, request
from flask_caching import Cache
from flask_sqlalchemy import SQLAlchemy
from utilities.models import Station
from utilities.map_utilities import determinePinColors, createInfoWindowContent
import pandas as pd
from dotenv import load_dotenv
import os

from utilities.prediction_utilities import convert_date_and_time_to_day_hour, get_predictions, get_temp_rain_wind

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

@app.route('/select/id', methods=['GET'])
def select_station(id):
    print(f"WE FETCHED THE {id}")
    select_station = db.session.query.filter_by(id=id).all() # Getting a warning about the filter by here??
    select_station_data = pd.DataFrame(select_station)
    json_data = select_station_data.to_json(orient='records', date_format='iso')
    return Response(json_data, mimetype='application/json')


@app.route('/predict', methods=['GET'])
def get_prediction():
    date = request.args.get("day")
    time = request.args.get("time")

    if date and time:
        (day, hour) = convert_date_and_time_to_day_hour(date, time)
        params = get_temp_rain_wind(date, hour)

        if params:
            (temp, wind, rain) = params
            print(day,hour, temp, wind, rain )
            prediction = get_predictions(day, hour, temp, rain, wind, 4)
            
            print(prediction)
            return f"{prediction}"
        else:
            return f"{date}, {time}, {params} GOT TO PARAMS"
    else:
        return f"{date}, {time}, GOT TO DATETIME"



if __name__ == '__main__':
    app.run(port=5000)
