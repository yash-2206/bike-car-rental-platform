import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking';
import { VehicleService } from '../../services/vehicle';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatListModule, MatButtonModule, MatIconModule],
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
    this.bs.ownerEarnings().subscribe((r: any) => (this.earnings = r));
    this.bs.list().subscribe((r: any) => (this.bookings = r));
    this.vs.list().subscribe((v: any) => (this.vehicles = v));
  }
}
