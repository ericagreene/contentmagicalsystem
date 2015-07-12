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
    python manage.py db upgrade

To load fake data, run

    python cms/populate_db.py
