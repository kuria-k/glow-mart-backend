# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from . import views

# router = DefaultRouter()
# router.register(r'products', views.ProductViewSet, basename='product')
# router.register(r'categories', views.CategoryViewSet, basename='category')
# router.register(r'suppliers', views.SupplierViewSet, basename='supplier')

# urlpatterns = [
#     # Router URLs (handles both with and without trailing slashes)
#     path('', include(router.urls)),
    
#     # Public endpoints (handles both with and without trailing slashes)
#     path('public/products/', views.PublicProductList.as_view(), name='public-products'),
#     path('public/categories/', views.PublicCategoryList.as_view(), name='public-categories'),
# ]

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Router for standard endpoints (with mixed permissions)
router = DefaultRouter()
router.register(r'products', views.ProductViewSet)
router.register(r'categories', views.CategoryViewSet)
router.register(r'suppliers', views.SupplierViewSet)

urlpatterns = [
    # Public endpoints (explicitly no auth)
    path('public/products/', views.PublicProductList.as_view(), name='public-products'),
    path('public/products/<int:pk>/', views.PublicProductDetail.as_view(), name='public-product-detail'),
    path('public/categories/', views.PublicCategoryList.as_view(), name='public-categories'),
    
    # Main endpoints (mixed permissions - read public, write auth)
    path('', include(router.urls)),
]