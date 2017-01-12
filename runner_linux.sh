nohup celery -A myApp.celery -l INFO worker > worker.out ; nohup celery -A myApp.celery -l INFO beat > scheduler.out;  nohup celery -A myApp.celery flower --port=5555 > flower.out
