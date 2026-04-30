from authenticate import authenticateRequest
from firebase import getDB, jsonResponse
from validate import validateMovie, validateReview
import json
# this file will handle reviews, ratings, likes/dislikes, comments, etc.. 

# these need to be real-time

# auth Needed
def postUserReview(req):
    # 1. Authenticate
    res = authenticateRequest(req)
    if not res["ok"]:
        return jsonResponse({"ok":False, "unauthorized": res['error']}, status=401)

    db = getDB()
    uid = res["user"]["uid"]

    # 2. Parse JSON body
    body = req.get_json(silent=True)
    if not body:
        return jsonResponse({"ok":False, "error": "Missing Body"}, status=400)

    # 3. Extract fields
    movieId = body.get("movieId")
    text = body.get("text")

    if not movieId or not text:
        return jsonResponse({"ok":False, "error":"Missing required fields (movieId, text)"}, status=404)

    # 4. Build clean object
    reviewData = {
        "userId": uid,
        "movieId": movieId,
        "text": text,
    }

    # 4b. Check if movieID is valid
    if not validateMovie(reviewData["movieId"]):
        return jsonResponse({"ok": False, "error": "Given movieId is not in Database"}, status=404)

    # 4c. Check if movieReview is already in database
    if validateReview(reviewData["text"], uid):
        return jsonResponse({"ok": False,"error": "Given review is already in Database"}, status=404)

    # 5. posting to data base
    db.collection("reviews").add(reviewData)

    return jsonResponse({"ok": True, "data": reviewData})



def postUserLike(req): # should handle both a dislike and a like
    # authenticate user
    res = authenticateRequest(req)

    if res["ok"] is False:
        return jsonResponse(f"Unauthorized: {res["error"]}", status=404)
    

    
    return  "NOT IMPLEMENTED YET" # we will implement this later


def getUserLikes(req): # NOT IMPLEMENTED
    """
    accesses database for reviews collection and then returns all the reviews given user has done
    """
    res = authenticateRequest(req)
    if not res["ok"]:
        return jsonResponse({"ok":False, "unauthorized": res['error']}, status=401)
    
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

    return jsonResponse(reviews)



def getUserReviews(req):
    """
    accesses database for reviews collection and then returns all the reviews given user has done
    """
    res = authenticateRequest(req)
    if not res["ok"]:
        return jsonResponse({"ok":False, "unauthorized": res['error']}, status=401)
    
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

    return jsonResponse(reviews)


def getReviews(req): # for a single movie NOT IMPLEMENTED
    """
    accesses database for reviews collection and then returns all the reviews given user has done
    """
    res = authenticateRequest(req)
    if not res["ok"]:
        return jsonResponse({"ok":False, "unauthorized": res['error']}, status=401)
    
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

    return jsonResponse(reviews)