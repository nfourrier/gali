from __future__ import absolute_import
import datetime as dt
from os import getenv
import os
import sys
from collections import defaultdict
from celery.task import task
import celery

EXCELpath = os.path.join(os.getcwd(),'data', 'output')

@celery.task(name='data.project2_folderName.tasks.request')
def request(x,*arg):
    utc = dt.datetime.utcnow()
    return utc

@celery.task(name='data.project2_folderName.tasks.preparation')
def prep(start_date,end_date,*arg):
    utc = dt.datetime.utcnow()
    return utc

@celery.task(name='data.project2_folderName.tasks.update')
def update(start_date,end_date,*arg):
    utc = dt.datetime.utcnow()
    return utct

if __name__ == "__main__":
    request()
