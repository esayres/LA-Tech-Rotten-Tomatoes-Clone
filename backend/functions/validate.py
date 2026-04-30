from firebase import getDB

# if given the time, re-Factor this code, its reimplementing getMovies, getReviews which i dont love buts working for now

def validateMovie(movieId):
    """
    checks if a given movieID is in the database
    returns True if found,   False if not found 
    """
    db = getDB()
    docs = db.collection("movies").stream()

    moviesList = []
    for doc in docs:
        movie = doc.to_dict()
        movie["id"] = doc.id
        moviesList.append(movie)

    for movie in moviesList:
        if movieId == movie["movieId"]:
            return True
    return False

def validateReview(movieReview, uid):
    """
    checks if a given user movie review is already in the database from the same user (prevents user-specific duplicates)
    returns True if found,      False if not found
    """
    db = getDB() # gets the firestore database instance
    docs = db.collection("reviews").stream()

    for doc in docs:
        review = doc.to_dict()
        if review["userId"] == uid and review["text"] == movieReview: # the same user already sent this review to database (prevents duplicates)
            return True     
    return False
