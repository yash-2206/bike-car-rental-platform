from django.contrib import admin
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'vehicle', 'renter', 'status', 'start_datetime', 'end_datetime', 'total_cost')
    list_filter = ('status', 'start_datetime', 'end_datetime')
    search_fields = ('vehicle__brand', 'vehicle__model', 'renter__username', 'renter__email')
    ordering = ('-start_datetime',)
