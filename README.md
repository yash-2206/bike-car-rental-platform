# 🚗🏍️ Bike & Car Rental Platform

A full-stack **vehicle rental application** where owners can list vehicles (cars, bikes, etc.) and customers can book them. The platform supports **user authentication, bookings, earnings tracking for owners, and image uploads for vehicles**.

---

## 📌 Features

### **For Owners**
- Vehicle management (Add, Edit, Delete)
- Upload multiple images per vehicle
- View total earnings & bookings
- Manage booking requests

### **For Renters**
- Search and browse available vehicles
- View vehicle details with images
- Book vehicles for a specific duration
- View booking history

### **General Features**
- User authentication (JWT)
- Responsive Angular Material UI
- REST API with Django REST Framework
- Image uploads via Django
- Dockerized for easy deployment

---

## 🛠 Technology Stack

**Frontend**
- Angular 17 (Standalone Components)
- Angular Material
- SCSS
- TypeScript

**Backend**
- Django 5.x
- Django REST Framework
- PostgreSQL (or SQLite for development)
- Pillow (for image handling)

## 📚 API Documentation (Swagger / OpenAPI)

We use **drf-spectacular** to generate a standards-compliant OpenAPI schema and serve a Swagger UI.


**DevOps**
- Docker & Docker Compose

---

🚀 Future Improvements
Payment gateway integration

Advanced search & filters

Email notifications

Vehicle availability calendar
