from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.dateparse import parse_date
from .models import Vehicle
from .serializers import VehicleSerializer
from bookings.models import Booking

class VehicleViewSet(viewsets.ModelViewSet):
    
    serializer_class = VehicleSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        """
        - If client passes ?mine=true return only vehicles owned by request.user.
        - Otherwise return all vehicles (existing behavior).
        """
        qs = Vehicle.objects.all()
        mine = self.request.query_params.get('mine')
        if mine and mine.lower() == 'true' and self.request.user and self.request.user.is_authenticated:
            return qs.filter(owner=self.request.user)
        return qs

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=False, methods=['get'], url_path='availability')
    def availability(self, request):
        vehicle_id = request.query_params.get('vehicle_id')
        start_date = parse_date(request.query_params.get('start_date'))
        end_date = parse_date(request.query_params.get('end_date'))

        if not vehicle_id or not start_date or not end_date:
            return Response(
                {"error": "vehicle_id, start_date, and end_date are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            vehicle = Vehicle.objects.get(id=vehicle_id)
        except Vehicle.DoesNotExist:
            return Response({"error": "Vehicle not found"}, status=status.HTTP_404_NOT_FOUND)

        overlapping_bookings = Booking.objects.filter(
            vehicle=vehicle,
            start_datetime__lt=end_date,
            end_datetime__gt=start_date
        )

        is_available = not overlapping_bookings.exists()
        return Response({
            "vehicle_id": vehicle.id,
            "is_available": is_available
        })
