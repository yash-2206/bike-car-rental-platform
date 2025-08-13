from rest_framework import serializers
from .models import Booking, Vehicle

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = ['id', 'brand', 'model', 'location', 'price_per_day']

class BookingSerializer(serializers.ModelSerializer):
    vehicle = VehicleSerializer(read_only=True)  # nested details
    start_date = serializers.SerializerMethodField()
    end_date = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            'id',
            'vehicle',
            'renter',
            'start_datetime',
            'end_datetime',
            'total_cost',
            'start_date',
            'end_date'
        ]

    def get_start_date(self, obj):
        return obj.start_datetime.date()

    def get_end_date(self, obj):
        return obj.end_datetime.date()
