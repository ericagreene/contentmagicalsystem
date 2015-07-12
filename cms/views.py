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
    states = [{"id": a.id, "display_name": a.name} for a in ArticleState.query.all()]
    content = {} 
    #content = [{"id":a.id,"":a.} for a in ArticleState.query.all()]
    return jsonify(
        {
            "states": states,
            "content": content
        }
    )
