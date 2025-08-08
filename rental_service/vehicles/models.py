from django.db import models
from users.models import User

class Vehicle(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='vehicles')
    type = models.CharField(max_length=20)
    price_per_day = models.DecimalField(max_digits=10, decimal_places=2)  # e.g., Car, Bike
    brand = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    hourly_rate = models.DecimalField(max_digits=6, decimal_places=2)
    location = models.CharField(max_length=100)
    available = models.BooleanField(default=True)

class VehicleImage(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='vehicle_images/')

