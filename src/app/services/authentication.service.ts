import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
// import { Response } from '@angular/http';
import { map, catchError } from 'rxjs/operators';
import { throwError as observableThrowError } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

// import { environment } from '../../environments/environment.prod';
import { environment } from '../../environments/environment';
import { secureStorage } from './storage';
// import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
// import { navigation } from 'app/navigation/navigation';
// import { ApiService } from './api.service';
// import { promise } from 'protractor';
// import { Promise } from 'ag-grid-community';s


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private authURL = environment.serverURL + environment.authURI;

  isLoggedIn = false;

  // store the URL so we can redirect after logging in
  private redirectUrl: string = '';

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    // private _api: ApiService,
    // private navigationService: FuseNavigationService
  ) { }

  login(username: string, password: string): any {

    const httpHeaders = new HttpHeaders();
    // httpHeaders.append('content-type', 'application/x-www-form-urlencoded');
    httpHeaders.append('content-type', 'application/form-data');
    httpHeaders.append('Access-Control-Allow-Origin', environment.serverURL);
    httpHeaders.append('Access-Control-Allow-Method', 'POST');
    // Request headers you wish to allow
    httpHeaders.append('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    const options = {
      headers: httpHeaders
    };

    const body = new FormData();
    // let body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);
    body.set('client_id', environment.PRIMAL_CLIENT_ID);
    body.set('client_secret', environment.PRIMAL_CLIENT_SECRET);
    body.set('grant_type', 'password');

    return this.httpClient.post(this.authURL, body, options).pipe(map((response: any) => {

      // console.log('login-response',response);
      // login successful if there's an access_token in the response
      if (response && response['access_token']) {

        response['username'] = username;

        // store user details and access_token in local storage to keep user logged in between page refreshes
        secureStorage.saveCurrentUser(response);

        this.isLoggedIn = true;

        // TODO: reload navigation items for permissions

        if (this.isNewUser()){
          // redirect to reset password
          // /pages/auth/reset-password-2

        }
      }
      return response;
    })
    );
  }

  logout(): void {
    // remove user from local storage to log user out
    secureStorage.clearLoginCredentials();

    this.isLoggedIn = false;
    // clear token remove user from local storage to log user out
    // this.cookieService.deleteAll('/');
    console.log('Logout')
    this.router.navigate(['auth/login']);
  }

  public getToken(): string {
    return secureStorage.getAccessToken();
  }

  public resetPasswordx(data: any): any {
    return this.httpClient.post(environment.serverURL + '/auth/reset-password', data).pipe(map((response: any) => {

        // console.log('password-reset-msg',response.message);

        return response;
      })
    );
  }

  /**
   * Load logged user permissions
   *
   * @returns {Promise<any>}
   */
  resetPassword(data: any): Promise<any>
  {
      return new Promise((resolve, reject) => {
              this.httpClient.post(environment.serverURL + '/api/auth/reset-password', data)
                  .subscribe((response: any) => {
                    // console.log(response.message);
                      resolve(response);
                  }, reject);
          }
      );
  }
  
  public isNewUser(): boolean {
    return false;
  }

  public isAuthenticated(): boolean {
    // get the token
    const token = this.getToken();
    // return a boolean reflecting 
    // TODO: whether or not the token is expired
    if (token) {
      return true;
    }
    return false;
  }

  private handelError(error: Response): any {
    // return new ErrorObservable(error.json() || 'server error');
    return observableThrowError(error.json() || 'server error');

  }

  public getRedirectUrl(): string{
    return this.redirectUrl;
  }
  public setRedirectUrl(url: string): void {
    this.redirectUrl = url;
  }

  public getUsername(): string {
    return secureStorage.getUsername();
  }
  public user(): string {
    return secureStorage.getUserData();
  }
}
