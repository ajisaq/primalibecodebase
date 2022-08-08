import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
   
    let url: string = state.url;

    return this.checkLogin(url);    
  }

  checkLogin(url: string): boolean {
    let isLogged = this.authenticationService.isAuthenticated();

    if (isLogged) { 
      return true; 
    }


    // Store the attempted URL for redirecting
      // this.authenticationService.setRedirectUrl(url);


    // Navigate to the login page with extras
    this.router.navigate(['/auth/login',{ redirectUrl: url }]);
    return false;
  }
}
