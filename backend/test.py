import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

print("hello world! testing firebase connection!")

# Load env variables
load_dotenv(dotenv_path="backend/environments/.env")

# Get path from .env
cred_path = os.getenv("FIREBASE_CREDENTIALS")
print(cred_path) # testing if path is correct

# Initialize Firebase
cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred)

# Example: Firestore DB
db = firestore.client()

# Test write
doc_ref = db.collection("test").document("example")
doc_ref.set({
"message": "Firebase is working!"
})

print("Data written successfully")

# test read
doc = doc_ref.get()

if doc.exists:
    print(f"data was read correctly! {doc.to_dict()}")
else:
    print("No such document!")

