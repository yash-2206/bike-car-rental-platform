import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../core/navbar/navbar';
import { Footer } from '../core/footer/footer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Navbar, Footer],
  template: `
    <app-navbar></app-navbar>
    <main class="main-container">
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `,
  styleUrls: ['./layout.scss']
})
export class Layout { }
