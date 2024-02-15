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
    data_json = api_request.json()
    return data_json