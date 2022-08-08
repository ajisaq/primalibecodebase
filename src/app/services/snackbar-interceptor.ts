import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { tap } from 'rxjs/operators';
// import { ProgressBarService } from '../components/progress-bar/progress-bar.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SplashScreenService } from './splash-screen.service';
@Injectable({
  providedIn: 'root'
})
export class SnackbarInterceptor implements HttpInterceptor {

  requestType = 'GET';
  swalMethods = ['POST', 'PATCH', 'PUT', 'DELETE'];

  constructor(private _snackBar: MatSnackBar, private _splashScreenService: SplashScreenService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.requestType = req.method;

    return next.handle(req).pipe(tap((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {

        const isSwal = this.swalMethods.find(method => method === this.requestType);
        // console.log({event});
        if (isSwal) {
          this.showSnackBar(event);
        }
      }
    },
      (err: any) => {
        // prevent Continuous loading on error
        this._splashScreenService.hide();

        this.catchError(err, event);
      }));
  }

  showSnackBar(event: any): void {

    switch (event.status) {
      case 200: // updated
        this.openSnackBarSuccess(event.statusText, event.status);
        break;
      case 201: // created
        this.openSnackBarSuccess(event.statusText, event.status);
        break;
      case 204: // deleted
        this.openSnackBarSuccess('Deleted', event.status);
        break;
      case 404: // notFOund
        this.openSnackBarWarn(event.statusText, event.status);
        break;
      case 500: // Server Error 
        this.openSnackBarWarn('Operation Failed', event.status);
        break;
      default:
        this.openSnackBarDefault(event.statusText, event.status);
        break;
    }


  }

  openSnackBarDefault(message: string, action: string): void {
    this._snackBar.open(message, action, {
      panelClass: 'success',
      duration: 2000,
    });
  }

  openSnackBarSuccess(message: string, action: string): void {
    this._snackBar.open(message, action, {
      panelClass: 'accent',
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  openSnackBarWarn(message: string, action: string): void {
    this._snackBar.open(message, action, {
      panelClass: 'warn',
      duration: 5000,
    });
  }

  openSnackBarError(message: string, action: string): void {
    this._snackBar.open(message, action, {
      panelClass: 'warn',
      duration: 10000,
    });
  }



  catchError(err: any, event: any): void {
    console.error({ err }, { event });
    let title = 'Error occured';
    let description = 'server error';
    if (err.error && err.error['@type'] === 'hydra:Error') {
      title = err.error['hydra:title'];
      description = err.error['hydra:description'];
    }

    // notify developers err
    
    switch (err.status) {
      case 404: // notFOund
        this.openSnackBarError('Item not found', err.status);
        break;
      case 410: // ForeignKeyConstraintViolationException:
        this.openSnackBarError(title + ': Integrity violation. Cannot delete, Item used in other tables', err.status);
        break;
      // 411: //UniqueConstraintViolationException:     
      
      default:
        this.openSnackBarError(title + ': ' + err.message, err.status);
        break;
    }

  }
}
