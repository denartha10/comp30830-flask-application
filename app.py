from flask import Flask, jsonify
from flask_caching import Cache
import pandas as pd
from sqlalchemy import create_engine

config = {
    "DEBUG": True,          # some Flask specific configs
    "CACHE_TYPE": "SimpleCache",  # Flask-Caching related configs
    "CACHE_DEFAULT_TIMEOUT": 300
}

app = Flask(__name__, static_url_path='')
app.config.from_mapping(config)
cache = Cache(app)

def engine_paramss():
    user = 'admin'
    password = 'kukfiv-zubsyd-1Pejpu'
    host = 'database-1.c38umsk2i6vi.eu-north-1.rds.amazonaws.com'
    port = '3306'
    db_name = 'bike_db'
    return f'mysql+mysqlconnector://{user}:{password}@{host}:{port}/{db_name}'

#--------------------------- DELETE BEFORE PUSHING
def engine_params():
    user = 'root'
    password = 'Onion100$$'
    host = 'localhost'
    port = '3306'
    db_name = 'alchemy_test'
    return f'mysql+mysqlconnector://{user}:{password}@{host}:{port}/{db_name}'
#---------------------------

@app.route('/')
def index():
    return app.send_static_file('index.html')
 
@app.route('/data')
def pull_data():
    engine = create_engine(engine_params())
    with engine.connect() as conn, conn.begin():
        weather = pd.read_sql_table("weather", conn)
        #only use the most recent weather entry bc thats current
        weather_last = weather.tail(1)
        bike_data = pd.read_sql_table("stations", conn)
        conn.close()
        bike_data_t = bike_data.transpose()
        weather_t = weather_last.transpose()
        dict = {
            'bike' : bike_data_t.to_json(),
            'weather' : weather_t.to_json()
        }
        return jsonify(dict)

if __name__ == '__main__':
    app.run(debug=True)
