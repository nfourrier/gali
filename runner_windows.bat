rem activate py34 & start cmd /K celery -A myApp.celery -l INFO worker  & start cmd /K celery -A myApp.celery -l INFO beat
rem activate py34 & start cmd /K celery -A myApp.celery -l INFO worker
activate py34 & start cmd /K celery -A myApp.celery -l INFO worker & start cmd /K celery -A myApp.celery -l INFO beat & ping 127.0.0.1 -n 3 > nul & start cmd /K celery -A myApp.celery flower --port=5555
