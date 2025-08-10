import { Injectable, inject } from '@angular/core';
import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse, HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, filter, take, switchMap, catchError } from 'rxjs';
import { Auth } from './auth';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private auth = inject(Auth);
  private refreshInProgress = false;
  private refreshSubject = new BehaviorSubject<string | null>(null);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getAccessToken();
    let authReq = req;
    if (token) {
      authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }

    return next.handle(authReq).pipe(
      catchError(err => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          // attempt refresh
          if (!this.refreshInProgress) {
            this.refreshInProgress = true;
            this.refreshSubject.next(null);
            return this.auth.refreshToken().pipe(
              switchMap((resp: any) => {
                this.refreshInProgress = false;
                this.auth['setTokens']?.(resp); // private method; if strict, call a public method or repeat logic
                this.refreshSubject.next(resp.access);
                const newReq = req.clone({ setHeaders: { Authorization: `Bearer ${resp.access}` } });
                return next.handle(newReq);
              }),
              catchError(e => {
                this.refreshInProgress = false;
                this.auth.logout();
                return throwError(e);
              })
            );
          } else {
            return this.refreshSubject.pipe(
              filter(Boolean),
              take(1),
              switchMap((accessToken) => {
                const newReq = req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } });
                return next.handle(newReq);
              })
            );
          }
        }
        return throwError(err);
      })
    );
  }
}
