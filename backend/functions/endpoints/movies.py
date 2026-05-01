from firebase import getDB, jsonResponse
from authenticate import authenticateRequest 

def getMovies(req):
    """
    accesses database for movies collection and then returns it to the user
    """
    db = getDB() # gets the firestore database instance
    docs = db.collection("movies").stream() # for now we are using the test message we created in ( EVENTUALLY IT WILL BE THE MOVIES COLLECTION WHEN ITS CREATED)

    movies = []
    for doc in docs:
        movie = doc.to_dict()
        movie["id"] = doc.id
        movies.append(movie)

    # error handling should be added + log monitoring too maybe
    if not movies:
        movies = "No movies Found"

    return jsonResponse({"ok": True, "data": movies})


def getMovieScore(req):
    """
    accesses database for movies collection and then returns the score (likes, dislikes, ratio) for a given movieID
    how is request formated:
        {header: "Authorization": bearer <idToken>}

    payload:
        {
        "movieid": int,       (the movieID)
        }

    """
    # 2. Parse JSON body
    body = req.get_json(silent=True)
    if not body:
        return jsonResponse({"ok":False, "error": "Missing Body"}, status=400)

    # 3. Extract fields
    movieId = body.get("movieId")

    if movieId is None:
        return jsonResponse({"ok":False, "error":"Missing required field (movieId)"}, status=400)


    db = getDB() # gets the firestore database instance
    query = (db.collection("movies").where("movieId", "==", movieId).stream())

    totalLikes = 0
    totalDislikes = 0
    totalCount = 0
    likeRatio = 0
    found = False
    
    
    for doc in query:
        found = True
        movieData = doc.to_dict()
        totalLikes = movieData.get("likes", 0)
        totalDislikes = movieData.get("dislikes", 0)
        totalCount = totalLikes + totalDislikes
        if totalCount > 0:
            likeRatio = totalLikes / (totalCount)

    if not found: # movie wasnt found in database
        return jsonResponse({"ok": False, "error": "Given movieId is not in Database"}, status=404)
        

    return jsonResponse({"ok": True, "data": {"totalCount": totalCount, "totalLikes": totalLikes, "totalDislikes": totalDislikes, "likeRatio": likeRatio}})


# hello World function, tests authentication
def helloWorld(req):
    """
    Hello World endpoint, a test for authentication
    If a idToken was given in the header, it will authenicate it with firebase and say Hello
    If a IdToken is invalid or not given, it will return Unauthorized


    how is request formated:
    {header: "Authorization": bearer <idToken>}

    """
    res = authenticateRequest(req)

    if res["ok"] is False:
        return jsonResponse({"ok": False, "unauthorized": {res["error"]}}, status=404)

    # Now you're authenticated
    uid = res["user"]["uid"]

    return jsonResponse({"ok": True, "data": f"Hello {uid}!"})