# -*- coding: utf-8 -*-
import logging
from models import *
from flask import request, jsonify
from sqlalchemy.orm.exc import MultipleResultsFound, NoResultFound
import werkzeug.exceptions as wze
from cms import app


@app.route('/article', methods=['GET'])
def article():
    article_id = request.args.get("article_id", None)

    if article_id is None:
        raise wze.BadRequest("The 'article_id' parameter must be specified")
    else:
        article = Article.query.find(article_id)

        if article is None:
            raise wze.NotFound("No data for article: %s" % article_id)
        else:
            return jsonify(article)

@app.route('/dashboard', methods=['GET'])
def dashboard():
    return "This should be a dashboard..."

def send_email(email_address, body):
    """
    Sends email to specified email address.
    """
    pass

def send_to_wordpress(headline, body):
    """
    Creates a new post with the specified headline and body
    """
    pass
