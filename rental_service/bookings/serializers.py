from rest_framework import serializers
from .models import Booking

class BookingSerializer(serializers.ModelSerializer):
    # These are only for request input, not stored directly in DB
    start_date = serializers.DateField(write_only=True)
    end_date = serializers.DateField(write_only=True)

    class Meta:
        model = Booking
        fields = [
            'id',
            'vehicle_id',
            'renter',
            'start_datetime',
            'end_datetime',
            'total_cost',
            'start_date',
            'end_date'
        ]
        read_only_fields = ['id', 'renter', 'start_datetime', 'end_datetime', 'total_cost']

    def create(self, validated_data):
        # Remove request-only fields before creating the booking
        validated_data.pop('start_date', None)
        validated_data.pop('end_date', None)
        return super().create(validated_data)
