import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse
} from '@angular/common/http';
import { AuthenticationService } from '../services/authentication.service';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { tap } from "rxjs/operators";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(public auth: AuthenticationService, public router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // console.log('Intercepted by TokenInterceptor');
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${this.auth.getToken()}`,
                ContentType:  'application/json',
                AccessControlAllowHeaders: 'Content-Type',
                AccessControlAllowMethods: '*',
                AccessControlAllowOrigin: '*'

            }
        });
        return next.handle(request).pipe(tap((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                // do stuff with response if you want
            }
        }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
                if (err.status === 401) {
                    // redirect to the login route
                    // or show a modal
                    this.auth.logout();
                    this.router.navigate(['auth/login']);
                }
            }
        }));
    }
}