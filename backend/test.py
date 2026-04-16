import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

print("hello world! testing firebase connection!")

# Load env variables
load_dotenv(dotenv_path="backend/environments/.env")

# Get path from .env
cred_path = os.getenv("FIREBASE_CREDENTIALS")
print(cred_path)

# Initialize Firebase
cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred)

# Example: Firestore DB
db = firestore.client()

# Test write (this = "working instance")
doc_ref = db.collection("test").document("example")
doc_ref.set({
    "message": "Firebase is working!"
})

print("Data written successfully")