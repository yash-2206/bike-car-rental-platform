import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-renter-bookings',
  standalone: true,
  imports: [MatListModule,
    MatDividerModule,
    DatePipe,
    CommonModule
  ],
  templateUrl: './bookings.html',
  styleUrls: ['./bookings.scss']
})
export class Bookings implements OnInit {
  bookings: any[] = [];
  constructor(private bs: BookingService) { }

  ngOnInit() {
    this.bs.list().subscribe((r: any) => this.bookings = r);
  }
}
