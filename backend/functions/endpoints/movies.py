from firebase import getDB, jsonResponse
from authenticate import authenticateRequest 

def getMovies(req):
    """
    accesses database for movies collection and then returns it to the user
    how is request formated:
    {header: "Authorization": bearer <idToken>}

    
    /getMovies?startAfter=0&limit=20
    """
    queryParams = req.args if hasattr(req, "args") else {}

    limit = int(queryParams.get("limit", 20))
    startAfterId = queryParams.get("startAfter")  # cursor

    db = getDB()

    query = db.collection("movies").order_by("movieId").limit(limit)

    # if cursor exists, start after last document
    if startAfterId:
        last_doc = db.collection("movies").document(startAfterId).get()
        if last_doc.exists:
            query = query.start_after(last_doc)

    docs = query.stream()

    movies = []
    last_doc_id = None

    for doc in docs:
        movie = doc.to_dict()
        movie["id"] = doc.id
        movies.append(movie)
        last_doc_id = doc.id

    return jsonResponse({
        "ok": True,
        "data": {
            "movies": movies,
            "nextCursor": last_doc_id
        }
    })
    #return jsonResponse({"ok": True,"data": {"movies": movies, "pagination": {"currentPage": page,"totalPages": totalPages,"totalItems": totalDocs,"limit": limit}}})

def getSingleMovie(req):
    """
    accesses database for movies collection and then returns it to the user
    how is request formated:
    {header: "Authorization": bearer <idToken>}

    
    Query Params:
        /getSingleMovie?movieId=123
    """

    # OPTIONAL: enable auth if needed
    # res = authenticateRequest(req)
    # if not res["ok"]:
    #     return jsonResponse({"ok": False, "unauthorized": res['error']}, status=401)

    queryParams = req.args if hasattr(req, "args") else {}
    movieId = queryParams.get("movieId")

    if movieId is None:
        return jsonResponse({"ok": False, "error": "movieId is required"}, status=400)

    try:
        movieId = int(movieId)
    except:
        return jsonResponse({"ok": False, "error": "movieId must be an integer"}, status=400)

    db = getDB()

    # Query by movieId field (NOT doc id)
    query = (db.collection("movies").where("movieId", "==", movieId).limit(1).stream())

    for doc in query:
        movie = doc.to_dict()
        movie["id"] = doc.id
        return jsonResponse({"ok": True, "data": movie})

    return jsonResponse({"ok": False, "error": "Movie not found"}, status=404)


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
        return jsonResponse({"ok":False, "error": "Missing required field (movieId)"}, status=400)


    db = getDB() # gets the firestore database instance
    query = (db.collection("movies").order_by("movieId").where("movieId", "==", movieId).stream())

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

    return jsonResponse({"ok": True, "data": {"Hello": uid}})