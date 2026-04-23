# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn
from firebase_functions.options import set_global_options
from firebase_admin import initialize_app, auth
from authenticate import authenticateRequest

# For cost control, you can set the maximum number of containers that can be
# running at the same time. This helps mitigate the impact of unexpected
# traffic spikes by instead downgrading performance. This limit is a per-function
# limit. You can override the limit for each function using the max_instances
# parameter in the decorator, e.g. @https_fn.on_request(max_instances=5).
set_global_options(max_instances=10)

initialize_app()
#
#
# lets convert this hello world func to need some authentication, so only the user can send the requests and not a random
@https_fn.on_request()
def on_request_example(req: https_fn.Request) -> https_fn.Response:
    user, error = authenticateRequest(req)

    if error:
        return https_fn.Response(
            f"Unauthorized: {error}",
            status=401
        )

    # Now you're authenticated
    uid = user["uid"]

    return https_fn.Response(f"Hello {uid}!")


# what we need to solve next, we want authentication, so only the user can send the requests and not a random
# i want rate limiting, so if the user sends too many requests, it doesnt just bill me for 100k
# i also want to have basic error handling, and show casing 