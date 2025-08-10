import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register {
  username = ''; email = ''; password = ''; role = 'renter';
  constructor(private auth: Auth, private router: Router, private snack: MatSnackBar) { }
  submit() {
    this.auth.register(this.username, this.email, this.password, this.role).subscribe({
      next: () => { this.snack.open('Registered', '', { duration: 1200 }); this.router.navigate(['/login']); },
      error: () => this.snack.open('Registration failed', '', { duration: 2000 })
    });
  }
}
