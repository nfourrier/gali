from celery.schedules import crontab

APP_NAME = 'nico'
SECRET_KEY = 'not_a_secret'
# CELERY_BROKER_URL='redis://localhost:6379/0'
CELERY_BROKER_URL = 'amqp://guest@localhost//'
CELERY_RESULT_BACKEND = 'amqp://guest@localhost//'

CELERY_ROUTES = {
    'tasks.nico': {'queue': 'red'},

#     'my_taskB': {'queue': 'for_task_B', 'routing_key': 'for_task_B'},
}
# CELERY_IMPORTS = ["data.alpha_vip.tasks.alpha_vip_request"]
# CELERY_IMPORTS = ["data.alpha_vip.tasks.request"]


# CELERY_QUEUES = (
#     Queue('default', Exchange('default'), routing_key='default'),
#     Queue('for_task_A', Exchange('for_task_A'), routing_key='for_task_A'),
#     Queue('for_task_B', Exchange('for_task_B'), routing_key='for_task_B'),
# )

CELERY_RESULT_PERSISTENT = True
# CELERY_TIMEZONE = 'UTC'
# CELERYD_CONCURRENCY = 1
# CELERY_RESULT_BACKEND='redis://localhost:6379/0'
CELERYBEAT_SCHEDULE = {
    # 'play-every-morning': {
    #     'task': 'tasks.nico',
    #     # 'schedule': crontab(hour=11, minute=7)
    #     'schedule': crontab(minute='*/10')
    # },
    'une-heure-cinq-test': {
        'task': 'tasks.nico',
        # 'schedule': crontab(hour=11, minute=7)
        'schedule': crontab(hour=1,minute='05')
    },
    # 'basic_JSON_handle': {
    #     'task': 'data.basic.tasks.call',
    #     # 'schedule': crontab(hour=11, minute=7)
    #     'schedule': crontab(hour=1,minute='10'),
    #     'args':[None,None,None,None]
    # },
    # 'alpha_vip_request': {
    #     'task': 'data.alpha_vip.tasks.request',
    #     # 'schedule': crontab(hour=11, minute=7)
    #     'schedule': crontab(hour=1,minute='10'),
    #     'args':[None,None]
    # },
    'alpha_vip_update': {
        'task': 'data.alpha_vip.tasks.update',
        # 'schedule': crontab(hour=11, minute=7)
        'schedule': crontab(hour=2,minute='10'),
        'args':[None,None]
    },
    'alpha_campaign_preparation': {
        'task': 'data.alpha_campaign.tasks.preparation',
        # 'schedule': crontab(hour=11, minute=7)
        'schedule': crontab(hour=1,minute='09'),
        'args':[None,None]
    },
    'alpha_campaign_request': {
        'task': 'data.alpha_campaign.tasks.request',
        # 'schedule': crontab(hour=11, minute=7)
        'schedule': crontab(minute='13,26,39,52'),
        'args':[None,None]
    },
    'alpha_campaign_update': {
        'task': 'data.alpha_campaign.tasks.update',
        # 'schedule': crontab(hour=11, minute=7)
        'schedule': crontab(hour='6,12,18,23',minute='12'),
        'args':[None,None]
    },
    # 'alpha_campaign_update': {
    #     'task': 'data.alpha_campaign.tasks.update',
    #     # 'schedule': crontab(hour=11, minute=7)
    #     'schedule': crontab(hour=2,minute='10'),
    #     'args':[None,None]
    # },
    # 'play-every-morning23': {
    #     'task': 'tasks.nico',
    #     # 'schedule': crontab(hour=11, minute=7)
    #     'schedule': crontab(hour=3,minute='10')
    # }
}

