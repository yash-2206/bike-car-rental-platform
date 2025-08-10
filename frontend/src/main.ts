import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './app/services/auth.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';

// note: we add interceptor provider by appConfig merged below
bootstrapApplication(App, {
  providers: [provideAnimations(),
  ...appConfig.providers!,
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
}).catch(err => console.error(err));

