from authenticate import authenticateRequest
from firebase import getDB, jsonResponse
from validate import validateMovie, validateReview
# this file will handle reviews/comments

# auth Needed
def postUserReview(req):
    """
    how is request formated:
    {header: "Authorization": bearer <idToken>}

    payload:
        {
        "movieid: int,       (the movieID)
        "review": string       (the review text)
        }
    """
    # 1. Authenticate
    res = authenticateRequest(req)
    if not res["ok"]:
        return jsonResponse({"ok": False, "unauthorized": res['error']}, status=401)

    db = getDB()
    uid = res["user"]["uid"]

    # 2. Parse JSON body
    body = req.get_json(silent=True)
    if not body:
        return jsonResponse({"ok": False, "error": "Missing Body"}, status=400)

    # 3. Extract fields
    movieId = body.get("movieId")
    review = body.get("review")

    if movieId is None or review is None:
        return jsonResponse({"ok": False, "error": "Missing required fields (movieId, review)"}, status=400)

    # 4. Build clean object
    reviewData = {
        "userId": uid,
        "movieId": movieId,
        "review": review,
    }

    # 4b. Check if movieID is valid
    if not validateMovie(reviewData["movieId"]):
        return jsonResponse({"ok": False, "error": "Given movieId is not in Database"}, status=404)

    # 4c. Check if movieReview is already in database
    if validateReview(reviewData["review"], uid):
        return jsonResponse({"ok": False, "error": "Given review is already in Database"}, status=404)

    # 5. posting to data base
    db.collection("reviews").add(reviewData)

    return jsonResponse({"ok": True, "data": reviewData})


# auth Needed
def getUserReviews(req):
    """
    accesses database for reviews collection and then returns all the reviews given user has done
    
    how is request formated:
        {header: "Authorization": bearer <idToken>}
    """
    res = authenticateRequest(req)
    if not res["ok"]:
        return jsonResponse({"ok": False, "unauthorized": res['error']}, status=401)
    
    uid = res["user"]["uid"]

    db = getDB() # gets the firestore database instance
    docs = db.collection("reviews").stream()

    reviews = []
    for doc in docs:
        review = doc.to_dict()
        review["id"] = doc.id
        if review["userid"] == uid:
            reviews.append(review)

    # error handling should be added + log monitoring too maybe

    return jsonResponse({"ok": True, "data": reviews})


def getReviews(req): # for a single movie (post)
    """
    accesses database for reviews collection and then returns all the reviews given movieID has done

    how is request formated:
        {header: "Authorization": bearer <idToken>}

    payload:
        {
        "movieid: int,      (the movieID)
        }
    """

    # given a movieID -> return all reviews for that movie

    # parse for movieID
    # 2. Parse JSON body
    body = req.get_json(silent=True)
    if not body:
        return jsonResponse({"ok": False, "error": "Missing Body"}, status=400)

    # 3. Extract fields
    movieId = body.get("movieId")

    if movieId is None:
        return jsonResponse({"ok": False, "error": "Missing required field (movieId)"}, status=400)


    db = getDB() # gets the firestore database instance
    query = (db.collection("reviews").where("movieId", "==", movieId).stream())

    reviews = []
    for doc in query:
        review = doc.to_dict()
        review["id"] = doc.id
        reviews.append(review)

    if not reviews:
        reviews = "No Reviews Found"

    return jsonResponse({"ok": True, "data": reviews})