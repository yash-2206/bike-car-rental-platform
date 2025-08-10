import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../services/auth';
import { AsyncPipe, CommonModule, NgFor, NgIf } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, AsyncPipe, MatToolbarModule, MatButtonModule, MatIconModule, CommonModule
  ],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class Navbar {
  isLogged$;
  role$;

  constructor(private auth: Auth) {
    this.isLogged$ = this.auth.isLoggedIn();
    this.role$ = this.auth.roleObservable();
  }

  logout() { this.auth.logout(); }
}
