import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "rental_service.settings")  # <-- adjust if your settings module is named differently
django.setup()

from bookings.serializers import BookingSerializer

print("BookingSerializer imported successfully:", BookingSerializer)
