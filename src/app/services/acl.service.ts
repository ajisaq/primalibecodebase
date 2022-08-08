import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { secureStorage } from './storage';
// import { navigation } from 'app/navigation/navigation';
// import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class AclService {

    onPermissionsChanged: BehaviorSubject<any>;
    indexedPermissions: any = {};

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
      private _httpClient: HttpClient,
      // private _fuseNavigationService: FuseNavigationService,
    ) { 
      this.onPermissionsChanged = new BehaviorSubject([]);
      
    }

    /**
     * Load logged user permissions
     *
     * @returns {Promise<any>}
     */
    loadCurrentUserPermissions(): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this._httpClient.get(environment.serverURL + '/api/user-permissions')
                    .subscribe((response: any) => {

                        this.indexedPermissions = {};
                        const permissions = response.data || [];
                        const user = response.user;
                        permissions.forEach( (permission: string) => {
                          this.indexedPermissions[permission] = true;
                        });

                        // TODO: remove all unauthorized navigations 
                        // this.removeUnauthorizedNavigations()

                        this.savePermissions(this.indexedPermissions);
                        this.saveUserInfo(user);
                        this.onPermissionsChanged.next(this.indexedPermissions);
                        resolve(permissions);
                    }, reject);
            }
        );
    }

    private savePermissions(permissions: any): void { // todo: change to Map indexed
      secureStorage.savePermissions(permissions);
    }

    public getPermissions(): {} {
      return secureStorage.getPermissions();
    }

    private saveUserInfo(user: any): void {
      secureStorage.saveUserData(user);
    }

    public getUserInfo(): {} {
      return secureStorage.getUserData();
    }

    public canActivate(perm: string|string[]): boolean { // todo: use cached permission if available
      return secureStorage.can(perm);
    }

    public getUsername(): any {
      return secureStorage.getUsername();
    }
    
}
