import requests
import httplib2
import os
import base64
import email
import json

import apiclient
from apiclient import discovery
from oauth2client import client
from oauth2client.file import Storage
from oauth2client.client import flow_from_clientsecrets
from oauth2client.tools import run


def get_email_list(service):
	message_feed = service.users().messages().list(userId='me').execute().get('messages')
	message_ids = []
	for message in message_feed[:10]:
		message_id = message['id']
		message_ids.append(message_id)

	return message_ids


def get_raw_email(service, message_id):
	raw_email = service.users().messages().get(userId='me',
                                               id=message_id,
                                               format='raw').execute()
	return raw_email


def parse_email(raw_email):
    kept_fields = ['Date', 'Message-ID', 'Subject', 'From']
    email_str = base64.urlsafe_b64decode(raw_email['raw'].encode('utf-8'))
    email_meta = email.message_from_string(email_str)
    parsed_email = {key: email_meta.get(key, None) for key in kept_fields}
    
    msg_body = email_meta.get_payload()[0].get_payload()
    parsed_email['body'] = msg_body
    
    return parsed_email


def authenticate():
    oauth_loc = "./gmail_auth/CMS_auth_storage.json"
    secrets_loc = "./gmail_auth/client_secret_212868439610-rli4uukf7qk4bmknc3buk3gvv0pb9jhh.apps.googleusercontent.com.json"

    full_path = os.path.abspath(oauth_loc)
    print full_path
    storage = Storage(full_path)
    print storage
    credentials = storage.get()
    if credentials is None or credentials.invalid:
        credentials = run(flow_from_clientsecrets(secrets_loc, scope=["https://www.googleapis.com/auth/gmail.modify"]), storage)
    if credentials.access_token_expired:
        credentials.refresh(httplib2.Http())
    
    http = credentials.authorize(httplib2.Http())
    service = apiclient.discovery.build('gmail', 'v1', http=http)

    return service


def retrieve_email():
    service = authenticate()

    #old_msg_ids = []
    ten_msg_ids = get_email_list(service)
    for msg_id in ten_msg_ids:
        #if msg_id not in old_msg_ids:
        raw_email = get_raw_email(service, msg_id)
        parsed_email = parse_email(raw_email)
        print '-----------------------'
        for key, value in parsed_email.iteritems():
            print key, '\n', value, '\n\n'


retrieve_email()