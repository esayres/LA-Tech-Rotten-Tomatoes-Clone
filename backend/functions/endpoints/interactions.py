from firebase_functions import https_fn
from authenticate import authenticateRequest
from firebase import getDB
from validate import validateMovie, validateReview
import json
# this file will handle reviews, ratings, likes/dislikes, comments, etc.. 

# these need to be real-time

# auth Needed
def postReview(req):
    # 1. Authenticate
    res = authenticateRequest(req)
    if not res["ok"]:
        return https_fn.Response(json.dumps({"ok":False, "unauthorized": res['error']}), status=401, mimetype="application/json")

    db = getDB()
    uid = res["user"]["uid"]

    # 2. Parse JSON body
    try:
        body = req.get_json()
    except Exception:
        return https_fn.Response(json.dumps({"ok":False, "error": "Invalid JSON"}), status=400, mimetype="application/json")

    if not body:
        return https_fn.Response(json.dumps({"ok":False, "error": "Missing Body"}), status=400, mimetype="application/json")

    # 3. Extract fields
    movieId = body.get("movieId")
    text = body.get("text")

    if not movieId or not text:
        return https_fn.Response(json.dumps({"ok":False, "error":"Missing required fields (movieId, text)"}), mimetype="application/json")

    # 4. Build clean object
    reviewData = {
        "userId": uid,
        "movieId": movieId,
        "text": text,
    }

    # 4b. Check if movieID is valid
    if not validateMovie(reviewData["movieId"]):
        return https_fn.Response(json.dumps({"ok": False, "error": "Given movieId is not in Database"}), mimetype="application/json")

    # 4c. Check if movieReview is already in database
    if not validateReview(reviewData["text"], uid):
        return https_fn.Response(json.dumps({"ok": False,"error": "Given review is already in Database"}), mimetype="application/json")

    # 5. posting to data base
    db.collection("reviews").add(reviewData)

    return https_fn.Response(json.dumps({"ok": True, "data": reviewData}), mimetype="application/json")



def postLike(req): # should handle both a dislike and a like
    # authenticate user
    res = authenticateRequest(req)

    if res["ok"] is False:
        return https_fn.Response(f"Unauthorized: {res["error"]}", status=404)
    

    
    return  "NOT IMPLEMENTED YET" # we will implement this later

def postComment(req):
    # authenticate user
    res = authenticateRequest(req)

    if res["ok"] is False:
        return https_fn.Response(f"Unauthorized: {res["error"]}", status=404)
    

    return  "NOT IMPLEMENTED YET"



def getReviews(req):
    """
    accesses database for reviews collection and then returns all the reviews given user has done
    """
    res = authenticateRequest(req)
    if not res["ok"]:
        return https_fn.Response(
            f"Unauthorized: {res['error']}",
            status=401
        )
    
    uid = res["user"]["id"]

    db = getDB() # gets the firestore database instance
    docs = db.collection("reviews").stream()

    reviews = []
    for doc in docs:
        review = doc.to_dict()
        review["id"] = doc.id
        if review["userid"] == uid:
            reviews.append(reviews)

    # error handling should be added + log monitoring too maybe

    return reviews