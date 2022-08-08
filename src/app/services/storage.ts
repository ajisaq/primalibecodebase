import { EncryptStorage } from 'encrypt-storage';
import { environment } from 'src/environments/environment';


// Example of secret_key variable in an .env file
// const encryptStorage = new EncryptStorage(process.env.SECRET_KEY, options);
// export const encryptStorage = new EncryptStorage(environment.STORAGE_SECRET, {});

class PrimalEncryptStorage extends EncryptStorage{

    private permissionsKey = 'permissions';
    private currentUserKey = 'currentuser';
    private userKey = 'userData';
    private printerConfigurationsKey = 'printerConfigurations';

    constructor(key: any, option: any){
        super(key, option);   
    }


    public savePermissions(indexedPermissions: {}): void { // todo: change to Map indexed
        this.setItem(this.permissionsKey, indexedPermissions);
    }
    public getPermissions(): any {
        return this.getItem(this.permissionsKey) || {};
    }
    public getPermissionsArray(): [] {
        return this.getItem(this.permissionsKey).keys();
    }

    public saveCurrentUser(userInfo: any): void {
        this.setItem(this.currentUserKey, userInfo);
    }
    public getCurrentUser(): any {
        return this.getItem(this.currentUserKey);
    }

    public getUsername(): string {
        return this.getCurrentUser() ? this.getCurrentUser().username : 'Guest';
    }

    public getAccessToken(): string {
        return this.getCurrentUser() ? this.getCurrentUser().access_token : null;
    }


    public savePrinterConfigurations(configs: any): void {
        this.setItem(this.printerConfigurationsKey, configs);
    }
    public getPrinterConfigurations(): any {
        return this.getItem(this.printerConfigurationsKey);
    }

    public saveUserData(user: any): void {
        this.setItem(this.userKey, user);
    }
    public getUserData(): any {
        return this.getItem(this.userKey);
    }
    
    public canActivate(permission: any): boolean{
        return this.can(permission);
    }
    public can(perm: string|string[]): boolean {
      const userPermissions: any = this.getPermissions(); //{}
      // give permission to developer user. todo: remove before production
      if (secureStorage.getUsername() === 'postman@primal.com'){
        return true;
      }
      let pass = false;
      if ( Array.isArray(perm) ){
        perm.forEach( (permission: string) => {
          if ( userPermissions[permission] ){
            pass = true;
            return;
          }
        });
      }else if ( typeof perm === 'string' ){
        // perm also add validation type to check multiple permissions OR/AND
        // let passAll = next.data.passAll;
        // .toUpperCase()
        pass = userPermissions[ perm ] ? true : false;
      }
      return pass;
    }

    public clearLoginCredentials(): void {
        this.removeItem(this.currentUserKey);
        this.removeItem(this.permissionsKey);
        // this.removeItem(this.printerConfigurationsKey);
    }

}

export const secureStorage = new PrimalEncryptStorage(environment.STORAGE_SECRET, {});
