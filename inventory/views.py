from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import HttpResponse
from .models import Product, Category, Supplier
from .serializers import ProductSerializer, CategorySerializer, SupplierSerializer

# Public Product List View
@method_decorator(csrf_exempt, name='dispatch')
class PublicProductList(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    
    def options(self, request):
        response = HttpResponse()
        response.status_code = 200
        response['Access-Control-Allow-Origin'] = 'https://glow-mart-frontend.vercel.app'
        response['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'authorization, content-type'
        return response

# Public Category List View
@method_decorator(csrf_exempt, name='dispatch')
class PublicCategoryList(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)
    
    def options(self, request):
        response = HttpResponse()
        response.status_code = 200
        response['Access-Control-Allow-Origin'] = 'https://glow-mart-frontend.vercel.app'
        response['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'authorization, content-type'
        return response

@method_decorator(csrf_exempt, name='dispatch')
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'check_stock']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def list(self, request, *args, **kwargs):
        """Handle GET /products/ - List all products"""
        print(f"📦 Product list requested - User: {request.user}")
        return super().list(request, *args, **kwargs)
    
    def retrieve(self, request, *args, **kwargs):
        """Handle GET /products/{id}/ - Get single product"""
        print(f"📦 Product retrieve requested - ID: {kwargs.get('pk')}")
        return super().retrieve(request, *args, **kwargs)
    
    @action(detail=True, methods=['get'])
    def check_stock(self, request, pk=None):
        """Check if requested quantity is available"""
        product = self.get_object()
        quantity = int(request.query_params.get('quantity', 1))
        
        available = product.stock >= quantity
        available_stock = product.stock
        
        return Response({
            'available': available,
            'available_stock': available_stock,
            'requested_quantity': quantity,
            'message': f'Only {available_stock} left in stock' if not available else 'In stock'
        })
    
    def options(self, request, *args, **kwargs):
        """Handle OPTIONS requests for CORS"""
        response = Response()
        response.status_code = 200
        response['Access-Control-Allow-Origin'] = 'https://glow-mart-frontend.vercel.app'
        response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'authorization, content-type'
        return response

@method_decorator(csrf_exempt, name='dispatch')
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def list(self, request, *args, **kwargs):
        """Handle GET /categories/ - List all categories"""
        print(f"📁 Categories list requested")
        return super().list(request, *args, **kwargs)
    
    def retrieve(self, request, *args, **kwargs):
        """Handle GET /categories/{id}/ - Get single category"""
        print(f"📁 Category retrieve requested - ID: {kwargs.get('pk')}")
        return super().retrieve(request, *args, **kwargs)
    
    def options(self, request, *args, **kwargs):
        """Handle OPTIONS requests for CORS"""
        response = Response()
        response.status_code = 200
        response['Access-Control-Allow-Origin'] = 'https://glow-mart-frontend.vercel.app'
        response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'authorization, content-type'
        return response

@method_decorator(csrf_exempt, name='dispatch')
class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def list(self, request, *args, **kwargs):
        """Handle GET /suppliers/ - List all suppliers"""
        print(f"📦 Suppliers list requested")
        return super().list(request, *args, **kwargs)
    
    def options(self, request, *args, **kwargs):
        """Handle OPTIONS requests for CORS"""
        response = Response()
        response.status_code = 200
        response['Access-Control-Allow-Origin'] = 'https://glow-mart-frontend.vercel.app'
        response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'authorization, content-type'
        return response