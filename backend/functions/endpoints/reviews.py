# this should handle both reviews and ratings, likes/dislikes, etc.. 
# they are all related and we can just have 1 endpoint for all of them?
from firebase_functions import https_fn


def postReview(req: https_fn.Request) -> https_fn.Response:
    pass # we will implement this later