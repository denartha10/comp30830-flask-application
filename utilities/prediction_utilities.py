import pickle
import requests
import pandas as pd
from datetime import datetime
from typing import Tuple

day = int
hour = int

def convert_date_and_time_to_day_hour(form_date: str, form_time: str) -> Tuple[day, hour]:
    date_obj = datetime.strptime(form_date, '%d-%m-%Y')
    day_of_week = date_obj.weekday() + 1 

    time_obj = datetime.strptime(form_time, '%H:%M')
    hour_of_day = time_obj.hour

    return (day_of_week, hour_of_day)


def get_temp_rain_wind(date, time):
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": 52.54,
        "longitude": 13.41,
        "hourly": ["temperature_2m", "rain", "wind_speed_10m"],
        "timezone": "GMT",
        "start_date": date,
        "end_date": date
    }
    response = requests.get(url, params=params)

    if response.status_code == 200:
        data_unprocessed = response.json()
        hourly_forecast = data_unprocessed["hourly"]
        data = pd.DataFrame(hourly_forecast)
        print(data.dtypes)
    else:
        print("Error fetching weather data")


# Create a function called get prediction with the named parameters above and station ID
def get_predictions(day: int, hour: int, temp: int, rain: int, wind: int, station_id: int):
    root='../comp30830-app/app/model_files/'
    file=f"model_{station_id}.pkl"
    
    # Example input data
    data = {
        'day': [day],
        'hour': [hour],
        'temp': [temp],
        'rain': [rain],
        'wind': [wind]
    }

    df = pd.DataFrame(data)

    try:
        with open(root+file, 'rb') as model_f:
            model = pickle.load(model_f)

        prediction_output = model.predict(df)
        prediction = prediction_output[0] 

        return prediction
    except FileNotFoundError:
        print(f"No model of name {file} found")
    except IndexError:
        print("Model returned no usable data")


get_temp_rain_wind("2024-04-12", "2")
