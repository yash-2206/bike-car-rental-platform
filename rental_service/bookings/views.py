from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.dateparse import parse_date
from django.utils import timezone
from datetime import datetime, time
from django.db.models import Sum
from .models import Booking, Vehicle
from .serializers import BookingSerializer


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Filter bookings by role
        if getattr(user, 'role', None) == 'renter':
            return Booking.objects.filter(renter=user)
        elif getattr(user, 'role', None) == 'owner':
            return Booking.objects.filter(vehicle__owner=user)
        return Booking.objects.none()

    def perform_create(self, serializer):
        serializer.save()

    @action(detail=False, methods=['get'])
    def check_availability(self, request):
        """Check if a vehicle is available in the given date range."""
        vehicle_id = request.query_params.get('vehicle_id')
        start_str = request.query_params.get('start')
        end_str = request.query_params.get('end')

        if not all([vehicle_id, start_str, end_str]):
            return Response({"error": "Missing parameters"}, status=400)

        try:
            vehicle = Vehicle.objects.get(id=vehicle_id)
        except Vehicle.DoesNotExist:
            return Response({"error": "Vehicle not found"}, status=404)

        s_date = parse_date(start_str)
        e_date = parse_date(end_str)
        if not s_date or not e_date:
            return Response({"error": "Dates must be YYYY-MM-DD"}, status=400)

        start_dt = timezone.make_aware(datetime.combine(s_date, time.min))
        end_dt = timezone.make_aware(datetime.combine(e_date, time.min))

        conflicting = Booking.objects.filter(
            vehicle=vehicle,
            status__in=['pending', 'confirmed'],
            start_datetime__lt=end_dt,
            end_datetime__gt=start_dt
        ).exists()

        return Response({"available": not conflicting})

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def owner_earnings(self, request):
        """Returns total earnings and total bookings for logged-in owner."""
        user = request.user
        if getattr(user, 'role', None) != 'owner':
            return Response({"error": "Not authorized"}, status=403)

        total_earnings = Booking.objects.filter(
            vehicle__owner=user
        ).aggregate(total=Sum('total_cost'))['total'] or 0

        total_bookings = Booking.objects.filter(
            vehicle__owner=user
        ).count()

        return Response({
            "total_earnings": total_earnings,
            "total_bookings": total_bookings
        })
