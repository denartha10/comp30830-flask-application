from flask import Flask
import pandas as pd
from sqlalchemy import create_engine
import json

def engine_params():
    user = 'admin'
    password = 'kukfiv-zubsyd-1Pejpu'
    host = 'database-1.c38umsk2i6vi.eu-north-1.rds.amazonaws.com'
    port = '3306'
    db_name = 'bike_db'
    return f'mysql+mysqlconnector://{user}:{password}@{host}:{port}/{db_name}'

app = Flask(__name__, static_url_path='')

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/stations')
def get_stations():
    engine = create_engine(engine_params())
    with engine.connect() as conn, conn.begin():
        data = pd.read_sql_table("stations", conn)
        conn.close()
        data_t = data.transpose()
        return data_t.to_json()

@app.route('/weather')
def get_weather():
    engine = create_engine(engine_params())
    with engine.connect() as conn, conn.begin():
        data = pd.read_sql_table("weather", conn)
        conn.close()
        data_t = data.transpose()
        return data_t.to_json()
    
    #NOT LIVE CURRENTLY PULLING 
@app.route('/test')
def getttt_weather():
    engine = create_engine(engine_params())
    with engine.connect() as conn, conn.begin():
        weather = pd.read_sql_table("weather", conn)
        bike_data = pd.read_sql_table("stations", conn)
        conn.close()
        bike_data_t = bike_data.transpose()
        weather_t = weather.transpose()
        dict = {
            'bike' : bike_data_t.to_json(),
            'weather' : weather_t.to_json()
        }
        return json.dumps(dict)

if __name__ == '__main__':
    app.run(debug=True)
