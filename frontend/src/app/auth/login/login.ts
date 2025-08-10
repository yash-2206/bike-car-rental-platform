import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
  username = '';
  password = '';

  constructor(private auth: Auth, private router: Router, private snack: MatSnackBar) { }

  submit() {
    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        this.snack.open('Logged in', '', { duration: 1500 });
        // route based on role
        this.auth.roleObservable().subscribe(role => {
          if (role === 'owner') this.router.navigate(['/owner/dashboard']);
          else this.router.navigate(['/vehicles']);
        }).unsubscribe();
      },
      error: err => {
        this.snack.open('Login failed', '', { duration: 2000 });
        console.error(err);
      }
    });
  }
}
