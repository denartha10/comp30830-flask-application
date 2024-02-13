import os
import requests
from dotenv import load_dotenv
from ast import literal_eval

def load_bike_data():
    load_dotenv()
    api_key = os.getenv('bike_key')
    contract = 'Dublin'
    api_request = requests.get(f'https://api.jcdecaux.com/vls/v1/stations?contract={contract}&apiKey={api_key}')
    if api_request.status_code not in range(200, 299):
        print(api_request.reason)
        return
    return api_request

def relavent_bike_dict():
    data = load_bike_data()
    j_data = data.json()
    for d in j_data:
        #ALL RELAVENT DATA
        id = d['number']
        lat = d['position']['lat']
        lng = d['position']['lat']
        av_bike_stands = d['available_bike_stands']
        av_bikes = d['available_bikes']
        status = d['status']
        name = d['adress']
        timestamp = d['last_update']

relavent_bike_dict()