Content Magical System
====================
## Setup
Install virtualenv:

    pip install virtualenv

Create a virtual environment from the root directory of this repo:

    virtualenv venv

All configurable variables must be stored in environment variables. To set the
environment variables:

    source local_helper.sh

Install dependencies:

    pip install -r requirements.txt

### Database
Create a postgresql database named `cms_development`. Then run:

    python manage.py db init

When there is a database change, you can generate an initial migration:

    python manage.py db migrate --message add_something_to_table

The migration script needs to be reviewed and edited, particularly if your
change involved indices. Once finalized, the migration script also needs to be
added to version control. Don't forget to add a useful message.

Then you can apply the migration to the database:

    python manage.py db upgrade
