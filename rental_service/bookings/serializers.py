from rest_framework import serializers
from django.utils import timezone
from decimal import Decimal
from .models import Booking, Vehicle

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = ['id', 'brand', 'model', 'location', 'price_per_day']
        ref_name = "VehiclesAppVehicleSerializer"

class BookingSerializer(serializers.ModelSerializer):
    # accept `vehicle_id` from frontend; expose nested `vehicle` read-only
    vehicle_id = serializers.PrimaryKeyRelatedField(
        queryset=Vehicle.objects.all(),
        source='vehicle',
        write_only=True
    )
    vehicle = VehicleSerializer(read_only=True)

    # convenience read-only date fields for UI
    start_date = serializers.SerializerMethodField()
    end_date = serializers.SerializerMethodField()

    # expose total_cost as read-only so UI can show it
    total_cost = serializers.DecimalField(max_digits=8, decimal_places=2, read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id',
            'vehicle', 'vehicle_id',
            'renter',
            'start_datetime', 'end_datetime',
            'total_cost',
            'start_date', 'end_date'
        ]
        read_only_fields = ['renter', 'total_cost']

    def get_start_date(self, obj):
        return obj.start_datetime.date()

    def get_end_date(self, obj):
        return obj.end_datetime.date()

    def validate(self, attrs):
        """
        Normalize times, prevent self-booking, and check conflicts.
        """
        request = self.context['request']
        vehicle = attrs['vehicle']
        start = attrs['start_datetime']
        end = attrs['end_datetime']

        # Ensure TZ-aware; frontend may already send 'Z' (UTC) so guard it
        if timezone.is_naive(start):
            start = timezone.make_aware(start)
        if timezone.is_naive(end):
            end = timezone.make_aware(end)

        if start >= end:
            raise serializers.ValidationError({"date": "End date must be after start date."})

        # Prevent booking own vehicle
        if vehicle.owner_id == request.user.id:
            raise serializers.ValidationError({"vehicle": "You cannot book your own vehicle."})

        # Conflict check: overlap if (start < existing.end) and (end > existing.start)
        conflict = Booking.objects.filter(
            vehicle=vehicle,
            status__in=['pending', 'confirmed'],
            start_datetime__lt=end,
            end_datetime__gt=start
        ).exists()
        if conflict:
            raise serializers.ValidationError({"availability": "Vehicle not available for selected dates."})

        # write normalized aware datetimes back
        attrs['start_datetime'] = start
        attrs['end_datetime'] = end
        return attrs

    def create(self, validated_data):
        """
        Set renter and compute total_cost automatically.
        """
        user = self.context['request'].user
        vehicle = validated_data['vehicle']
        start = validated_data['start_datetime']
        end = validated_data['end_datetime']

        days = (end - start).days
        if days <= 0:
            days = 1  # safety, should already be prevented above

        # Decimal * int -> Decimal
        total_cost = vehicle.price_per_day * Decimal(days)

        validated_data['renter'] = user
        validated_data['total_cost'] = total_cost
        return super().create(validated_data)
