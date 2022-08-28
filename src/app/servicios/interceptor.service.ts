import { Injectable } from '@angular/core';
import  {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpStatusCode} from'@angular/common/http';
import { catchError, Observable, of, throwError}from 'rxjs';
import { AutenticacionService } from './autenticacion.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private ruta:Router, private autenticacionServicio:AutenticacionService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var currentUser=this.autenticacionServicio.usuarioAutenticado;
    if(currentUser && currentUser.jwtToken)
    {
      const authReq = req.clone({
        headers: req.headers.set('Authorization',"Bearer "+ currentUser.jwtToken)
      });
      return next.handle(authReq).pipe(
        catchError(
          (
            httpErrorResponse: HttpErrorResponse,
            _: Observable<HttpEvent<any>>
          ) => {
            if (httpErrorResponse.status === HttpStatusCode.Unauthorized) {
              this.autenticacionServicio.logout();
              this.ruta.navigate(['iniciar-sesion']);
            }
            return throwError(httpErrorResponse);
          }


        ));
    }
    console.log("Interceptor está corriendo" + JSON.stringify(currentUser));

  return next.handle(req);

  }
}
