import firebase_admin
from firebase_functions import https_fn
from firebase_admin import firestore
import json

# preventing Firebase from being initialized multiple times and breaking your deployment/runtime.
# firebase deploy would hang and not deploy if firebase was intialized multiple times, so this is a way to prevent that from happening

def jsonResponse(data, status=200):
    return https_fn.Response(json.dumps(data), status=status, mimetype="application/json")


def initFirebase():
    if not firebase_admin._apps:
        firebase_admin.initialize_app()

def getDB():
    """
    will initalize Firebase app only once and then return a instance of firestore Database
    """
    initFirebase()
    return firestore.client()