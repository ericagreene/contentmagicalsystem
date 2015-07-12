def populate(session):
    """
    Adds fake data.
    """
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
                name= name,
                desk= desk,
                email= email,
                job_id= article_state.id
            )

            session.add(user)

    session.commit()

if __name__ == "__main__":
    import cms
    from cms.models import Person, ArticleState

    populate(cms.db.session())
