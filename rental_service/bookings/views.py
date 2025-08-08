from rest_framework import viewsets, permissions, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Count
from django.utils.dateparse import parse_datetime
from django.utils import timezone
from datetime import datetime

from .models import Booking, Vehicle
from .serializers import BookingSerializer


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'renter':
            return Booking.objects.filter(renter=user)
        elif user.role == 'owner':
            return Booking.objects.filter(vehicle__owner=user)
        return Booking.objects.none()

    def perform_create(self, serializer):
        vehicle = Vehicle.objects.get(id=self.request.data['vehicle_id'])

        # Parse request date strings into datetime objects
        start = datetime.strptime(self.request.data['start_date'], "%Y-%m-%d")
        end = datetime.strptime(self.request.data['end_date'], "%Y-%m-%d")

        # Convert to timezone-aware
        start = timezone.make_aware(start)
        end = timezone.make_aware(end)

        # Calculate cost
        days = (end - start).days
        if days <= 0:
            raise serializers.ValidationError("End date must be after start date.")
        
        total_cost = vehicle.price_per_day * days

        # Save booking
        serializer.save(
            vehicle=vehicle,
            renter=self.request.user,
            start_datetime=start,
            end_datetime=end,
            total_cost=total_cost
        )

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def earnings(self, request):
        user = request.user
        if user.role != 'owner':
            return Response({"detail": "Not authorized"}, status=403)

        data = Booking.objects.filter(vehicle__owner=user, status='completed').aggregate(
            total_earnings=Sum('total_cost'),
            total_bookings=Count('id')
        )

        return Response({
            "owner": user.username,
            "total_earnings": data['total_earnings'] or 0,
            "total_bookings": data['total_bookings']
        })

    @action(detail=False, methods=['get'])
    def check_availability(self, request):
        vehicle_id = request.query_params.get('vehicle_id')
        start = parse_datetime(request.query_params.get('start'))
        end = parse_datetime(request.query_params.get('end'))

        if not all([vehicle_id, start, end]):
            return Response({"error": "Missing parameters"}, status=400)

        conflicting = Booking.objects.filter(
            vehicle_id=vehicle_id,
            status__in=['pending', 'confirmed'],
            start_datetime__lt=end,
            end_datetime__gt=start
        ).exists()

        return Response({"available": not conflicting})

