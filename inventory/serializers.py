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

from rest_framework import serializers
from django.utils import timezone
from .models import Product, Category, Supplier, ProductImage


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = "__all__"


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image", "caption"]


class ProductSerializer(serializers.ModelSerializer):

    category_detail = CategorySerializer(source="category", read_only=True)
    supplier_detail = SupplierSerializer(source="supplier", read_only=True)

    extra_images = ProductImageSerializer(many=True, read_only=True)

    current_price = serializers.SerializerMethodField()
    is_discount_active = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = "__all__"

    def get_is_discount_active(self, obj):
        return obj.is_discount_active

    def get_current_price(self, obj):
        return float(obj.current_price)

    def validate_discount_percent(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError("Discount must be 0–100")
        return value