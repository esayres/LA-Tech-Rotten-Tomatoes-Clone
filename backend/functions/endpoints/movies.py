from firebase import getDB

def getMovies(req):
    db = getDB() # gets the firestore database instance
    docs = db.collection("movies").stream() # for now we are using the test message we created in ( EVENTUALLY IT WILL BE THE MOVIES COLLECTION WHEN ITS CREATED)

    movies = []
    for doc in docs:
        movie = doc.to_dict()
        movie["id"] = doc.id
        movies.append(movie)

    return movies