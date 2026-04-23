from firebase_admin import auth

# Helper functions to authenticate requests in multiple functions,
# helps prevent code duplication

def authenticateRequest(request):
    """
    This function takes in a request, checks the authorization header for a valid Firebase ID token
    If the token is valid, it returns the decoded token (contains user info like uid and email)
    If the token is invalid or missing, returns None and an error message
    """

    authHeader = request.headers.get("Authorization") # grabs the authorization header (i.e {'Authorization': "bearer <token>"})

    if not authHeader or not authHeader.startswith("Bearer "): # checks if the header is valid, returns error if not
        return None, "Missing or invalid Authorization header"

    try:
        idToken = authHeader.split("Bearer ")[1]
        decodedToken = auth.verify_id_token(idToken) # verifies the token with firebase, returns error if invalid

        # returns the uid and email so we know which user is sending the request
        return {"uid": decodedToken["uid"], "email": decodedToken.get("email")}, None

    except Exception as e:
        return None, str(e) # returns error if anything goes wrong (invalid token, etc....)