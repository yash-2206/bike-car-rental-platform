import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private base = `${environment.apiUrl}/vehicles`;

  constructor(private http: HttpClient) { }

  list(params?: any) {
    return this.http.get(this.base + '/', { params });
  }
  get(id: number) {
    return this.http.get(`${this.base}/${id}/`);
  }
  create(payload: FormData) {
    // payload is FormData for images
    return this.http.post(this.base + '/', payload);
  }
  update(id: number, payload: any) {
    return this.http.put(`${this.base}/${id}/`, payload);
  }
  delete(id: number) {
    return this.http.delete(`${this.base}/${id}/`);
  }

  // availability check via bookings check_availability
  checkAvailability(vehicle_id: number, start: string, end: string) {
    return this.http.get(`${environment.apiUrl}/bookings/check_availability/`, {
      params: { vehicle_id: `${vehicle_id}`, start, end }
    });
  }
}
