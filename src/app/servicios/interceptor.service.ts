import { Injectable } from '@angular/core';
import  {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from'@angular/common/http';
import { catchError, Observable, of}from 'rxjs';
import { AutenticacionService } from './autenticacion.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private autenticacionServicio:AutenticacionService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var currentUser=this.autenticacionServicio.usuarioAutenticado;
    if(currentUser && currentUser.jwtToken)
    {
      const authReq = req.clone({
        headers: req.headers.set('Authorization',"Bearer "+ currentUser.jwtToken)
      });
      return next.handle(authReq).pipe(
        catchError(this.handleAuthError));
    }
    console.log("Interceptor está corriendo" + JSON.stringify(currentUser));

  return next.handle(req);

  }
  private handleAuthError(err: any, caught: any){
    if (err.status === 401){
      this.autenticacionServicio.logout();
      return of(err);
    }
    throw err;
  }

}
