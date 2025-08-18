import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from '../../services/vehicle';
import { BookingService } from '../../services/booking';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [MatCardModule, FormsModule, MatButtonModule, CommonModule],
  templateUrl: './detail.html',
  styleUrls: ['./detail.scss']
})
export class Detail implements OnInit {
  vehicle: any;
  start_date = '';
  end_date = '';
  availability: boolean | null = null;
  userRole: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private vs: VehicleService,
    private bs: BookingService,
    private snack: MatSnackBar,
    private auth: Auth,
    private router: Router
  ) { }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.vs.get(id).subscribe(v => (this.vehicle = v));
    this.userRole = this.auth.getRole();
  }

  private ensureOneDayMin(): boolean {
    if (!this.start_date) {
      this.snack.open('Select a start date', '', { duration: 1500 });
      return false;
    }
    const s = new Date(this.start_date);
    if (!this.end_date) {
      const e = new Date(s);
      e.setDate(e.getDate() + 1);
      this.end_date = e.toISOString().slice(0, 10);
    } else {
      const e = new Date(this.end_date);
      if (e <= s) {
        const e2 = new Date(s);
        e2.setDate(e2.getDate() + 1);
        this.end_date = e2.toISOString().slice(0, 10);
      }
    }
    return true;
  }

  check() {
    if (!this.ensureOneDayMin()) return;
    this.vs.checkAvailability(this.vehicle.id, this.start_date, this.end_date)
      .subscribe((r: any) => {
        this.availability = r.available;
        this.snack.open(this.availability ? 'Available' : 'Not available', '', { duration: 1500 });
      });
  }

  book() {
    if (!this.ensureOneDayMin()) return;
    const payload = {
      vehicle_id: this.vehicle.id,
      start_datetime: `${this.start_date}T00:00:00Z`,
      end_datetime: `${this.end_date}T00:00:00Z`
    };

    this.bs.create(payload).subscribe({
      next: res => {
        this.snack.open('Vehicle booked successfully!', '', { duration: 2000 });
        setTimeout(() => {
          this.router.navigate(['/renter/bookings']);
        }, 2000); // wait for snackbar to show
      },
      error: err => {
        this.snack.open('Booking failed. Please try again.', '', { duration: 2000 });
        console.error('Booking error:', err.error);
      }
    });
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg';
  }

}
