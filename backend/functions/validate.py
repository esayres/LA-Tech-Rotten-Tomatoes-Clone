from firebase import getDB

# if given the time, re-Factor this code, its reimplementing getMovies, getReviews which i dont love buts working for now

def validateMovie(movieId):
    """
    checks if a given movieID is in the database
    returns True if found,   False if not found 
    """
    db = getDB()
    query = (db.collection("movies").order_by("movieId").where("movieId", "==", movieId).limit(1).stream())

    for _ in query: # found
        return True
    return False

def validateReview(movieReview, uid):
    """
    checks if a given user movie review is already in the database from the same user (prevents user-specific duplicates)
    returns True if found,      False if not found
    """
    db = getDB() # gets the firestore database instance
    query = (db.collection("reviews").where("userId", "==", uid).where("review", "==", movieReview).limit(1).stream())
    # there is a bug where the user can post the same review but different case-sensitive

    for _ in query: # found
        return True   
    return False


def validateLike(movieId, uid):
    """
    checks if a given user like/dislike is already in the database from the same user (prevents user-specific duplicates)
    returns True if found,      False if not found
    """
    db = getDB() # gets the firestore database instance
    query = (db.collection("likes").where("userId", "==", uid).where("movieId", "==", movieId).limit(1).stream())

    for _ in query: # found
        return True

    return False # not found