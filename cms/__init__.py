import os
import logging
from flask import Flask
from flask import render_template
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.cors import CORS

logger = logging.getLogger(__name__)
logging.basicConfig(level=os.environ.get("LOG_LEVEL", logging.INFO))


def create_app():
    app = Flask(__name__)
    cors = CORS(app)
    app.config['SQLALCHEMY_DATABASE_URI']='postgresql://' + os.environ['DB_USER'] + \
        ':' + os.environ['DB_PASSWORD'] + '@' + os.environ['DB_HOST'] + \
        ':' + os.environ['DB_PORT'] + '/' + os.environ['DB_NAME']

    db = SQLAlchemy(app)

    @app.errorhandler(500)
    def internal_error(exception):
        return "Some internal error has taken place."

    return app, db

(app, db) = create_app()

from cms import views
from cms import models
