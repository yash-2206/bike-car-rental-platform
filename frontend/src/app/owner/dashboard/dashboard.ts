import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking';
import { VehicleService } from '../../services/vehicle';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatListModule, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit {
  earnings: any = { total_earnings: 0, total_bookings: 0 };
  bookings: any[] = [];
  vehicles: any[] = [];

  constructor(private bs: BookingService, private vs: VehicleService) { }

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // earnings and bookings stay the same
    this.bs.ownerEarnings().subscribe((r: any) => (this.earnings = r));
    this.bs.list().subscribe((r: any) => (this.bookings = r));

    // Request only vehicles owned by the logged-in user:
    this.vs.list({ mine: 'true' }).subscribe((v: any) => {
      // 'v' should be an array of vehicles owned by the current user
      this.vehicles = v || [];
    }, err => {
      console.error('Failed to load owner vehicles', err);
      this.vehicles = [];
    });
  }

  deleteVehicle(vehicleId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.vs.delete(vehicleId).subscribe(() => {
          this.vehicles = this.vehicles.filter(v => v.id !== vehicleId);
          Swal.fire('Deleted!', 'Your vehicle has been deleted.', 'success');
        });
      }
    });
  }

}
