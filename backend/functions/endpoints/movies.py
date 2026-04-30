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

    return jsonResponse({"ok": True, "data": movies})


# hello World function, tests authentication
def helloWorld(req):
    """
    Hello World endpoint, a test for authentication
    If a idToken was given in the header, it will authenicate it with firebase and say Hello
    If a IdToken is invalid or not given, it will return Unauthorized
    """
    res = authenticateRequest(req)

    if res["ok"] is False:
        return jsonResponse({"ok": False, f"Unauthorized": {res["error"]}}, status=404)

    # Now you're authenticated
    uid = res["user"]["uid"]

    return jsonResponse({"ok": True, "data": f"Hello {uid}!"})