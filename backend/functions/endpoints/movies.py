import init

# we need a check database for movies etc..
def getMovies(req: https_fn.Request) -> https_fn.Response:
    # i dont think we have movies in database yet, but there is a test message so i can test if that works then replace it with movies later
    return https_fn.Response("this will eventually return movies from the database!")