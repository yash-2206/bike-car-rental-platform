import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { BookingService } from '../../services/booking';
import { VehicleService } from '../../services/vehicle';
import { Auth } from '../../services/auth';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from '@angular/material/chips';




interface VehicleImage {
  image_url: string;
}
interface Vehicle {
  id?: number;
  brand?: string;
  model?: string;
  images?: VehicleImage[];
}
interface Booking {
  id?: number;
  vehicle_id?: number;
  vehicle?: Vehicle;
  start_date?: string;
  start_datetime?: string;
  end_date?: string;
  end_datetime?: string;
  total_cost?: number;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  payment_status?: 'unpaid' | 'paid' | 'refunded';
}

@Component({
  selector: 'app-renter-bookings',
  standalone: true,
  imports: [CommonModule, DatePipe, MatListModule, MatDividerModule, MatCardModule, MatIconModule, MatChipsModule,],
  templateUrl: './bookings.html',
  styleUrls: ['./bookings.scss']
})
export class Bookings implements OnInit {
  bookings: Booking[] = [];
  payingId?: number;
  readonly defaultImg =
    'https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg';

  constructor(
    private bs: BookingService,
    private auth: Auth,
    private vs: VehicleService
  ) { }

  ngOnInit() {
    const renterId = this.auth.getUserId(); // ensure Auth service has this
    this.bs.list({ renter_id: renterId }).subscribe((res: any) => {
      const bookings = res as Booking[];
      this.bookings = bookings || [];
      this.bookings.forEach((booking) => {
        if (booking?.vehicle?.id) {
          this.vs.get(booking.vehicle.id).subscribe((vehicle: Vehicle) => {
            booking.vehicle = vehicle; // replace with full vehicle object
          });
        }
      });
    });
  }

  /** Display vehicle name nicely */
  vehicleName(b: Booking): string {
    if (b?.vehicle?.brand && b?.vehicle?.model) {
      return `${b.vehicle.brand} ${b.vehicle.model}`;
    }
    return `Vehicle #${b?.vehicle_id ?? b?.vehicle?.id ?? ''}`;
  }

  /** Get first vehicle image or fallback */
  getImage(b: Booking): string {
    return b?.vehicle?.images?.[0]?.image_url || this.defaultImg;
  }

  /** Fallback image handler */
  onImageError(ev: Event) {
    const img = ev.target as HTMLImageElement;
    img.src = this.defaultImg;
  }

  /** CSS class for booking status */
  statusClass(status?: Booking['status']) {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  }

  /** Payment simulation (replace with real API) */
  onPay(b: Booking) {
    if (!b?.id) return;
    this.payingId = b.id;
    setTimeout(() => {
      this.payingId = undefined;
      const idx = this.bookings.findIndex(x => x.id === b.id);
      if (idx > -1) {
        this.bookings[idx] = {
          ...this.bookings[idx],
          payment_status: 'paid'
        };
      }
    }, 1000);
  }

  /** For ngFor trackBy */
  trackByBookingId(_: number, b: Booking) {
    return b?.id ?? b?.vehicle_id ?? Math.random();
  }
  statusColor(status: string): string {
    switch (status) {
      case 'pending': return 'warn';
      case 'confirmed': return 'accent';
      case 'completed': return 'primary';
      case 'cancelled': return 'warn';
      default: return 'accent';
    }
  }
  onDelete(b: Booking) {
    if (!b?.id) return;

    if (confirm(`Are you sure you want to delete booking #${b.id}?`)) {
      this.bs.delete(b.id).subscribe(() => {
        this.bookings = this.bookings.filter(x => x.id !== b.id);
      });
    }
  }


}
