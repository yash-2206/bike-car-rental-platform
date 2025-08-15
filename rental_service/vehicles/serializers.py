from rest_framework import serializers
from .models import Vehicle, VehicleImage

class VehicleImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = VehicleImage
        fields = ['id', 'image', 'image_url']
        ref_name = "BookingsAppVehicleSerializer" 

    def get_image_url(self, obj):
        if obj.image:  # If using ImageField
            return obj.image.url
        if obj.images.exists():  # If using related model
            return obj.images.first().image_url
        return None
        

class VehicleSerializer(serializers.ModelSerializer):
    images = VehicleImageSerializer(many=True, read_only=True)
    owner_id = serializers.IntegerField(source='owner.id', read_only=True)

    class Meta:
        model = Vehicle
        fields = '__all__'
        read_only_fields = ['owner'] 
