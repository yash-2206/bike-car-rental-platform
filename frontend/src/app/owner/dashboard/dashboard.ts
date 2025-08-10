import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [MatCardModule, MatListModule, CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit {
  earnings: any = { total_earnings: 0, total_bookings: 0 };
  bookings: any[] = [];

  constructor(private bs: BookingService) { }

  ngOnInit() {
    this.bs.ownerEarnings().subscribe((r: any) => this.earnings = r);
    this.bs.list().subscribe((r: any) => this.bookings = r);
  }
}
