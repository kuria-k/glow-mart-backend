from django.http import HttpResponse
class ForceCorsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Handle OPTIONS preflight request FIRST
        if request.method == 'OPTIONS':
            response = HttpResponse()
            response.status_code = 200
            # Add CORS headers
            response["Access-Control-Allow-Origin"] = "https://glow-mart-frontend.vercel.app"
            response["Access-Control-Allow-Credentials"] = "true"
            response["Access-Control-Allow-Headers"] = "content-type, authorization, x-csrftoken"
            response["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
            return response
        
        # Process normal request
        response = self.get_response(request)
        
        # Add CORS headers to normal responses
        response["Access-Control-Allow-Origin"] = "https://glow-mart-frontend.vercel.app"
        response["Access-Control-Allow-Credentials"] = "true"
        response["Access-Control-Allow-Headers"] = "content-type, authorization, x-csrftoken"
        response["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
        
        return response