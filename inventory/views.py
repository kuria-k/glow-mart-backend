from rest_framework import viewsets
from .models import Product, Category, Supplier
from .serializers import ProductSerializer, CategorySerializer, SupplierSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import HttpResponse

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
        return response

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'check_stock']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
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
        return response

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
    def get_permissions(self):
        # Allow anyone to view categories (list and retrieve)
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        # Require authentication for create, update, delete
        return [IsAuthenticated()]
    
    def options(self, request, *args, **kwargs):
        """Handle OPTIONS requests for CORS"""
        response = Response()
        response.status_code = 200
        return response

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    
    def get_permissions(self):
        # Allow anyone to view suppliers (list and retrieve)
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        # Require authentication for create, update, delete
        return [IsAuthenticated()]
    
    def options(self, request, *args, **kwargs):
        """Handle OPTIONS requests for CORS"""
        response = Response()
        response.status_code = 200
        return response