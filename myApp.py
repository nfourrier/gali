from __future__ import absolute_import
import sys
from flask import Flask, Blueprint, abort, jsonify, request, session, render_template
from flask import url_for, make_response, send_file, redirect
from celery import Celery
from celery import current_app
from celery.task.control import inspect
from os import path, environ
import os
import json
from bson import json_util
from bson.json_util import dumps
from collections import defaultdict
import datetime as dt
import time
import importlib

import settings
from data.project import PROJECT


'''
To execute this program (tasks.py):
    - In a terminal launch the worker:
            celery -A tasks.celery worker
            celery -A tasks.celery worker -Q red -n nicoworker
            The latter will manage the queue red and the worker will be named nicoworker
            -n is mandatory if you have several workers
    - In a terminal launch the beat (scheduler):
            celery -A tasks.celery beat
    - (optional) In a terminal launch the logger:
            celery -A tasks.celery flower --port=5555
            notez que si le broker est ampq, il faut parfois activer les plugins:
                aller dans rabbitmq / ... /sbin
                executer rabbitmq-plugins(.bat) enable rabbitmq-management
    - executer python (python tasks.py)
    - le site se trouve sur http://localhost:5000/test
    - le log se trouve sur http://localhost:5555/dashboard
    - cx_Oracle is required to run this program (it is imported in basic)
    - data/project contains the link to the various project
    (basic project is commented at the moment since it requires cx_Oracle) 
'''


module_list  = {}
for proj in PROJECT.keys():
    module_list[proj] = importlib.import_module('.'.join(PROJECT[proj]['path']), package=None)
    path = PROJECT[proj]['path']


app = Flask(settings.APP_NAME)
app.config.from_object(settings)




def make_celery(app):
    celery = Celery(app.import_name, broker=app.config['CELERY_BROKER_URL'])
    celery.conf.update(app.config)
    TaskBase = celery.Task
    class ContextTask(TaskBase):
        abstract = True
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return TaskBase.__call__(self, *args, **kwargs)
    celery.Task = ContextTask
    return celery



celery = make_celery(app)
i = inspect()


@app.route("/slides/<option>")
def slidesShow(option):
    return render_template("index_dasakl.html")

def loadJSONdata(filename="2015-09-07", folder="iaa"):
    json_projects = []
    with open(os.path.join('data', folder, filename+'.json')) as data_file:
        data = json.load(data_file)
    for project in data.keys():
        json_projects.append(data[project])

    json_projects = json.dumps(json_projects, default=json_util.default)
    # print(json_projects,file=sys.stderr)
    if("sun" in filename.lower()):
        return jsonify(data)
    else:
        return(json_projects)

@app.route('/projectList', methods=['GET','POST'])
def make_projectList():
    return jsonify(PROJECT)

@app.route('/requestList/<request>', methods=['GET','POST'])
def make_requestList(request):
    return jsonify(PROJECT)

@app.route("/loadADDjson/<game>/<option>")
def testVarAppRoute2(game, option):
    print('loadADDjson',file=sys.stderr)
    #loadJSONdata(str(year)+"-"+str(09)+"-"+str(07))
    return loadJSONdata(filename=option, folder=game)

@app.route("/project/<projectName>", methods=['GET','POST'])
def run_project(projectName):
    print('project',file=sys.stderr)
    dico = defaultdict(bool)
    dico['received time'] = dt.datetime.utcnow()
    dico['project'] = projectName
    dico['status'] = 'Success'
    dico['download'] = 0
    dico['filename'] = ''

    params = request.get_json()['request_params']
    proj_param = PROJECT[params['project_name']]
    req_param = PROJECT[params['project_name']]['opt'][params['request_name']]

    path = os.sep.join(proj_param['path'])
    script = req_param['fct']
    machine = req_param['mach']

    project_name = params['project_name']
    request_name = params['request_name']
    function=getattr(module_list[project_name],req_param['fct'])
    A = function.delay(params['start_date'],params['end_date'],req_param['name'],req_param['sql'])

    if('-- Output Excel' in req_param['sql']):
        while(not A.ready()):
            pass

        if(A.successful()):
            filename = A.get()
        dico['download'] = 1
        dico['filename'] = filename

    return jsonify(dico)

@app.route("/loadJson/<game>/<year>/<month>/<day>")
def testVarAppRoute(game, year, month, day):
    import sys
    print('loadJson',file=sys.stderr)
    #loadJSONdata(str(year)+"-"+str(09)+"-"+str(07))
    dataDate = year+"-"+month+"-"+day
    return loadJSONdata(filename=dataDate, folder=game)

@app.route('/upload', methods=['POST'])
def upload():
    print('in upload')
    # Get the name of the uploaded file
    file = request.files['file']
    # Check if the file is one of the allowed types/extensions
    if file and file.filename.rsplit('.', 1)[-1] in ['csv','xlsx']:
        # Make the filename safe, remove unsupported chars
        print(file.filename)
        from werkzeug import secure_filename
        filename = secure_filename(file.filename)
        # filename = file.filename
        # Move the file form the temporal folder to
        # the upload folder we setup
        file.save(os.path.join('data','upload', filename))
        print(filename)
        # Redirect the user to the uploaded_file route, which
        # will basicaly show on the browser the uploaded file
        return 'file {} uploaded'.format(filename)

if __name__ == "__main__":
    port = int(environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
    # my_monitor(celery)
