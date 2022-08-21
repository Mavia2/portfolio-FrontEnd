import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable}from 'rxjs';
import  {map} from 'rxjs/operators';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
  url=`${environment.baseUrl}/login`;
  currentUserSubject:BehaviorSubject<any>;
  isLoginSubject: BehaviorSubject<boolean>;

  constructor(private http:HttpClient) {
    console.log("El servicio de autenticación está corriendo");
    this.currentUserSubject= new BehaviorSubject<any>(JSON.parse(sessionStorage.getItem('currentUser')|| '{}'));
    this.isLoginSubject = new BehaviorSubject<boolean>(this.hasToken());
   }

   IniciarSesion(credenciales:any):Observable<any>
   {
    //sessionStorage.setItem('token', 'JWT');
    //this.isLoginSubject.next(true);

    return this.http.post(this.url, credenciales).pipe(map(data=>{
      sessionStorage.setItem('currentUser', JSON.stringify(data));
      this.currentUserSubject.next(data);
      sessionStorage.setItem('token', JSON.stringify(data));
      this.isLoginSubject.next(true);
      return data;
    }))
   }

   private hasToken() : boolean {
    return !!localStorage.getItem('token');
  }

   get usuarioAutenticado()
   {
    return this.currentUserSubject.value;
   }

   logout(){
    sessionStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    localStorage.removeItem('token');
    this.isLoginSubject.next(false);
   }

   get estaLogueado(): Observable<boolean>{
    return this.isLoginSubject.asObservable();
   }

}
