import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking';
import { CommonModule, DatePipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-renter-bookings',
  standalone: true,
  imports: [CommonModule, DatePipe, MatListModule, MatDividerModule],
  templateUrl: './bookings.html',
  styleUrls: ['./bookings.scss']
})
export class Bookings implements OnInit {
  bookings: any[] = [];

  constructor(private bs: BookingService,
    private auth: Auth
  ) { }

  ngOnInit() {
    const renterId = this.auth.getUserId(); // You’d add getUserId() in Auth service
    this.bs.list({ renter_id: renterId }).subscribe((r: any) => {
      this.bookings = r;
    });
  }
}

