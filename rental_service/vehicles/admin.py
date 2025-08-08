from django.contrib import admin
from .models import Vehicle, VehicleImage

class VehicleImageInline(admin.TabularInline):
    model = VehicleImage
    extra = 1

@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ('id', 'brand', 'model', 'type', 'owner', 'available', 'price_per_day')
    list_filter = ('available', 'type', 'brand')
    search_fields = ('brand', 'model', 'owner__username', 'owner__email')
    ordering = ('brand', 'model')
    inlines = [VehicleImageInline]