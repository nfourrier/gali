# import myToken as nf
from __future__ import absolute_import

from os import getenv
import sys
import cx_Oracle
import datetime as dt
import os
import platform
import base64
import json
import pandas as pd
from collections import defaultdict
from celery.task import task
import celery

JSONpath = os.path.join(os.getcwd(),'data','output')
EXCELpath = os.path.join(os.getcwd(),'data', 'output')

@celery.task(name='data.basic.tasks.call')
def call(start_date,end_date,name,sql,*arg):
    utc = dt.datetime.utcnow()

    from data.basic import basicRequest
    sql = basicRequest.request[name]
    request = sl.format(start_date,end_date)

    #connect to the database
    #request the data as a pandas dataframe

    if('JSON' in name):
        name = name.replace("JSON ",'').replace(' ','_').lower()
        print('TO JSON')
        df.to_json(orient='index',path_or_buf='{}.json'.format(os.path.join(JSONpath,name)),date_unit='s')
    elif('-- Output Excel' in sql):
        print('TO EXCEL')
        # put the dataframe into an excel file
        filename = 'filename.xlsx'



    return filename


if __name__ == "__main__":
    request()
