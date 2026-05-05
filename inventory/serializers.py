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
    # ✅ Relations (safe)
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        allow_null=True,
        required=False
    )
    supplier = serializers.PrimaryKeyRelatedField(
        queryset=Supplier.objects.all(),
        allow_null=True,
        required=False
    )

    # ✅ Read-only nested details
    category_detail = CategorySerializer(source="category", read_only=True)
    supplier_detail = SupplierSerializer(source="supplier", read_only=True)

    # ✅ Images
    extra_images = ProductImageSerializer(many=True, read_only=True)
    new_images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )

    # ✅ Discount fields
    discount_percent = serializers.IntegerField(required=False, default=0)
    discount_expiry = serializers.DateTimeField(required=False, allow_null=True)

    # ✅ Computed fields (SAFE)
    current_price = serializers.SerializerMethodField()
    is_discount_active = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "category",
            "category_detail",
            "supplier",
            "supplier_detail",
            "description",
            "price",
            "current_price",
            "is_discount_active",
            "discount_percent",
            "discount_expiry",
            "stock",
            "expiry_date",
            "image",
            "extra_images",
            "new_images",
            "created_at",
        ]

    # -------------------
    # ✅ Computed logic (NO MODEL DEPENDENCY)
    # -------------------
    def get_is_discount_active(self, obj):
        if not obj.discount_percent or not obj.discount_expiry:
            return False
        return obj.discount_expiry > timezone.now()

    def get_current_price(self, obj):
        if (
            obj.discount_percent
            and obj.discount_expiry
            and obj.discount_expiry > timezone.now()
        ):
            return float(obj.price) * (1 - obj.discount_percent / 100)
        return float(obj.price)

    # -------------------
    # ✅ Validation
    # -------------------
    def validate_discount_percent(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError(
                "Discount must be between 0 and 100."
            )
        return value

    def validate(self, data):
        discount = data.get("discount_percent", 0)
        expiry = data.get("discount_expiry")

        if discount > 0 and not expiry:
            raise serializers.ValidationError(
                "Discount expiry must be set when discount_percent > 0."
            )

        return data

    # -------------------
    # ✅ Create
    # -------------------
    def create(self, validated_data):
        new_images = validated_data.pop("new_images", [])
        product = Product.objects.create(**validated_data)

        for img in new_images:
            ProductImage.objects.create(product=product, image=img)

        return product

    # -------------------
    # ✅ Update
    # -------------------
    def update(self, instance, validated_data):
        new_images = validated_data.pop("new_images", [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        for img in new_images:
            ProductImage.objects.create(product=instance, image=img)

        return instance