import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AclService } from 'src/app/services/acl.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AclGuard implements CanActivate {


  constructor(private aclService: AclService, private router: Router, private _snackBar: MatSnackBar) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // console.log('AclGuard Checking..');
    // console.log(state);
    // console.log(next);

    // Always allow if no permission specified
    if(!next.data['can']){
      return true;
    }

    let can = next.data['can'];
    let pass: boolean = this.aclService.canActivate(can);

    if(!pass){
      this._snackBar.open('You dont have the permission to access this page', undefined, {
        duration: 10000,
      });
    }
    return pass;
  }
  
}
