from firebase_functions import https_fn
from firebase_functions.options import set_global_options
from firebase import initFirebase, jsonResponse


from endpoints.movies import getMovies, helloWorld
from endpoints.interactions import postUserReview, getReviews, postUserLike, getUserLikes, getUserReviews
# Deploy with `firebase deploy`

# For cost control, you can set the maximum number of containers that can be
# running at the same time. This helps mitigate the impact of unexpected
# traffic spikes by instead downgrading performance. This limit is a per-function
# limit. You can override the limit for each function using the max_instances
# parameter in the decorator, e.g. @https_fn.on_request(max_instances=5).

# this means that if there are more than 10 requests at the same time, it will start to queue them instead
set_global_options(max_instances=10)


"""
all requests should follow one of these 3 patterns:

{"ok": True, "data": data}                      ->              Success (request was properly processed)
{"ok": False, "error": error_msg}               ->              Failed (some error happened and it will tell you why)
{"ok": False, "unauthorized": error_msg}        ->              Failed (not a authorized user)
"""


# routing for the functions
@https_fn.on_request()
def api(req: https_fn.Request) -> https_fn.Response:
    """
    Base api connection point, Routes to every Endpoint 
    Given a path in the base url, you can change the destination to several endpoints
    """

    # we check the path of the request and route it to the correct function, 
    # so i give them 1 base Url and a list of paths that they can send requests to, and it will route it to the correct function based on the path
    path = req.path

    # this is where we can add more endpoints, for example /getMovies, /postReview, etc...
    routes = {
        # testing
        "/hello": helloWorld,
        # Movies
        "/getMovies": getMovies,
        # /getMovieScore <- NEEDED
        # reviews
        "/postUserReview": postUserReview,
        "/getUserReviews": getUserReviews,
        "/getReviews": getReviews, 
        # likes
        "/postUserLike": postUserLike, # Not Implemented -> # should post to both movies db and also a seperate collum so i can see what user did what
        "/getUserLikes": getUserLikes, # not Implemented
    }

    endpointFunction = routes.get(path) # this will get the function based on the path, if the path is not in the routes, returns None

    if endpointFunction: # if the path is valid, it will call the function and return the response
        initFirebase()
        return endpointFunction(req)

    return jsonResponse({"ok": False, "error": "Endpoint not found"}, status=404) # if not valid path, return not found



