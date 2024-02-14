import os
import requests
from dotenv import load_dotenv

def api_call():
    load_dotenv()
    api_key = os.getenv('bike_key')
    contract = 'Dublin'
    api_request = requests.get(f'https://api.jcdecaux.com/vls/v1/stations?contract={contract}&apiKey={api_key}')
    if api_request.status_code not in range(200, 299):
        print(api_request.reason)
        return
    return api_request

def relavent_bike_dict():
    data = api_call()
    data_json = data.json()
    for d in data_json:
        #ALL RELAVENT DATA
        id = d['number']
        lat = d['position']['lat']
        lng = d['position']['lng']
        av_bike_stands = d['available_bike_stands']
        av_bikes = d['available_bikes']
        status = d['status']
        name = d['address']
        timestamp = d['last_update']
        print(id)
        print(lat)
        print(lng)
        print(av_bike_stands)
        print(av_bikes)
        print(status)
        print(name)
        print(timestamp)

relavent_bike_dict()