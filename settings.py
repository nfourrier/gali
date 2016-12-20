from celery.schedules import crontab

APP_NAME = 'nico'
SECRET_KEY = 'not_a_secret'
CELERY_BROKER_URL = 'amqp://guest@localhost//'
CELERY_RESULT_BACKEND = 'amqp://guest@localhost//'

# to get it work:
# >> pip install -U "celery[redis]"
# start the server
# >> redis-server
# CELERY_BROKER_URL='redis://localhost:6379/0'
# CELERY_RESULT_BACKEND='redis://localhost:6379/0'


CELERY_RESULT_PERSISTENT = True

CELERYBEAT_SCHEDULE = {
    'alpha_vip_update': {
        'task': 'data.project1_folderName.tasks.update',
        'schedule': crontab(hour=2,minute='10'),
        'args':[None,None]
    },
    'alpha_campaign_preparation': {
        'task': 'data.project2_folderName.tasks.preparation',
        'schedule': crontab(hour=1,minute='09'),
        'args':[None,None]
    }
}

