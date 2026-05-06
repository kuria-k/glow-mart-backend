# from rest_framework import serializers
# from .models import Product, Category, Supplier

# class CategorySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Category
#         fields = "__all__"


# class SupplierSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Supplier
#         fields = "__all__"


# class ProductSerializer(serializers.ModelSerializer):
#     # Accept IDs when creating/updating
#     category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
#     supplier = serializers.PrimaryKeyRelatedField(queryset=Supplier.objects.all(), allow_null=True)

#     # Show nested details when reading
#     category_detail = CategorySerializer(source="category", read_only=True)
#     supplier_detail = SupplierSerializer(source="supplier", read_only=True)

#     class Meta:
#         model = Product
#         fields = [
#             "id",
#             "name",
#             "category",        # for POST/PUT (dropdown ID)
#             "category_detail", # for GET (nested info)
#             "supplier",
#             "supplier_detail",
#             "description",
#             "price",
#             "stock",
#             "expiry_date",
#             "image",
#             "created_at",
#         ]

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'products', views.ProductViewSet, basename='product')
router.register(r'categories', views.CategoryViewSet, basename='category')
router.register(r'suppliers', views.SupplierViewSet, basename='supplier')

urlpatterns = [
    # Router URLs (handles both with and without trailing slashes)
    path('', include(router.urls)),
    
    # Public endpoints (handles both with and without trailing slashes)
    path('public/products/', views.PublicProductList.as_view(), name='public-products'),
    path('public/categories/', views.PublicCategoryList.as_view(), name='public-categories'),
]