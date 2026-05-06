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

router = DefaultRouter()
router.register(r'products', views.ProductViewSet, basename='product')
router.register(r'categories', views.CategoryViewSet, basename='category')
router.register(r'suppliers', views.SupplierViewSet, basename='supplier')

urlpatterns = [
    path('', include(router.urls)),

    path('public/products/', views.PublicProductList.as_view()),
    path('public/categories/', views.PublicCategoryList.as_view()),
]