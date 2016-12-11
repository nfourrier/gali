source activate py34 ; celery -A myApp.celery -l INFO worker ; celery -A myApp.celery -l INFO beat ; ping 127.0.0.1 -n 3 > nul ; celery -A myApp.celery flower --port=5555
