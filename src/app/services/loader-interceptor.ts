import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ProgressBarService } from '../components/progress-bar/progress-bar.service';
@Injectable({
  providedIn: 'root'
})
export class LoaderInterceptor implements HttpInterceptor {
  constructor(private _progressBarService: ProgressBarService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.method === 'GET' || req.method === 'DELETE'){
      this._progressBarService.setMode('query');
    }else if (req.method === 'POST' || req.method === 'PATCH' || req.method === 'PUT'){
      this._progressBarService.setMode('indeterminate');
    }
    
    this.showLoader();

    return next.handle(req).pipe(tap((event: HttpEvent<any>) => { 
      if (event instanceof HttpResponse) {
        this.onEnd();
      }
    },
      (err: any) => {
        this.onEnd();
    }));
  }
  private onEnd(): void {
    this.hideLoader();
  }
  private showLoader(): void {
    this._progressBarService.show();
  }
  private hideLoader(): void {
    this._progressBarService.hide();
  }
}
