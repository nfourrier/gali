from data.basic.basicRequest import request
import os

A = {}
for reqName in request.keys():
    A['_'.join([idx.lower() for idx in reqName.split(" ")])] = {
        'name': reqName,
        'fct': 'call',
        'sql': request[reqName],
        'mach': 'default'
        }


PROJECT = {
    'project1_folderName':{
        'path': ['data','project1_folderName','tasks'],
        'name': 'Project 1 - Full Name',
        'desc': 'Description for project 1',
        'opt' : {
            'request': {
                'name': 'Request',
                'fct': 'request',
                'sql': '',
                'mach': 'default',
            },
            'update': {
                'name': 'Update',
                'fct': 'update',
                'sql': '',
                'mach': 'default',
            },
            'download': {
                'name': 'Download',
                'fct': 'download',
                'sql': '',
                'mach': 'default',
            }
        }
    },
        'project2_folderName':{
        'path': ['data','project2_folderName','tasks'],
        'name': 'Projejct 2 - Full Name',
        'desc': 'The project is designed to ...',
        'opt' : {
            'request':{
                'name': 'Request',
                'fct': 'request',
                'sql': '',
                'mach': 'default',
            },
            'preparation':{
                'name': 'Preparation',
                'fct': 'prep',
                'sql': '',
                'mach': 'default',
            },
            'update':{
                'name': 'Update',
                'fct': 'update',
                'sql': '',
                'mach': 'default',
            }

        }
    },
        'basic':{
        'path': ['data','basic','tasks'],
        'name': 'SQL requests',
        'desc': 'run SQL predefined SQL requests',
        'opt' : A
    },
}

