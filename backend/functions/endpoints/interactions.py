from firebase_functions import https_fn
from authenticate import authenticateRequest
# this file will handle reviews, ratings, likes/dislikes, comments, etc.. 

# these need to be real-time

# auth Needed
def postReview(req):
    # 1. Authenticate
    res = authenticateRequest(req)
    if not res["ok"]:
        return https_fn.Response(
            f"Unauthorized: {res['error']}",
            status=401
        )

    user = res["user"]

    # 2. Parse JSON body
    try:
        body = req.get_json()
    except Exception:
        return https_fn.Response("Invalid JSON", status=400)

    if not body:
        return https_fn.Response("Missing body", status=400)

    # 3. Extract fields
    movieId = body.get("movieId")
    text = body.get("text")

    if not movieId or not text:
        return https_fn.Response(
            "Missing required fields (movieId, text)",
            status=400
        )

    # 4. Build clean object
    review_data = {
        "userId": user["uid"],
        "movieId": movieId,
        "text": text,
    }

    return https_fn.Response({
        "success": True,
        "data": review_data
    })



def postLike(req): # should handle both a dislike and a like
    # authenticate user
    res = authenticateRequest(req)

    if res["ok"] is False:
        return https_fn.Response(f"Unauthorized: {res["error"]}", status=404)
    

    
    return  "NOT IMPLEMENTED YET" # we will implement this later

def postComment(req):
    # authenticate user
    res = authenticateRequest(req)

    if res["ok"] is False:
        return https_fn.Response(f"Unauthorized: {res["error"]}", status=404)
    

    return  "NOT IMPLEMENTED YET"
