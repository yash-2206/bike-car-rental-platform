import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../../services/vehicle';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehicles-list',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, RouterLink, MatInputModule, FormsModule, CommonModule],
  templateUrl: './list.html',
  styleUrls: ['./list.scss']
})
export class List implements OnInit {
  vehicles: any[] = [];
  query = '';


  constructor(private svc: VehicleService) { }

  ngOnInit() { this.load(); }

  load() {
    const params: any = {};
    if (this.query) params.search = this.query;
    this.svc.list(params).subscribe((r: any) => this.vehicles = r);
  }
}
