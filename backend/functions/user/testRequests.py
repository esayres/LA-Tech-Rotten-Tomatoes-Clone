# this is a testing point to see if i can seend a request to firebase acting as frontend would have to interact w/ firebase functions.

import requests
from dotenv import load_dotenv
import os

currentDir = os.path.dirname(__file__)
envPath = os.path.abspath(os.path.join(currentDir, "../../environments/.env"))
print(envPath)

load_dotenv(envPath)


baseURL = os.getenv("BASEURL")
urlEndpoint = f"{baseURL}/postReview" # this is the endpoint for the hello world func

urlEndpoint2 = f"{baseURL}/postUserLike"

#res = requests.get(urlEndpoint2)
#print("Sending request without token....")
#print(res.json()) # should print unauthorized, since we didnt send any token


# what we need to solve next, we want authentication, so only the user can send the requests and not a random
# i want rate limiting, so if the user sends too many requests, it doesnt just bill me for 100k
# i also want to have basic error handling, and show casing 


# test login
APIKEY = os.getenv("APIKEY") # should be fine to expose, more or less used to identify the firebase project, BUT STILL BE CAREFUL
TESTEMAIL = os.getenv("TESTEMAIL")
TESTPASSWORD = os.getenv("TESTPASSWORD")


url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={APIKEY}"


payload = {
    "email": TESTEMAIL,
    "password": TESTPASSWORD,
    "returnSecureToken": True
}

res = requests.post(url, json=payload)
data = res.json()

# request failed, probably wrong password or something, so it ends here with error
if "idToken" not in data:
    print("Login failed:", data)
    exit()

idToken = data["idToken"] # so this should basically be the token that the frontend would send with the request in the header

#print("ID Token:", idToken)

headers = {
    "Authorization": f"Bearer {idToken}",
    "Content-Type": "application/json"
}

payload = {
    "movieId": 1,
    "rating": "dislike"
}

res = requests.post(urlEndpoint2, json=payload, headers=headers)

print(res.status_code)
print(res.json())




# same request but now we can test if it authenticates correctly and should print uid and email
#headers = {"Authorization": f"Bearer {idToken}"}
#res = requests.get(urlEndpoint2, headers=headers) 
#print("Sending request with token.... (should be authenticated and say hello <uid>!)")
#print(res.json())