import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { VehicleService } from '../../services/vehicle';
import { Router, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './vehicle-form.html',
  styleUrls: ['./vehicle-form.scss']
})
export class VehicleForm implements OnInit {
  form!: FormGroup;
  id: number | null = null;
  previews: string[] = [];

  constructor(
    private fb: FormBuilder,
    private svc: VehicleService,
    private route: ActivatedRoute,
    private router: Router,
    private snack: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id')) || null;

    this.form = this.fb.group({
      brand: ['', Validators.required],
      model: ['', Validators.required],
      type: ['', Validators.required],
      price_per_day: [0, [Validators.required, Validators.min(1)]],
      hourly_rate: [0, [Validators.required, Validators.min(1)]],
      location: ['', Validators.required],
      available: [true],             // ✅ default available
      images: [null]
    });

    if (this.id) {
      this.svc.get(this.id).subscribe((v: any) => {
        this.form.patchValue({
          brand: v.brand,
          model: v.model,
          type: v.type,
          price_per_day: v.price_per_day,
          hourly_rate: v.hourly_rate,
          location: v.location,
          available: v.available ?? true
        });
      });
    }
  }

  onFiles(event: any) {
    const files: File[] = Array.from(event.target.files || []);
    this.form.patchValue({ images: files });

    this.previews = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e: any) => this.previews.push(e.target.result);
      reader.readAsDataURL(file);
    });
  }

  submit() {
    if (this.form.invalid) {
      this.snack.open('Please fill required fields', '', { duration: 2000 });
      return;
    }

    const fd = new FormData();
    fd.append('brand', this.form.get('brand')?.value);
    fd.append('model', this.form.get('model')?.value);
    fd.append('type', this.form.get('type')?.value);
    fd.append('price_per_day', String(this.form.get('price_per_day')?.value));
    fd.append('hourly_rate', String(this.form.get('hourly_rate')?.value));
    fd.append('location', this.form.get('location')?.value);
    fd.append('available', String(this.form.get('available')?.value)); // ✅ send available

    const files: File[] = this.form.get('images')?.value || [];
    files.forEach(f => fd.append('images', f));

    const call$ = this.id ? this.svc.update(this.id, fd) : this.svc.create(fd);
    call$.subscribe({
      next: () => {
        this.snack.open(this.id ? 'Vehicle updated' : 'Vehicle created', '', { duration: 1500 });
        this.router.navigate(['/owner/dashboard']);
      },
      error: err => {
        console.error('vehicle save error', err);
        this.snack.open('Failed to save vehicle', '', { duration: 2000 });
      }
    });
  }

  cancel() {
    this.router.navigate(['/owner/dashboard']);
  }
}
