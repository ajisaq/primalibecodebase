import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from 'src/app/services/authentication.service';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { AclService } from 'src/app/services/acl.service';
import { environment } from 'src/environments/environment';

@Component({
    selector     : 'login',
    templateUrl  : './login.component.html',
    styleUrls    : ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit
{
    redirectUrl: string|null;
    loginForm: FormGroup;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _authenticationService: AuthenticationService,
        private _router: Router,
        private route: ActivatedRoute,
        private _aclService: AclService
    )
    { 
        this.redirectUrl = this.route.snapshot.paramMap.get('redirectUrl')?this.route.snapshot.paramMap.get('redirectUrl'):null;
        // console.log(this.redirectUrl);
        this.loginForm = this._formBuilder.group({
            email   : ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
        if(!this._authenticationService.isAuthenticated()){
            // this._authenticationService.login(environment.USER_EMAIL, environment.USER_PASSWORD);
            this.loginForm = this._formBuilder.group({
                email   : [environment.USER_EMAIL, [Validators.required, Validators.email]],
                password: [environment.USER_PASSWORD, Validators.required]
            });

            this.submitLogin();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.loginForm = this._formBuilder.group({
            email   : ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    submitLogin(){

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            //console.log('return log');
            return;
        }

        // this.loading = true;
        this._authenticationService.login(this.loginForm.controls['email'].value, this.loginForm.controls['password'].value)
            .pipe(first())
            .subscribe(
                (data: any) => {
                    //this.router.navigate([this.returnUrl]);
                    
                    // this.redirectUserAfterLogin();

                    // additional step
                    this._aclService.loadCurrentUserPermissions()
                        .then(data=>{
                            // console.log(data);
                        })
                        .finally(()=>{
                            this.redirectUserAfterLogin();
                        })
                },
                (error: any) => {
                    //this.alertService.error(error);
                    // this.loading = false;
                    console.log(error);
                    if(error.error.error == "invalid_grant"){
                        // TODO: do something
                        // this.errorMessage = "Invalid Username or Password";
                        // this._gt.showNotification('top', 'right', 'danger', this.errorMessage);
                    }                
                });
    }

    private redirectUserAfterLogin(): void {
        if(this.redirectUrl){
            this._router.navigate([this.redirectUrl]);
        }else{
            this._router.navigate(['home']);
        }
    }
}
