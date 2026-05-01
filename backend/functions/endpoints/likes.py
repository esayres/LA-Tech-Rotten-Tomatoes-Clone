from authenticate import authenticateRequest
from firebase import getDB, jsonResponse
from validate import validateMovie, validateLike


# auth Needed
def postUserLike(req): # should handle both a dislike and a like

    """
    how is request formated:
    {header: "Authorization": bearer <idToken>}

    payload:
        {
        "movieid": int,       (the movieID)
        "rating": string      (like, dislike)    
        }
    """

    # authenticate user
    res = authenticateRequest(req)

    if res["ok"] is False:
         return jsonResponse({"ok": False, "unauthorized": {res["error"]}}, status=404)
    

    db = getDB()
    uid = res["user"]["uid"]

    # 2. Parse JSON body
    body = req.get_json(silent=True)
    if not body:
        return jsonResponse({"ok":False, "error": "Missing Body"}, status=400)

    # 3. Extract fields
    movieId = body.get("movieId")
    rating = body.get("rating")

    if movieId is None or rating is None:
        return jsonResponse({"ok": False, "error": "Missing required fields (movieId, rating)"}, status=400)

    # 4. Build clean object
    reviewData = {
        "userId": uid,
        "movieId": movieId,
        "rating": rating,
    }
    # so we know the user is authenticated, 
    
    # check if movieID is valid
    if not validateMovie(reviewData["movieId"]):
        return jsonResponse({"ok": False, "error": "Given movieId is not in Database"}, status=404)
    
    # check if rating is valid (like/dislike)
    if reviewData["rating"].lower() not in {"like", "dislike"}:
        return jsonResponse({"ok": False, "error": "Given rating is not valid"}, status=400)
    
    # check if user already liked/disliked the movie, if they did, update it
    if validateLike(reviewData["movieId"], uid):
        # find the like document and update it
        updateLike(db, reviewData)
    else: # if not, add it to both
        db.collection("likes").add(reviewData)
        # find the movie document and update the like/dislike count
        query = (db.collection("movies").where("movieId", "==", reviewData["movieId"]).limit(1).stream())
        for doc in query:
            movieData = doc.to_dict()
            movieData["id"] = doc.id
            if reviewData["rating"].lower() == "like":
                doc.reference.update({"likes": movieData.get("likes", 0) + 1})
            else:
                doc.reference.update({"dislikes": movieData.get("dislikes", 0) + 1})
            break

    # successfully added like/dislike, return response
    return jsonResponse({"ok": True, "data": reviewData, "message": "Like/Dislike added"})

def updateLike(db, reviewData):
    """
    Updates an existing like/dislike for a user on a movie.
    
    returns: none, but updates the like accordingly
    """

    # data we need
    uid = reviewData["userId"]
    movieId = reviewData["movieId"]
    newRating = reviewData["rating"].lower()

    # 1. Find existing like
    query = (db.collection("likes").where("userId", "==", uid).where("movieId", "==", movieId).limit(1).stream())

    likeDoc = None
    for doc in query:
        likeDoc = doc
        break

    if not likeDoc:
        return

    oldData = likeDoc.to_dict()
    oldRating = oldData.get("rating")

    # 2. If no change -> exit early
    if oldRating == newRating:
        return

    # 3. Update like document
    likeDoc.reference.update({"rating": newRating})

    # 4. Update movie counts
    movieQuery = (db.collection("movies").where("movieId", "==", movieId).limit(1).stream())

    for doc in movieQuery:
        movieData = doc.to_dict()

        likes = movieData.get("likes", 0)
        dislikes = movieData.get("dislikes", 0)

        # adjust counts based on change
        if oldRating == "like" and newRating == "dislike":
            likes = max(likes - 1, 0)
            dislikes += 1

        elif oldRating == "dislike" and newRating == "like":
            dislikes = max(dislikes - 1, 0)
            likes += 1

        doc.reference.update({"likes": likes,"dislikes": dislikes})
        break
    return

# auth Needed
def getUserLikes(req): # NOT IMPLEMENTED
    """
    accesses database for reviews collection and then returns all the reviews given user has done
    """
    res = authenticateRequest(req)
    if not res["ok"]:
        return jsonResponse({"ok":False, "unauthorized": res['error']}, status=401)
    
    uid = res["user"]["uid"]

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
    # error handling should be added + log monitoring too maybe