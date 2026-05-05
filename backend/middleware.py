from django.http import HttpResponse
from django.utils.deprecation import MiddlewareMixin

class ForceCorsMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # Handle OPTIONS preflight requests
        if request.method == 'OPTIONS':
            response = HttpResponse()
            response.status_code = 200
            # Get origin from request or use default
            origin = request.headers.get('Origin', 'https://glow-mart-frontend.vercel.app')
            response['Access-Control-Allow-Origin'] = origin
            response['Access-Control-Allow-Credentials'] = 'true'
            response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
            response['Access-Control-Allow-Headers'] = 'authorization, content-type, x-csrftoken, accept, origin, user-agent'
            response['Access-Control-Max-Age'] = '86400'
            return response
        return None

    def process_response(self, request, response):
        # Add CORS headers to all responses
        origin = request.headers.get('Origin', 'https://glow-mart-frontend.vercel.app')
        
        # Only add CORS headers if origin is allowed
        allowed_origins = [
            'https://glow-mart.vercel.app',
            'https://glow-mart-frontend.vercel.app',
            'http://localhost:5173',
            'http://localhost:3000',
        ]
        
        if origin in allowed_origins:
            response['Access-Control-Allow-Origin'] = origin
            response['Access-Control-Allow-Credentials'] = 'true'
            response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
            response['Access-Control-Allow-Headers'] = 'authorization, content-type, x-csrftoken, accept, origin, user-agent'
        
        return response