import os
from dotenv import load_dotenv
import sqlalchemy as db
import pandas as pd

user = 'Adam'
password = os.getenv('rds_pswrd')
host = '172.31.16.0/20'
port = '3306'
db_name = 'dublinbikesdb'

#default engine
engine = db.create_engine(f'mysql://{user}:{password}@{host}:{port}/{db_name}')