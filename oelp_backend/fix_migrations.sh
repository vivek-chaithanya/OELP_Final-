#!/bin/bash

# Mark the problematic migration as already applied
python manage.py migrate models_app 0010_supportticket_ticketcomment_tickethistory --fake

# Now run all remaining migrations
python manage.py migrate
