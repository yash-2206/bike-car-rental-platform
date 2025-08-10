import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VehicleService } from '../../services/vehicle';
import { BookingService } from '../../services/booking';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

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

  constructor(
    private route: ActivatedRoute,
    private vs: VehicleService,
    private bs: BookingService,
    private snack: MatSnackBar
  ) { }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.vs.get(id).subscribe(v => this.vehicle = v);
  }

  check() {
    if (!this.start_date || !this.end_date) return;
    this.vs.checkAvailability(this.vehicle.id, this.start_date, this.end_date).subscribe((r: any) => {
      this.availability = r.available;
      this.snack.open(this.availability ? 'Available' : 'Not available', '', { duration: 1500 });
    });
  }

  book() {
    const payload = { vehicle_id: this.vehicle.id, start_date: this.start_date, end_date: this.end_date };
    this.bs.create(payload).subscribe({
      next: (res) => { this.snack.open('Booked', '', { duration: 1500 }); },
      error: e => { this.snack.open('Booking failed', '', { duration: 2000 }); console.error(e); }
    });
  }
}
