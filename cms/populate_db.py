import datetime

def populate(session):
    """
    Adds fake data.
    """
    # Add user data
    with open('data/users.csv', 'r') as f:
        lines = f.readlines()

        fields = lines[0].strip().split(',')
        rest = [line.strip().split(',') for line in lines[1:]]

        for row in rest:
            job = row[4]
            name = row[1]
            desk = row[2]
            email = row[3]

            article_states = ArticleState.query.filter_by(name=job).all()

            # If we don't have this state yet, create it.
            if len(article_states) == 0:
                article_state = ArticleState(name=job)
                session.add(article_state)
                session.commit()
            else:
                article_state = article_states[0]

            user = Person(
                name = name,
                desk = desk,
                email = email,
                job_id = article_state.id
            )

            already_exists = len(Person.query.filter_by(name=user.name).all()) > 0

            if not already_exists:
                print "Adding user"
                session.add(user)
                session.commit()

    # Add article data
    staff = Person.query.all()
    article_data = [{
        "reporter": 1,
        "editor1": 2,
        "editor2": 3,
        "print_headline": "Joaquin Guzman Loera, Mexican Drug Kingpin Escapes Prison",
        "digital_headline": "Joaquin Guzman Loera Escapes",
        "byline": staff[1].name,
        "summary": "Mexican officials ...",
        "photo": "http://static01.nyt.com/images/2015/07/12/world/americas/13MEXICO/13MEXICO-master675.jpg",
        "section": "World"
    },
    {
        "reporter": 3,
        "editor1": 4,
        "editor2": 1,
        "print_headline": "Novak Djokovic Wins Wimbledon Title, Beating Roger Federer",
        "digital_headline": "Djokovic Beats Federer for Wimbledon Title",
        "byline": staff[4].name,
        "summary": "The top-seeded Djokovic defeated Federer in the final for the second straight year, earning his third Wimbledon title and his ninth Grand Slam trophy.",
        "photo": "http://static01.nyt.com/images/2015/07/12/sports/13TENNIS/13TENNIS-master675.jpg",
        "section": "Sports"
    }]

    for article in article_data:
        # Look it up by summary
        already_exists = len(Article.query.filter_by(summary=article["summary"]).all()) > 0

        if not already_exists:
            print "Adding article {0}".format(article["print_headline"])
            session.add(Article(
                reporter=article["reporter"],
                editor1=article["editor1"],
                editor2=article["editor2"],
                print_headline=article["print_headline"],
                digital_headline=article["digital_headline"],
                byline=article["byline"],
                summary=article["summary"],
                photo=article["photo"],
                section=article["section"]
            ))
            session.commit()

    # Add Action data
    # ToDo: we should first delete all the actions?

    description = db.Column(db.String)
    start_state_id = db.Column(db.Integer(), db.ForeignKey('article_state.id'), nullable=False)
    end_state_id = db.Column(db.Integer(), db.ForeignKey('article_state.id'), nullable=False)
    timestamp = db.Column(db.DateTime(), nullable=False)

    current_time = datetime.datetime.utcnow()
    action_data = [{
        "description": "Finished with draft.",
        "start_state_id": 1,
        "end_state_id": 2,
        "timestamp": current_time
    },
    {
        "description": "Changed intro. Please review",
        "start_state_id": 2,
        "end_state_id": 3,
        "timestamp": current_time + datetime.timedelta(0, 300) # add 300 seconds
    }]

    for action in action_data:
        session.add(Action(
            description=action["description"],
            start_state_id=action["start_state_id"],
            end_state_id=action["end_state_id"],
            timestamp = action["timestamp"]
        ))
        session.commit()
        print "Adding action {0}".format(action["description"])


if __name__ == "__main__":
    import cms
    from cms.models import *

    populate(cms.db.session())
