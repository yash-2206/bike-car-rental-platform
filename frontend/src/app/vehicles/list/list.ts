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
  filteredVehicles: any[] = [];  // ✅ now defined
  query: string = '';

  constructor(private svc: VehicleService) { }

  ngOnInit() {
    this.load();
  }

  load() {
    this.svc.list().subscribe((r: any) => {
      this.vehicles = r;
      this.filteredVehicles = [...this.vehicles]; // ✅ copy for filtering
    });
  }

  onSearchChange() {
    const q = this.query.toLowerCase().trim();
    this.filteredVehicles = this.vehicles.filter(v =>
      v.brand?.toLowerCase().includes(q) ||
      v.model?.toLowerCase().includes(q) ||
      v.location?.toLowerCase().includes(q)
    );
  }
  onImageError(event: Event) {
    (event.target as HTMLImageElement).src =
      'https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg';
  }


}
