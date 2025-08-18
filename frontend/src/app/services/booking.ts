import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private base = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) { }

  create(payload: any) {
    return this.http.post(`${this.base}/`, payload);
  }

  list(params?: any) {
    return this.http.get(`${this.base}/`, { params });
  }

  ownerEarnings() {
    return this.http.get(`${this.base}/owner_earnings/`);
  }
  delete(id: number) {
    return this.http.delete(`${this.base}/${id}/`);
  }

}
