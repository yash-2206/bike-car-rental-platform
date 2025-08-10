import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { List } from './vehicles/list/list';
import { Detail } from './vehicles/detail/detail';
import { Dashboard } from './owner/dashboard/dashboard';
import { VehicleForm } from './owner/vehicle-form/vehicle-form';
import { Bookings } from './renter/bookings/bookings';
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';
import { Layout } from './layout/layout';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  {
    path: '',
    component: Layout,
    children: [
      { path: 'vehicles', component: List },
      { path: 'vehicles/:id', component: Detail },
      {
        path: 'owner/dashboard',
        component: Dashboard,
        canActivate: [authGuard, roleGuard],
        data: { role: 'owner' }
      },
      {
        path: 'owner/vehicles/new',
        component: VehicleForm,
        canActivate: [authGuard, roleGuard],
        data: { role: 'owner' }
      },
      {
        path: 'owner/vehicles/:id/edit',
        component: VehicleForm,
        canActivate: [authGuard, roleGuard],
        data: { role: 'owner' }
      },
      {
        path: 'renter/bookings',
        component: Bookings,
        canActivate: [authGuard, roleGuard],
        data: { role: 'renter' }
      }
    ]
  },

  { path: '**', redirectTo: 'login' }
];

