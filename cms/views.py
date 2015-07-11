# -*- coding: utf-8 -*-
import logging
from models import *
from flask import request, jsonify
from sqlalchemy.orm.exc import MultipleResultsFound, NoResultFound
import werkzeug.exceptions as wze
from cms import app


@app.route('/article', methods=['GET'])
def article():
    return 'OK'
