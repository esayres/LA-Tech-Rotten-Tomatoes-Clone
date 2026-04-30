from endpoints.movies import getMovies
from endpoints.interactions import getReviews

def validateMovie(movieID):
    """
    checks if a given movieID is in the database
    returns True if found,   False if not found 
    """
    moviesList = getMovies(None)

    for movie in moviesList:
        if movieID == movie["movieID"]:
            return True
    return False

def validateReview(movieReview, req):
    """
    checks if a given movie review is already in the database (prevents duplicates)
    returns True if found,      False if not found
    """
    reviewsList = getReviews(req)

    for review in reviewsList:
        if movieReview == review["text"]:
            return True
    return False
