from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'products', views.ProductViewSet, basename='product')
router.register(r'categories', views.CategoryViewSet, basename='category')
router.register(r'suppliers', views.SupplierViewSet, basename='supplier')

urlpatterns = [
    # Include router URLs with explicit trailing slash handling
    path('', include(router.urls)),
    
    # Add URLs without trailing slash to prevent 405 errors
    path('products', views.ProductViewSet.as_view({'get': 'list'}), name='product-list-no-slash'),
    path('categories', views.CategoryViewSet.as_view({'get': 'list'}), name='category-list-no-slash'),
    path('suppliers', views.SupplierViewSet.as_view({'get': 'list'}), name='supplier-list-no-slash'),
    
    # Public endpoints
    path('public/products/', views.PublicProductList.as_view(), name='public-products'),
    path('public/products', views.PublicProductList.as_view(), name='public-products-no-slash'),
    path('public/categories/', views.PublicCategoryList.as_view(), name='public-categories'),
    path('public/categories', views.PublicCategoryList.as_view(), name='public-categories-no-slash'),
]