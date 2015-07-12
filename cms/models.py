from flask.ext.sqlalchemy import SQLAlchemy
from sqlalchemy.orm import exc
from cms import db

class ArticleState(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)

class Person(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True)
    name = db.Column(db.String)
    desk = db.Column(db.String)
    job_id = db.Column(db.Integer, db.ForeignKey('article_state.id'), nullable=False)

    # ToDo: Add twitter handle, desk Twitter handle?

class Action(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    article_id = db.Column(db.Integer, db.ForeignKey('article.id'), nullable=False)
    description = db.Column(db.String)
    start_state_id = db.Column(db.Integer(), db.ForeignKey('article_state.id'), nullable=False)
    end_state_id = db.Column(db.Integer(), db.ForeignKey('article_state.id'), nullable=False)
    timestamp = db.Column(db.DateTime(), nullable=False)

class Article(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String)
    reporter = db.Column(db.Integer, db.ForeignKey('person.id'), nullable=False)
    editor1 = db.Column(db.Integer, db.ForeignKey('person.id'), nullable=False)
    editor2 = db.Column(db.Integer, db.ForeignKey('person.id'), nullable=False)

    print_headline = db.Column(db.String)
    digital_headline = db.Column(db.String)
    mobile_headline = db.Column(db.String)
    byline = db.Column(db.String)
    summary = db.Column(db.String)
    body = db.Column(db.String)

    # ToDo: If there's extra time, add functionality for multiple photos
    photo = db.Column(db.String)
    section = db.Column(db.String)

    # ToDo: If there's extra time, add functionality for multiple tweets
    tweet = db.Column(db.String)
    dateline = db.Column(db.String)
